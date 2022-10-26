import FreetModel from 'freet/model';
import {HydratedDocument, Types} from 'mongoose';
import type {Vote} from './model';
import VoteModel from './model';


class VoteCollection {
  /**
   * Find an Vote by userId and freetId
   * 
   * @param {Types.ObjectId | string} userId - The userId of the Vote to find
   * @param {Types.ObjectId | string} freetId - The freetId of the Vote to find
   * @returns {Promise<HydratedDocument<Vote>> | Promise<null>} - The Vote with the given userId and freetId, if any
   */
  static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Vote>> {
    return VoteModel.findOne({userId: userId, freetId: freetId});
  }

  /**
   * Create or update the Vote with given userId and freetId
   * 
   * @param {Types.ObjectId | string} userId - The userId of the Vote to create/update
   * @param {Types.ObjectId | string} freetId - The freetId of the Vote to create/update
   * @param {boolean} upvote - Whether the user is upvoting the freet
   * @returns {Promise<boolean>} - Whether the Vote was successfully created/updated
   */
  static async putOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string, upvote: boolean): Promise<boolean> {
    var vote = await this.findOne(userId, freetId);
    if (vote) {
      vote.upvote = upvote;
    } else {
      vote = new VoteModel({
        userId: userId,
        freetId: freetId,
        upvote: upvote
      });
    }
    await vote.save();
    return true;
  }

  /**
   * Delete the Vote with given userId and freetId
   * 
   * @param {Types.ObjectId | string} userId - The userId of the Vote to delete
   * @param {Types.ObjectId | string} freetId - The freetId of the Vote to delete
   * @returns {Promise<boolean>} - Whether an Vote was deleted
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const deleteResult = await VoteModel.deleteOne({userId: userId, freetId: freetId});
    return deleteResult.deletedCount === 1;
  }

  /**
   * Find the freets a user has upvoted and downvoted
   * 
   * @param {Types.ObjectId | string} userId - The id of the user to find freets for
   * @returns The ids of the freets the user has upvoted and downvoted
   */
  static async getFreetVotesByUser(userId: Types.ObjectId | string) {
    const votes = await VoteModel.find({userId: userId});
    const upvotedFreets = votes.filter(vote => vote.upvote).map(vote => vote.freetId);
    const downvotedFreets = votes.filter(vote => !vote.upvote).map(vote => vote.freetId);
    return {upvote: upvotedFreets, downvote: downvotedFreets};
  }

  /**
   * Find the users who have upvoted and downvoted a freet
   * 
   * @param {Types.ObjectId | string} freetId - The id of the freet to find users for
   * @returns The ids of the users who have upvoted and downvoted the freet
   */
  static async getUserVotesByFreet(freetId: Types.ObjectId | string) {
    const votes = await VoteModel.find({freetId: freetId});
    const upvotingUsers = votes.filter(vote => vote.upvote).map(vote => vote.userId);
    const downvotingUsers = votes.filter(vote => !vote.upvote).map(vote => vote.userId);
    return {upvote: upvotingUsers, downvote: downvotingUsers};
  }

  /**
   * Delete all Votes with given userId
   * 
   * @param {Types.ObjectId | string} userId - The userId to delete Votes for
   * @returns {Promise<number>} - The number of Votes deleted
   */
  static async deleteManyByUser(userId: Types.ObjectId | string) : Promise<number> {
    const deleteResult = await VoteModel.deleteMany({userId: userId});
    return deleteResult.deletedCount;
  }

  /**
   * Delete all Votes with given freetId
   * 
   * @param {Types.ObjectId | string} freetId - The freetId to delete Votes for
   * @returns {Promise<number>} - The number of Votes deleted
   */
   static async deleteManyByFreet(freetId: Types.ObjectId | string) : Promise<number> {
    const deleteResult = await VoteModel.deleteMany({freetId: freetId});
    return deleteResult.deletedCount;
  }
}

export default VoteCollection;
