import * as pg from "pg";
import {
  Store,
  StoreCreateProps,
  StoreCreateReturn,
  StoreFindOneProps,
  StoreFindOneReturn,
  StoreFindProps,
  StoreFindReturn,
  StoreRemoveProps,
  StoreRemoveReturn,
  StoreUpdateProps,
  StoreUpdateReturn,
} from "./types";
import { Connector } from "@google-cloud/cloud-sql-connector";
import { v4 as uuidv4 } from "uuid";
import { Context } from "../types";
import {
  ActionTypes,
  getHasNecessaryRolePermissionsToContinue,
  getHasPermissionOnlyThroughAnotherEntity,
} from "../AuthDirective";
import {
  createCSQLTableIfNotExists,
  extractDirectiveParams,
} from "../GraphQL/utils";

const { Pool } = pg;

import { GoogleAuth } from "google-auth-library";

async function getConnector() {
  // Create a GoogleAuth instance with the service account
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform", // adjust the scopes as needed
  });
  const connector = new Connector({ auth } as any);

  const clientOpts = await connector.getOptions({
    instanceConnectionName: "cep-form:us-east1:cep-form-csql-dbs",
    ipType: "PUBLIC" as any, // or 'PRIVATE' depending on your setup
  });

  return { clientOpts, connector };
}

export interface CloudSQLStoreOptions {
  dbName: string;
  user: string;
  password: string;
  database: string;
}

export class CloudSQLStore implements Store {
  private pool: any;

  constructor(options: CloudSQLStoreOptions) {
    this.pool = new pg.Client();
    this.getPool(options).then((client) => {
      this.pool = client;
    });
  }

  private async getPool(baseOptions: CloudSQLStoreOptions) {
    const { dbName: _dbName, ...options } = baseOptions;
    // TODO: connector.close() when done
    const { clientOpts } = await getConnector(); // , connector
    const pool = new Pool({
      ...clientOpts,
      ...options,
      max: 1,
    });
    return pool;
  }

  public async findOne(
    props: StoreFindOneProps,
    context: Context,
    _info: any,
    bypassPermissions?: boolean
  ): Promise<StoreFindOneReturn | null> {
    await createCSQLTableIfNotExists({
      pool: this.pool,
      singularType: props.type.name,
    });

    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      bypassPermissions ||
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.read
      );

    if (!hasNecessaryRolePermissionsToContinue) {
      return null;
    }

    const tableName = props.type.name.toLowerCase();
    const findOneParams = this.formatInput(props.where);

    const query = `SELECT * FROM "${tableName}" WHERE id = $1`;
    const { rows } = await this.pool.query(query, [findOneParams?.id]);

