import FreetCollection from '../freet/collection';
import FreetModel, { Freet } from '../freet/model';
import {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';


class FollowCollection {
  /**
   * Create a FollowModel for a new user
   * 
   * @param {Types.ObjectId | string} userId - The id of the user to create a FollowModel for
   * @returns {Promise<boolean>} - Whether a new FollowModel was created successfully
   */
  static async addOne(userId: Types.ObjectId | string): Promise<boolean> {
    const validFormat = Types.ObjectId.isValid(userId);
    const existingFollow = validFormat ? await FollowCollection.findOneByUserId(userId) : '';
    if (existingFollow) {
      return false;
    }
    const follow = new FollowModel({
      userId: userId,
      following: new Types.Array<Types.ObjectId>(),
      followers: new Types.Array<Types.ObjectId>()
    });
    await follow.save();
    return true;
  }

  /**
   * Create a new follow connection
   * 
   * @param {Types.ObjectId | string} followerId - The id of the follower user
   * @param {Types.ObjectId | string} followeeId - The id of the followee user
   * @returns {Promise<boolean>} - Whether the new follow connection was successfully created
   */
  static async addFollower(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<boolean> {
    var followerFollow = await FollowModel.findOne({userId: followerId});
    followerFollow.following.push(followeeId as unknown as Types.ObjectId);
    await followerFollow.save();

    var followeeFollow = await FollowModel.findOne({userId: followeeId});
    followeeFollow.followers.push(followerId as unknown as Types.ObjectId);
    await followeeFollow.save();

    return true;
  }

  /**
   * Remove a follow connection
   * 
   * @param {Types.ObjectId | string} followerId - The id of the follower user
   * @param {Types.ObjectId | string} followeeId - The id of the followee user
   * @returns {Promise<boolean>} - Whether follow connection was successfully removed
   */
   static async removeFollower(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<boolean> {
    var followerFollow = await FollowModel.findOne({userId: followerId});
    const followeeIndex = followerFollow.following.indexOf(followeeId as unknown as Types.ObjectId);
    followerFollow.following.splice(followeeIndex, 1);
    await followerFollow.save();

    var followeeFollow = await FollowModel.findOne({userId: followeeId});
    const followerIndex = followeeFollow.following.indexOf(followerId as unknown as Types.ObjectId);
    followeeFollow.followers.splice(followerIndex, 1);
    await followeeFollow.save();

    return true;
  }

  /**
   * Get the FollowModel of a given user
   * 
   * @param {Types.ObjectId | string} userId - The id of the user to find the FollowModel of
   * @returns {Promise<HydratedDocument<Follow>>} - The FollowModel of the user
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({userId: userId});
  }

  /**
   * Remove all follow connections involving a user and delete their FollowModel
   * 
   * @param {Types.ObjectId | string} userId - The id of the user to remove all references to
   * @returns {Promise<boolean>} - Whether all references were successfully removed
   */
  static async removeAllReferences(userId: Types.ObjectId | string): Promise<boolean> {
    const userFollow = await this.findOneByUserId(userId);
    var success = true;
    for (const followerId of userFollow.followers) {
      if (!await FollowCollection.removeFollower(followerId, userId)) success = false;
    }
    for (const followeeId of userFollow.following) {
      if (!await FollowCollection.removeFollower(userId, followeeId)) success = false;
    }
    const deleteResult = await FollowModel.deleteOne({userId: userId});
    if (deleteResult.deletedCount !== 1) success = false;
    return success;
  }

  /**
   * Get the freets in a user's following feed
   * 
   * @param userId - The id of the user to get the following feed for
   * @returns {Promise<HydratedDocument<Freet>[]>} - An array of freets in the user's following feed
   */
  static async getFollowingFeed(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Freet>>> {
    const following = (await FollowModel.findOne({userId: userId})).following;
    return FreetModel.find({authorId: {$in: following}}).sort({dateCreated: -1}).populate('authorId');
  }
}

export default FollowCollection;
