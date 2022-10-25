import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as interestValidator from '../interest/middleware';
import * as util from './util';
import FollowCollection from './collection';
import { Types } from 'mongoose';
import InterestCollection from './collection';

const router = express.Router();

/**
 * Indicate interest in a freet
 * 
 * @name PUT /api/interest/:freetId/interested
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is invalid
 */
router.put(
  '/:freetId?/interested',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const success = await InterestCollection.putOne(req.session.userId, req.params.freetId, true);
    if (success) {
      res.status(200).json({
        message: 'Interest updated successfully'
      });
    } else {
      res.status(403).json({
        message: 'Interest update failed'
      });
    }
  }
);

/**
 * Indicate disinterest in a freet
 * 
 * @name PUT /api/interest/:freetId/not-interested
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is invalid
 */
 router.put(
  '/:freetId?/not-interested',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const success = await InterestCollection.putOne(req.session.userId, req.params.freetId, false);
    if (success) {
      res.status(200).json({
        message: 'Interest updated successfully'
      });
    } else {
      res.status(403).json({
        message: 'Interest update failed'
      });
    }
  }
);

/**
 * Revoke indication of interest/disinterest in a freet
 * 
 * @name DELETE /api/interest/:freetId
 * 
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user has not indicated interest/disinterest in the freet indicated by freetId
 * @throws {404} - If the freetId is invalid
 */
 router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    interestValidator.isUserHasNoInterestOrDisinterestForFreet
  ],
  async (req: Request, res: Response) => {
    const success = await InterestCollection.deleteOne(req.session.userId, req.params.freetId);
    if (success) {
      res.status(200).json({
        message: 'Interest removed successfully'
      });
    } else {
      res.status(403).json({
        message: 'Interest removal failed'
      });
    }
  }
);

/**
 * Get freets user is interested/disinterested in
 * 
 * @name GET /api/interest/user/:userId
 * 
 * @return - An array of freets that the user indicated by userId has indicated interest in
 * @return - An array of freets that the user indicated by userId has indicated disinterest in
 * @throws {404} - If the userId is invalid
 */
 router.get(
  '/user/:userId?',
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    res.status(200).json(await InterestCollection.getFreetInterestByUser(req.params.userId));
  }
);

/**
 * Get users interested/disinterested in a freet
 * 
 * @name GET /api/interest/freet/:freetId
 * 
 * @return - An array of users that have indicated interest in the freet indicated by freetId
 * @return - An array of users that have indicated disinterest in the freet indicated by freetId
 * @throws {404} - If the freetId is invalid
 */
 router.get(
  '/freet/:freetId?',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    res.status(200).json(await InterestCollection.getUserInterestByFreet(req.params.freetId));
  }
);

export {router as interestRouter};
