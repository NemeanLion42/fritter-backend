import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as voteValidator from '../vote/middleware';
import * as util from './util';
import FollowCollection from './collection';
import { Types } from 'mongoose';
import VoteCollection from './collection';

const router = express.Router();

/**
 * Upvote a freet
 * 
 * @name PUT /api/vote/:freetId/upvote
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is invalid
 */
router.put(
  '/:freetId?/upvote',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const success = await VoteCollection.putOne(req.session.userId, req.params.freetId, true);
    if (success) {
      res.status(200).json({
        message: 'Vote updated successfully'
      });
    } else {
      res.status(403).json({
        message: 'Vote update failed'
      });
    }
  }
);

/**
 * Downvote a freet
 * 
 * @name PUT /api/vote/:freetId/downvote
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is invalid
 */
 router.put(
  '/:freetId?/downvote',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const success = await VoteCollection.putOne(req.session.userId, req.params.freetId, false);
    if (success) {
      res.status(200).json({
        message: 'Vote updated successfully'
      });
    } else {
      res.status(403).json({
        message: 'Vote update failed'
      });
    }
  }
);

/**
 * Revoke upvote/downvote of a freet
 * 
 * @name DELETE /api/vote/:freetId
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user has not upvoted/downvoted the freet indicated by freetId
 * @throws {404} - If the freetId is invalid
 */
 router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    voteValidator.isUserHasNoVoteForFreet
  ],
  async (req: Request, res: Response) => {
    const success = await VoteCollection.deleteOne(req.session.userId, req.params.freetId);
    if (success) {
      res.status(200).json({
        message: 'Vote removed successfully'
      });
    } else {
      res.status(403).json({
        message: 'Vote removal failed'
      });
    }
  }
);

/**
 * Get freets user has upvoted/downvoted
 * 
 * @name GET /api/vote/user/:userId
 * 
 * @return - An array of freets that the user indicated by userId has upvoted
 * @return - An array of freets that the user indicated by userId has downvoted
 * @throws {404} - If the userId is invalid
 */
 router.get(
  '/user/:userId?',
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    res.status(200).json(await VoteCollection.getFreetVotesByUser(req.params.userId));
  }
);

/**
 * Get users who upvoted/downvoted a freet
 * 
 * @name GET /api/vote/freet/:freetId
 * 
 * @return - An array of users who upvoted the freet indicated by freetId
 * @return - An array of users who downvoted the freet indicated by freetId
 * @throws {404} - If the freetId is invalid
 */
 router.get(
  '/freet/:freetId?',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    res.status(200).json(await VoteCollection.getUserVotesByFreet(req.params.freetId));
  }
);

export {router as voteRouter};
