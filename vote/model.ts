import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';


// Type definition for Vote on the backend
export type Vote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
  upvote: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
const VoteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  upvote: {
    type: Boolean,
    required: true
  }
});

const VoteModel = model<Vote>('Vote', VoteSchema);
export default VoteModel;
