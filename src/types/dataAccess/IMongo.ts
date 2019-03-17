import * as mongoose from 'mongoose';

export default interface IMongo {
  client: mongoose.Connection;
  connect(): Promise<mongoose.Mongoose>;
}
