import axios from 'axios';
import { Request, Response } from 'express';

export function handleError(error: Error, req: Request, res: Response) {
  const timestamp = Date.now();
  const path = req.path;
  if (axios.isAxiosError(error)) {
    console.error({
      timestamp,
      path,
      message: error.message,
      responseStatus: error.response?.status,
      responseData: JSON.stringify(error.response?.data, null, 2),
      responseHeaders: error.response?.headers,
      responseConfig: error.response?.config,
    });
  } else {
    console.error({
      timestamp,
      path,
      message: error.message,
      error,
    });
  }
  return res.send({
    timestamp,
    path,
    message: error.message,
    error,
  });
}
