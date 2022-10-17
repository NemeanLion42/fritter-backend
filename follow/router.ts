import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import FollowCollection from './collection';
import { Types } from 'mongoose';

const router = express.Router();


router.post(
  '/:userId?',
  [userValidator.isUserLoggedIn],
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
      })
    }
  }
);

router.delete(
  '/:userId?',
  [userValidator.isUserLoggedIn],
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

router.get(
  '/following/:userId?',
  [],
  async (req: Request, res: Response) => {
    const following = await (await FollowCollection.findOneByUserId((req.params.userId as unknown as Types.ObjectId))).following;
    res.status(200).json(following);
  }
);

router.get(
  '/followers/:userId?',
  [],
  async (req: Request, res: Response) => {
    const followers = await (await FollowCollection.findOneByUserId((req.params.userId as unknown as Types.ObjectId))).followers;
    res.status(200).json(followers);
  }
);

export {router as followRouter};
