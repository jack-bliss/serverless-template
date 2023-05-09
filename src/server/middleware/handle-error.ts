import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

export async function handleError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const timestamp = Date.now();
  if (axios.isAxiosError(error)) {
    console.error({
      timestamp,
      path: req.path,
      message: error.message,
      responseStatus: error.response?.status,
      responseData: JSON.stringify(error.response?.data, null, 2),
      responseHeaders: error.response?.headers,
      responseConfig: error.response?.config,
    });
  } else {
    console.error({
      timestamp,
      path: req.path,
      message: error.message,
      error,
    });
  }
  return res.send(String(timestamp));
}
