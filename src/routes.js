import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';

import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();

const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.send('Hello Word');
});

// Rotas não auth
routes.post('/sessions', SessionController.store);

// Routes 4 Deliveryman update deliveries
routes.get('/deliveryman/deliveries', DeliveryStatusController.index);
routes.get('/deliveryman/:id/deliveries', DeliveryStatusController.show);
routes.put(
  '/deliveryman/:deliveryman_id/deliveries',
  DeliveryStatusController.update
);

// Routor 4 Deliveryman infor has problem
routes.post('/delivery/:delivery_id/problems', DeliveryProblemController.store);

routes.post('/files/signature', upload.single('file'), FileController.store);
// auth routes
routes.use(authMiddleware);

// Recipients routes
routes.get('/recipients', RecipientController.index);
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

// Deliveryman routes
routes.get('/deliveryman', DeliveryManController.index);
routes.post('/deliveryman', DeliveryManController.store);
routes.put('/deliveryman', DeliveryManController.update);
routes.delete('/deliveryman/:id', DeliveryManController.delete);

// Deliveries Routes
routes.get('/delivery', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.get('/delivery/problems', DeliveryProblemController.index);
routes.get('/delivery/:delivery_id/problems', DeliveryProblemController.show);
routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
