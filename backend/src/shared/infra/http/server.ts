import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import uploadConfig from '@config/upload';

import routes from './routes';

import AppError from '../../errors/AppError';

import '../typeorm/database';
import '@shared/container/index';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on port 3333!');
});
