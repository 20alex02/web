-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "from" DATETIME NOT NULL,
    "to" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_type_fkey" FOREIGN KEY ("type") REFERENCES "AttendanceType" ("type") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttendanceType" (
    "type" TEXT NOT NULL PRIMARY KEY
);

-- Custom call, added by us - not by Prisma.
BEGIN TRANSACTION;
INSERT INTO "AttendanceType" ("type") VALUES ("Working");
INSERT INTO "AttendanceType" ("type") VALUES ("Holiday");
INSERT INTO "AttendanceType" ("type") VALUES ("BusinessTrip");
INSERT INTO "AttendanceType" ("type") VALUES ("MedicalCheckup");
INSERT INTO "AttendanceType" ("type") VALUES ("UnpaidLeave");
INSERT INTO "AttendanceType" ("type") VALUES ("ParentalLeave");
COMMIT;