    return rows.length === 0 ? null : this.formatOutput(rows[0]);
  }

  public async find(
    props: StoreFindProps,
    context: Context,
    info: any
  ): Promise<{ list: StoreFindReturn[]; maxPages: number | null }> {
    await createCSQLTableIfNotExists({
      pool: this.pool,
      singularType: props.type.name,
    });

    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.read
      );

    const hasPermissionOnlyThroughAnotherEntity =
      getHasPermissionOnlyThroughAnotherEntity({
        config: directiveParams,
        action: ActionTypes.read,
      });

    const isNestedRequest = info.kind === "Field";
    if (
      !hasNecessaryRolePermissionsToContinue ||
      (hasPermissionOnlyThroughAnotherEntity && !isNestedRequest)
    ) {
      return { list: [], maxPages: null };
    }

    const tableName = props.type.name.toLowerCase();
    const page = props.page || 1;
    const pageSize = props.pageSize || 10;
    const includeMaxPages = props.includeMaxPages || false;
    const findParams = this.formatInput(props.where);
    // const permissionFilters = getSQLFilterForOwnerOrCollaborator(
    //     context?.session
    //     );

    let maxPages: number | null = null;

    if (includeMaxPages && !findParams) {
      const countQuery = `SELECT COUNT(*) AS count FROM "${tableName}"`;
      const { rows } = await this.pool.query(countQuery);
      maxPages = Math.ceil(rows.length / pageSize);
    } else if (includeMaxPages) {
      //   const countQuery = `SELECT COUNT(*) AS count FROM "${tableName}" WHERE ${permissionFilters} AND ?`;
      const countQuery = `SELECT COUNT(*) AS count FROM "${tableName}" WHERE ?`;
      const { rows } = await this.pool.query(countQuery, [findParams]);
      maxPages = Math.ceil(rows.length / pageSize);
    }

    console.log([findParams, pageSize, (page - 1) * pageSize]);

    // Prepare the SQL query and parameters
    const queryParts = [`SELECT * FROM "${tableName}"`];
    const params = [];

    // Handle findParams
    if (findParams) {
      queryParts.push(`WHERE $${params.length + 1}`); // Placeholder for findParams
      params.push(findParams);
    }

    // Add limit clause
    queryParts.push(`LIMIT $${params.length + 1}`); // Placeholder for pageSize
    params.push(pageSize);

    // Handle offset for pagination
    if (page > 1) {
      queryParts.push(`OFFSET $${params.length + 1}`); // Placeholder for offset
      params.push((page - 1) * pageSize);
    }

    // Join the baseQuery with conditions
    const query = queryParts.join(" ");

    // Execute the query
    const { rows } = await this.pool.query(query, params);

    return { list: rows.map(this.formatOutput), maxPages };
  }

  public async create(
    props: StoreCreateProps,
    context: Context,
    _info: any
  ): Promise<StoreCreateReturn> {
    await createCSQLTableIfNotExists({
      pool: this.pool,
      singularType: props.type.name,
    });

    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.create
      );

    if (!hasNecessaryRolePermissionsToContinue) {
      return null;
    }

    const tableName = props.type.name.toLowerCase();
    const id = props.data.id || this.generateId();

    // Store all other properties in the data field as JSON
    const { _id, ...data } = props.data as any;

    const query = `INSERT INTO "${tableName}" (id, data) VALUES ($1, $2) RETURNING id`;
    const { rows } = await this.pool.query(query, [id, JSON.stringify(data)]);

    return rows.length > 0 ? { ...data, id: rows[0].id } : null;
  }

  public async update(
    props: StoreUpdateProps,
    context: Context,
    _info: any,
    bypassPermissions?: boolean
  ): Promise<StoreUpdateReturn> {
    await createCSQLTableIfNotExists({
      pool: this.pool,
      singularType: props.type.name,
    });

    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      bypassPermissions ||
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.update
      );

    if (!hasNecessaryRolePermissionsToContinue) {
      return false;
    }

    const tableName = props.type.name.toLowerCase();
    const findParams = this.formatInput(props.where);

    // Store all updated fields in the data field as JSON
    const updatedData = {
      ...props.data,
    };

    const query = `UPDATE "${tableName}" SET data = $1 WHERE id = $2`;
    const { rowCount } = await this.pool.query(query, [
      JSON.stringify(updatedData),
      findParams?.id,
    ]);

    return rowCount > 0;
  }

  public async remove(
    props: StoreRemoveProps & { hardDelete?: boolean },
    context: Context,
    _info: any
  ): Promise<StoreRemoveReturn> {
    await createCSQLTableIfNotExists({
      pool: this.pool,
      singularType: props.type.name,
    });

    const directiveParams = extractDirectiveParams(
      props.type.astNode as any,
      "auth"
    );
    const hasNecessaryRolePermissionsToContinue =
      getHasNecessaryRolePermissionsToContinue(
        directiveParams,
        context?.session,
        ActionTypes.delete
      );

    if (!hasNecessaryRolePermissionsToContinue) {
      return false;
    }

    const tableName = props.type.name.toLowerCase();
    const findParams = this.formatInput(props.where);

    const query = `DELETE FROM "${tableName}" WHERE id = $1`;
    const { rowCount } = await this.pool.query(query, [findParams?.id]);

    return rowCount > 0;
  }

  // Utility methods
  private formatOutput(object: any): any {
    if (!object) {
      return null;
    }
    return {
      id: object.id,
      ...object.data, // Assuming data is in JSON format
    };
  }

  private formatInput(object: any) {
    if (!object) {
      return null;
    }

    // Assuming the input structure will have an id, we will return it for further use.
    const { _id, ...inputData } = object;

    // If there is an id, we return it separately for SQL queries
    if (inputData.id) {
      const { id, ...dataAttributes } = inputData; // Destructure to separate id
      return { id, data: dataAttributes }; // Return id along with other attributes as data
    }

    // If there's no id, just return the full input as data
    return { data: inputData };
  }

  private generateId(): string {
    // Utility function to generate a unique ID, e.g., UUID
    return uuidv4(); // Replace with UUID generation logic if needed
  }
}
