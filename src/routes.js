import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';

import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';

const routes = new Router();

const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.send('Hello Word');
});

routes.post('/sessions', SessionController.store);

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

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
