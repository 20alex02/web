/* IMPORTANT: Do not modify this file */
export const AttendanceRecordTypeEnumeration = [
  'Working',
  'Holiday',
  'BusinessTrip',
  'MedicalCheckup',
  'UnpaidLeave',
  'ParentalLeave',
] as const;

export type AttendanceRecordType = typeof AttendanceRecordTypeEnumeration[0]
  | typeof AttendanceRecordTypeEnumeration[1]
  | typeof AttendanceRecordTypeEnumeration[2]
  | typeof AttendanceRecordTypeEnumeration[3]
  | typeof AttendanceRecordTypeEnumeration[4]
  | typeof AttendanceRecordTypeEnumeration[5];
