import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';


// Type definition for Follow on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  following: Array<Types.ObjectId>;
  followers: Array<Types.ObjectId>;
};

// Mongoose schema definition for interfacing with a MongoDB table
const FollowSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  following: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  followers: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
