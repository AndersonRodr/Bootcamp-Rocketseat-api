import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import userController from './app/controllers/UserController';
import sessionController from './app/controllers/SessionController';
import fileController from './app/controllers/FileController';
import providerController from './app/controllers/ProviderController';
import appointmentController from './app/controllers/AppointmentController';
import availableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';
import scheduleController from './app/controllers/ScheduleController';
import notificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', userController.store);
routes.get('/user/', userController.index);
routes.post('/sessions/', sessionController.store);

routes.use(authMiddleware);

routes.put('/user', userController.update);

routes.post('/files', upload.single('file'), fileController.store);

routes.get('/providers', providerController.index);
routes.get('/providers/:providerId/available', availableController.show)

routes.post('/appointment', appointmentController.store);
routes.get('/appointments', appointmentController.index);
routes.put('/appointment/:id', appointmentController.cancel);
routes.get('/userappointments', appointmentController.indexUser);

routes.get('/scheduleslist', scheduleController.index);

routes.get('/notifications', notificationController.index);
routes.put('/notification/:id', notificationController.update);

export default routes;
