/* IMPORTANT: Do not modify this file */
import type { Prisma } from '@prisma/client';
import type { AttendanceRecordType } from './common';

export type DateInterval = {
  from: Date;
  to: Date;
};

export type EmployeeCreateData = {
  name: string;
  surname: string;
};

export type EmployeeDeleteData = {
  id: string;
};

export type EmployeeReadSpecificData = {
  id: string;
  order?: Prisma.SortOrder | undefined;
};

export type EmployeeReadMultipleData = {
  hours: number;
  interval?: DateInterval | undefined;
};

export type EmployeeUpdateData =
{
  id: string;
} & ({
  name: string;
  surname?: string;
} | {
  name?: string;
  surname: string;
});

export type TimetableCreateData = TimetableSearchable & {
  type: AttendanceRecordType;
};

export type TimetableUpdateData = TimetableSearchable & {
  id: string;
  type?: AttendanceRecordType;
};

export type TimetableDeleteData = {
  id: string;
  employeeId: string;
};

export type CheckEmployeeData = {
  id: string;
};

export type CheckTimetableRecordData = {
  id: string;
  employeeId: string;
};

export type TimetableSearchable = {
  employeeId: string;
  from: Date,
  to: Date,
};

export type CheckConflictingTimetableRecordsData = TimetableSearchable & {
  timetableId?: string;
};
