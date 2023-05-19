/* IMPORTANT: Do not modify this file */
import type { Attendance, Employee } from '@prisma/client';
import type { Result } from '@badrap/result';
import type DbResult from '../../types';

type DbEmployee = DbResult<Employee>;

type DbEmployeeWithTimetable = DbResult<Employee & {
  timetable: Attendance[],
}>;

export type EmployeeCreateResult = DbEmployee;

export type EmployeeDeleteResult = DbEmployeeWithTimetable;

export type EmployeeReadSpecificResult = DbEmployeeWithTimetable;

export type EmployeeReadMultipleResult = DbResult<(Employee & {
  timetable: Attendance[],
})[]>;

export type EmployeeUpdateResult = DbEmployeeWithTimetable;

type DbAttendance = DbResult<Attendance & {
  employee: Employee,
}>;

export type TimetableCreateResult = DbAttendance;

export type TimetableUpdateResult = DbAttendance;

export type TimetableDeleteResult = DbAttendance;

export type TransactionCheckOperationResult = Promise<Result<{}>>;
