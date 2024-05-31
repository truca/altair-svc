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
} from "graphql-crud";
import { cloneDeep } from "lodash";
import mongoose, { Schema } from "mongoose";

export interface MongoStoreOptions {
  connection: string;
  options?: object;
}

const schema = new Schema({}, { strict: false });

export class MongoStore implements Store {
  public db: any;
  constructor(options: MongoStoreOptions) {
    this.connect(options.connection);
  }

  private async connect(connection: string) {
    this.db = await mongoose.connect(connection);
  }

  public async findOne(props: StoreFindOneProps): Promise<StoreFindOneReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.findOne(this.formatInput(props.where));
    return this.formatOutput(res);
  }

  public async find(props: any /*StoreFindProps*/): Promise<[StoreFindReturn]> {
    const model = this.getModel(props.type.name);
    if (props.limit) {
      const res = await model
        .find(this.formatInput(props.where))
        .limit(props.limit);
      return this.formatOutput(res);
    }

    const res = await model.find(this.formatInput(props.where));
    return this.formatOutput(res);
  }
  public async create(props: StoreCreateProps): Promise<StoreCreateReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.create(props.data);
    // console.log({ res: this.formatOutput(res) });
    return this.formatOutput(res);
  }
  public async update(props: StoreUpdateProps): Promise<StoreUpdateReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.update(
      this.formatInput(props.where),
      {
        $set: props.data,
      },
      {
        upsert: props.upsert,
      }
    );
    return res.n > 0;
  }
  public async remove(props: StoreRemoveProps): Promise<StoreRemoveReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.remove(this.formatInput(props.where));
    return res.n > 0;
  }
  // Adds an `id` field to the output
  private formatOutput(object: any): any {
    if (Array.isArray(object)) {
      return object.map((o) => this.formatOutput(o));
    }
    if (!object) {
      return null;
    }
    if (!object._id) {
      return object;
    }
    const clonedObject = { ...object._doc };
    clonedObject.id = clonedObject._id;
    delete clonedObject._id;
    return clonedObject;
  }
  private formatInput(object: any) {
    if (!object) {
      return null;
    }
    if (!object.id) {
      return object;
    }
    const clonedObject = cloneDeep(object);
    clonedObject._id = new mongoose.Types.ObjectId(clonedObject.id);
    delete clonedObject.id;
    return clonedObject;
  }
  private getModel(modelName: string) {
    return this.db.model(modelName, schema);
  }
}
