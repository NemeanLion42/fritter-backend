import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as freetUtil from '../freet/util';
import FollowCollection from '../follow/collection';
import { Types } from 'mongoose';
import RecommendationsCollection from './collection';

import UserCollection from './collection';
import { request } from 'http';

const router = express.Router();

/**
 * Get the freets of the user's recommendations feed
 * 
 * @name GET /api/recommendations/feed
 * 
 * @return {FreetResponse[]} - An array of freets recommended for the user, sorted using a combination of who the user is following, what freets they have indicated interest in, what freets other users have upvoted, and how recently the freets were posted
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/feed',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const freets = await RecommendationsCollection.getRecommendationsFeed(req.session.userId);
    const response = freets.map(freetUtil.constructFreetResponse);
    res.status(200).json(response);
  }
);

export {router as recommendationsRouter};
