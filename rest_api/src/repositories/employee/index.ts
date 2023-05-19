import create from './employee/create';
import deleteEmployee from './employee/delete';
import read from './employee/read';
import update from './employee/update';
import timetable from './timetable';

export default {
  create,
  delete: deleteEmployee,
  read,
  update,
  timetable,
};
