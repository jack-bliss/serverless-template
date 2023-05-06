import { NextFunction, Request, Response } from 'express';
import { getAsset } from '../services';
import { NotFoundError } from '../services/get-asset/not-found-error';

const fileTypeAndContentType = [
  ['css', 'text/css'],
  ['js', 'text/javascript'],
  ['png', 'image/png'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['ico', 'image/x-icon'],
] as const;

export async function serveAssets(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { path } = req;
  if (path.endsWith('/')) {
    return next();
  }
  try {
    const asset = await getAsset(path);
    const [, contentType] =
      fileTypeAndContentType.find(([type]) => {
        return path.endsWith(`.${type}`);
      }) || (['unknown', 'text'] as const);
    res.type(contentType).send(asset);
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof NotFoundError) {
      console.log('!!!is not found error!!!');
      return next();
    }
    next(error);
  }
}
