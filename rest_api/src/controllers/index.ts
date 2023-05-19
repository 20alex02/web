import { employeeGet, employeeGetAll } from './employee/get';
import employeeCreate from './employee/post';
import employeeUpdate from './employee/patch';
import employeeDelete from './employee/delete';
import timetableCreate from './timetable/post';
import timetableUpdate from './timetable/patch';
import timetableDelete from './timetable/delete';

export default {
  employeeGet,
  employeeGetAll,
  employeeCreate,
  employeeUpdate,
  employeeDelete,
  timetableCreate,
  timetableUpdate,
  timetableDelete,
};
