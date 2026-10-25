import { Request, Response } from 'express';
import { IProfileDataLoaders } from '../../modules/profile/loaders/profile.loaders';

export interface IGraphQLContext {
  req: Request;
  res: Response;
  loaders: IProfileDataLoaders;
}
