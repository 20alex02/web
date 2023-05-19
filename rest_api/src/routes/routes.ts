import express from 'express';
import controller from '../controllers/index';

const routes = express.Router();

// Timetable routes
routes.post('/:employeeId/timetable', controller.timetableCreate);

routes.patch('/:employeeId/timetable/:id', controller.timetableUpdate);

routes.delete('/:employeeId/timetable/:id', controller.timetableDelete);

// Employee routes
routes.get('/', controller.employeeGetAll);

routes.post('/', controller.employeeCreate);

routes.get('/:id', controller.employeeGet);

routes.patch('/:id', controller.employeeUpdate);

routes.delete('/:id', controller.employeeDelete);

export default routes;
