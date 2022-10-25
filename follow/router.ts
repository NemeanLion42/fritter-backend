import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';
import FollowCollection from './collection';
import { Types } from 'mongoose';

const router = express.Router();

/**
 * Follow a user.
 *
 * @name POST /api/follow/:userId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user is already following the user indicated by userId
 * @throws {404} - If the userId is invalid
 */
router.post(
  '/:userId?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists,
    userValidator.isUserNotCurrentUser,
    followValidator.isCurrentUserNotFollowingUser
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.userId) ?? '';
    const success = await FollowCollection.addFollower(followerId, (req.params.userId as unknown as Types.ObjectId));
    if (success) {
      res.status(200).json({
        message: 'Follow successful'
      });
    } else {
      res.status(403).json({
        message: 'Follow failed'
      });
    }
  }
);

/**
 * Unfollow a user.
 *
 * @name DELETE /api/follow/:userId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user is not following the user indicated by userId
 * @throws {404} - If the userId is invalid
 */
 router.delete(
  '/:userId?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists,
    followValidator.isCurrentUserFollowingUser
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.userId) ?? '';
    const success = await FollowCollection.removeFollower(followerId, (req.params.userId as unknown as Types.ObjectId));
    if (success) {
      res.status(200).json({
        message: 'Unfollow successful'
      });
    } else {
      res.status(403).json({
        message: 'Unfollow failed'
      })
    }
  }
);

/**
 * Get users that user is following
 *
 * @name GET /api/follow/following/:userId
 *
 * @return {Set<Types.ObjectId>} - A set of users that the user indicated by userId is following
 * @throws {404} - If the userId is invalid
 */
 router.get(
  '/following/:userId?',
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const following = await (await FollowCollection.findOneByUserId((req.params.userId as unknown as Types.ObjectId))).following;
    res.status(200).json(following);
  }
);

/**
 * Get followers of user
 *
 * @name GET /api/follow/followers/:userId
 *
 * @return {Set<Types.ObjectId>} - A set of users who follow user indicated by userId
 * @throws {404} - If the userId is invalid
 */
 router.get(
  '/followers/:userId?',
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const followers = await (await FollowCollection.findOneByUserId((req.params.userId as unknown as Types.ObjectId))).followers;
    res.status(200).json(followers);
  }
);

export {router as followRouter};
