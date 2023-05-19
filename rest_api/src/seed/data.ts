import type { Attendance, Employee } from '@prisma/client';

const data: (Employee & {
  timetable: (Omit<Attendance, 'employeeId'>)[]
})[] = [
  {
    id: '3a27c46d-299d-416f-b2d2-c4ee8e3806e0',
    name: 'Jimmy',
    surname: 'Carter',
    createdAt: new Date('2023-03-05T12:45:03.000Z'),
    deletedAt: null,
    timetable: [
      {
        id: 'dc8867c6-31da-47ea-b82c-474109d014e8',
        createdAt: new Date('2023-03-05T13:07:16.000Z'),
        deletedAt: null,
        from: new Date('2023-03-05T08:00:00.000Z'),
        to: new Date('2023-03-05T16:00:00.000Z'),
        type: 'Working',
      },
      {
        id: '6fe4a6a8-c171-40ac-9d33-66e74eeda417',
        createdAt: new Date('2023-03-06T09:12:44.000Z'),
        deletedAt: null,
        from: new Date('2023-03-06T08:00:00.000Z'),
        to: new Date('2023-03-06T16:00:00.000Z'),
        type: 'Holiday',
      },
      {
        id: '2ca5d787-6c0a-4243-8c86-e60c96cb3137',
        createdAt: new Date('2023-03-07T08:36:02.000Z'),
        deletedAt: null,
        from: new Date('2023-03-07T08:00:00.000Z'),
        to: new Date('2023-03-07T16:00:00.000Z'),
        type: 'BusinessTrip',
      },
    ],
  },
  {
    id: 'd49ce9e1-aec4-4291-ad6d-e250f9a4be80',
    name: 'Freddy',
    surname: 'Smith',
    createdAt: new Date('2023-03-05T12:47:26.000Z'),
    deletedAt: null,
    timetable: [
      {
        id: '661af562-5809-42e4-b7df-bc44ba47688a',
        createdAt: new Date('2023-03-05T11:48:33.000Z'),
        deletedAt: null,
        from: new Date('2023-03-05T08:00:00.000Z'),
        to: new Date('2023-03-05T16:00:00.000Z'),
        type: 'Working',
      },
      {
        id: '42d6a671-11e7-41c2-8b6c-ab72f0771d2a',
        createdAt: new Date('2023-03-06T08:02:35.000Z'),
        deletedAt: null,
        from: new Date('2023-03-06T08:00:00.000Z'),
        to: new Date('2023-03-06T12:00:00.000Z'),
        type: 'Working',
      },
      {
        id: '2ca2d684-730d-4aa0-9fd6-4cb98f48e0bb',
        createdAt: new Date('2023-03-06T08:32:07.000Z'),
        deletedAt: null,
        from: new Date('2023-03-06T12:00:00.000Z'),
        to: new Date('2023-03-06T16:00:00.000Z'),
        type: 'MedicalCheckup',
      },
    ],
  },
  {
    id: '82885384-25a8-4c0e-8590-1b6e8d5542a1',
    name: 'Jim',
    surname: 'Halpert',
    createdAt: new Date('2023-03-05T12:51:59.000Z'),
    deletedAt: new Date('2023-03-07T17:48:21.000Z'),
    timetable: [
      {
        id: '7ffb02d7-4723-4369-9a54-3d552695b5db',
        createdAt: new Date('2023-03-05T09:12:44.000Z'),
        deletedAt: new Date('2023-03-07T17:48:21.000Z'),
        from: new Date('2023-03-05T08:00:00.000Z'),
        to: new Date('2023-03-05T16:00:00.000Z'),
        type: 'Working',
      },
    ],
  },
];

export default data;
