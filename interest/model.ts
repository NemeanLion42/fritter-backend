import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';


// Type definition for Interest on the backend
export type Interest = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
  interested: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
const InterestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  interested: {
    type: Boolean,
    required: true
  }
});

const InterestModel = model<Interest>('Interest', InterestSchema);
export default InterestModel;
