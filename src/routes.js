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
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Recipients
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

// Users
routes.put('/users', UserController.update);

// Deliverymen
routes.post('/deliverymen', UserController.store);
routes.get('/deliverymen', DeliverymanController.index);
routes.put('/deliverymen', UserController.update);

routes.get('/deliverymen/:deliverymanId/available', AvailableController.index);
routes.get('/deliverymen/:deliverymanId/deliveries', DeliveryController.index);

// Orders
routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders', OrderController.update);
routes.delete('/orders/:orderId', OrderController.delete);

// Notifications
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// Problems
routes.get('/delivery/:orderId/problems', DeliveryProblemsController.index);
routes.post('/delivery/:orderId/problems', DeliveryProblemsController.store);
routes.delete(
  '/problem/:deliveryProblemId/cancel-delivery',
  DeliveryProblemsController.delete
);

// Files
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
