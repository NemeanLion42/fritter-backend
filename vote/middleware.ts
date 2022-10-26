import type {Request, Response, NextFunction} from 'express';
import VoteCollection from './collection';


/**
* Checks that the current user doesn't have a vote entry for the freet with freetId in req.params 
*/
const isUserHasNoVoteForFreet = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId;
    const freetId = req.params.freetId;
    const vote = await VoteCollection.findOne(userId, freetId);
    if (!vote) {
      res.status(403).json({
        error: 'You have not upvoted or downvoted this freet.'
      });
      return;
    }
  
    next();
  };


export {
  isUserHasNoVoteForFreet
};