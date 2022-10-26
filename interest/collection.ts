import FreetModel from 'freet/model';
import {HydratedDocument, Types} from 'mongoose';
import type {Interest} from './model';
import InterestModel from './model';


class InterestCollection {
  /**
   * Find an Interest by userId and freetId
   * 
   * @param {Types.ObjectId | string} userId - The userId of the Interest to find
   * @param {Types.ObjectId | string} freetId - The freetId of the Interest to find
   * @returns {Promise<HydratedDocument<Interest>> | Promise<null>} - The Interest with the given userId and freetId, if any
   */
  static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Interest>> {
    return InterestModel.findOne({userId: userId, freetId: freetId});
  }

  /**
   * Create or update the Interest with given userId and freetId
   * 
   * @param {Types.ObjectId | string} userId - The userId of the Interest to create/update
   * @param {Types.ObjectId | string} freetId - The freetId of the Interest to create/update
   * @param {boolean} interested - Whether the user is interested in the freet
   * @returns {Promise<boolean>} - Whether the Interest was successfully created/updated
   */
  static async putOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string, interested: boolean): Promise<boolean> {
    var interest = await this.findOne(userId, freetId);
    if (interest) {
      interest.interested = interested;
    } else {
      interest = new InterestModel({
        userId: userId,
        freetId: freetId,
        interested: interested
      });
    }
    await interest.save();
    return true;
  }

  /**
   * Delete the Interest with given userId and freetId
   * 
   * @param {Types.ObjectId | string} userId - The userId of the Interest to delete
   * @param {Types.ObjectId | string} freetId - The freetId of the Interest to delete
   * @returns {Promise<boolean>} - Whether an Interest was deleted
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const deleteResult = await InterestModel.deleteOne({userId: userId, freetId: freetId});
    return deleteResult.deletedCount === 1;
  }

  /**
   * Find the freets a user is interested and not interested in
   * 
   * @param {Types.ObjectId | string} userId - The id of the user to find freets for
   * @returns The ids of the freets the user is interested and not interested in
   */
  static async getFreetInterestByUser(userId: Types.ObjectId | string) {
    const interests = await InterestModel.find({userId: userId});
    const interestedFreets = interests.filter(interest => interest.interested).map(interest => interest.freetId);
    const notInterestedFreets = interests.filter(interest => !interest.interested).map(interest => interest.freetId);
    return {interested: interestedFreets, notInterested: notInterestedFreets};
  }

  /**
   * Find the users interested and not interested in a freet
   * 
   * @param {Types.ObjectId | string} freetId - The id of the freet to find users for
   * @returns The ids of the users interested and not interested in the freet
   */
  static async getUserInterestByFreet(freetId: Types.ObjectId | string) {
    const interests = await InterestModel.find({freetId: freetId});
    const interestedUsers = interests.filter(interest => interest.interested).map(interest => interest.userId);
    const notInterestedUsers = interests.filter(interest => !interest.interested).map(interest => interest.userId);
    return {interested: interestedUsers, notInterested: notInterestedUsers};
  }

  /**
   * Delete all Interests with given userId
   * 
   * @param {Types.ObjectId | string} userId - The userId to delete Interests for
   * @returns {Promise<number>} - The number of Interests deleted
   */
  static async deleteManyByUser(userId: Types.ObjectId | string) : Promise<number> {
    const deleteResult = await InterestModel.deleteMany({userId: userId});
    return deleteResult.deletedCount;
  }

  /**
   * Delete all Interests with given freetId
   * 
   * @param {Types.ObjectId | string} freetId - The freetId to delete Interests for
   * @returns {Promise<number>} - The number of Interests deleted
   */
   static async deleteManyByFreet(freetId: Types.ObjectId | string) : Promise<number> {
    const deleteResult = await InterestModel.deleteMany({freetId: freetId});
    return deleteResult.deletedCount;
  }
}

export default InterestCollection;
