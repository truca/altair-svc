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
    const findOneParams = this.formatInput(props.where);
    const res = await model.findOne({ ...findOneParams, deletedAt: null });
    return this.formatOutput(res);
  }

  public async find(props: StoreFindProps): Promise<[StoreFindReturn]> {
    const model = this.getModel(props.type.name);
    const page = props.page || 1;
    const pageSize = props.pageSize || 10;
    const findOneParams = this.formatInput(props.where);

    const res = await model
      .find({ ...findOneParams, deletedAt: null })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return this.formatOutput(res);
  }
  public async create(props: StoreCreateProps): Promise<StoreCreateReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.create({ ...props.data, createdAt: new Date() });
    // console.log({ res: this.formatOutput(res) });
    return this.formatOutput(res);
  }
  public async update(props: StoreUpdateProps): Promise<StoreUpdateReturn> {
    const model = this.getModel(props.type.name);
    // const res = await model.updateOne(
    //   this.formatInput(props.where),
    //   {
    //     $set: props.data,
    //   },
    //   {
    //     upsert: props.upsert,
    //   }
    // );
    const res = await model.findOneAndUpdate(
      this.formatInput(props.where),
      {
        $set: props.data,
      },
      { new: true }
    );

    console.log({ res });
    return res;
  }
  public async remove(
    props: StoreRemoveProps & { hardDelete: boolean }
  ): Promise<StoreRemoveReturn> {
    const isHardDelete = props.hardDelete || false;
    if (isHardDelete) {
      return this.hardDelete(props);
    }
    return this.softDelete(props);
  }
  private async hardDelete(
    props: StoreRemoveProps
  ): Promise<StoreRemoveReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.deleteOne(this.formatInput(props.where));
    return res.n > 0;
  }
  private async softDelete(
    props: StoreRemoveProps
  ): Promise<StoreRemoveReturn> {
    const model = this.getModel(props.type.name);
    const res = await model.update(this.formatInput(props.where), {
      $set: {
        deletedAt: new Date(),
      },
    });
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
