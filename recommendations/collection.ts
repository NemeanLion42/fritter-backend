import FreetCollection from '../freet/collection';
import FreetModel, { Freet } from '../freet/model';
import {HydratedDocument, Types} from 'mongoose';
import { stringify } from 'uuid';
import VoteModel from '../vote/model';
import InterestModel from 'interest/model';
import FollowModel from '../follow/model';


class RecommendationsCollection {

  static async scoreFreetForUser(freet: HydratedDocument<Freet>, userId: Types.ObjectId | string): Promise<number> {
    return await VoteModel.count({ freetId: freet._id, upvote: true }) - await VoteModel.count({ freetId: freet._id, upvote: false }) + ((await FollowModel.findOne({userId: userId})).following.includes(freet.authorId) ? 10 : 0);
  }
  /**
   * Get the freets in a user's recommendations feed
   * 
   * @param userId - The id of the user to get the recommendations feed for
   * @returns {Promise<HydratedDocument<Freet>[]>} - An array of freets in the user's recommendations feed
   */
  static async getRecommendationsFeed(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Freet>>> {
    // async function compareFreets(freet1, freet2): Promise<number> {
    //   return (await RecommendationsCollection.scoreFreetForUser(freet1, userId)) - (await RecommendationsCollection.scoreFreetForUser(freet2, userId));
    // };
    const freets = await FreetModel.find({});

    const freetsToScores = new Map();
    for (const freet of freets) {
      freetsToScores.set(freet, await this.scoreFreetForUser(freet, userId));
    }
    freets.sort(function(freet1, freet2) {return freetsToScores.get(freet2)-freetsToScores.get(freet1)});
    return freets;
  }
}

export default RecommendationsCollection;
