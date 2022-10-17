import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';


class FollowCollection {
  static async addFollower(followerId: Types.ObjectId, followeeId: Types.ObjectId): Promise<boolean> {
    var followerFollow = await FollowModel.findOne({userId: followerId});
    if (followerFollow == null) {
      followerFollow = new FollowModel({
        userId: followerId,
        following: new Set<Types.ObjectId>(),
        followers: new Set<Types.ObjectId>()
      });
    }
    if (followerFollow.following.has(followeeId)) {
      await followerFollow.save();
      return false;
    }
    followerFollow.following.add(followeeId);
    await followerFollow.save();

    var followeeFollow = await FollowModel.findOne({userId: followeeId});
    if (followeeFollow == null) {
      followeeFollow = new FollowModel({
        userId: followeeId,
        following: new Set<Types.ObjectId>(),
        followers: new Set<Types.ObjectId>()
      });
    }
    if (followeeFollow.followers.has(followerId)) {
      await followeeFollow.save();
      return false;
    }
    followeeFollow.followers.add(followerId);
    await followeeFollow.save();

    return true;
  }

  static async removeFollower(followerId: Types.ObjectId, followeeId: Types.ObjectId): Promise<boolean> {
    var followerFollow = await FollowModel.findOne({userId: followerId});
    if (followerFollow == null) {
      followerFollow = new FollowModel({
        userId: followerId,
        following: new Set<Types.ObjectId>(),
        followers: new Set<Types.ObjectId>()
      });
    }
    if (!followerFollow.following.has(followeeId)) {
      await followerFollow.save();
      return false;
    }
    followerFollow.following.delete(followeeId);
    await followerFollow.save();

    var followeeFollow = await FollowModel.findOne({userId: followeeId});
    if (followeeFollow == null) {
      followeeFollow = new FollowModel({
        userId: followeeId,
        following: new Set<Types.ObjectId>(),
        followers: new Set<Types.ObjectId>()
      });
    }
    if (!followeeFollow.followers.has(followerId)) {
      await followeeFollow.save();
      return false;
    }
    followeeFollow.followers.delete(followerId);
    await followeeFollow.save();

    return true;
  }

  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({_id: userId});
  }
}

export default FollowCollection;
