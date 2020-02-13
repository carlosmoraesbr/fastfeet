import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.put('/users', UserController.update);

routes.get('/deliveryman', DeliverymanController.index);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.delete('/orders/:id', OrderController.delete);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.get('/delivery/:id/problems', DeliveryProblemsController.index);
routes.post('/delivery/:id/problems', DeliveryProblemsController.store);
routes.delete(
  '/problem/:id/cancel-delivery',
  DeliveryProblemsController.delete
);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
