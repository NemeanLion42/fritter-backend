import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import InterestCollection from './collection';
import FollowCollection from './collection';


/**
* Checks that the current user doesn't have an interest or disinterest entry for the freet with freetId in req.params 
*/
const isUserHasNoInterestOrDisinterestForFreet = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId;
    const freetId = req.params.freetId;
    const interest = await InterestCollection.findOne(userId, freetId);
    if (!interest) {
      res.status(403).json({
        error: 'You have not indicated interest or disinterest for this freet.'
      });
      return;
    }
  
    next();
  };


export {
    isUserHasNoInterestOrDisinterestForFreet
};