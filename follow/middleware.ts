import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from './collection';


/**
* Checks that a user with userId in req.params doesn't exist in the current user's following array
*/
const isCurrentUserNotFollowingUser = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.session.userId;
    const otherUserId = req.params.userId;
    const currentUserFollow = await FollowCollection.findOneByUserId(currentUserId);
    if (currentUserFollow.following.includes(otherUserId as unknown as Types.ObjectId)) {
      res.status(403).json({
        error: 'You are already following this user.'
      });
      return;
    }
  
    next();
  };


/**
* Checks that a user with userId in req.params exists in the current user's following array
*/
const isCurrentUserFollowingUser = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.session.userId;
    const otherUserId = req.params.userId;
    const currentUserFollow = await FollowCollection.findOneByUserId(currentUserId);
    if (!currentUserFollow.following.includes(otherUserId as unknown as Types.ObjectId)) {
      res.status(403).json({
        error: 'You are not following this user.'
      });
      return;
    }
  
    next();
  };


export {
    isCurrentUserNotFollowingUser,
    isCurrentUserFollowingUser
};