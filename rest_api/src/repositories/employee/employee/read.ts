import { Result } from '@badrap/result';
import {
  subMonths,
  lastDayOfMonth,
  startOfMonth,
  endOfDay,
  startOfDay,
  differenceInMinutes,
} from 'date-fns';
import client from '../../client';
import { DeletedRecordError, NonexistentRecordError } from '../types/errors';
import type {
  EmployeeReadMultipleData,
  EmployeeReadSpecificData,
} from '../types/data';
import type {
  EmployeeReadMultipleResult,
  EmployeeReadSpecificResult,
} from '../types/return';
import { genericError } from '../../types';

/**
 * Create a repository call that reads data about a specific employee.
 * The timetable data is by default ordered by its `from` property
 * in descending order.
 * If an optional parameter `data.order` is passed, it is used as the order
 * strategy for ordering timetable records instead.
 *
 * Special cases for an error (returned error type and message):
 *
 * - NonexistentRecordError('The specified employee does not exist!')
 * - DeletedRecordError('The specified employee has already been deleted!')
 *
 * All other errors should be convered by a generic error.
 *
 * @param data object containing an id and potentially an explicit order
 *             strategy for timetable records (`from` property)
 * @returns - On success: Employee and their timetable data
 *          - On failure: Either a special error (mentioned earlier), or a
 *                        generic error
 */
const specific = async (
  data: EmployeeReadSpecificData,
): EmployeeReadSpecificResult => {
  try {
    const employee = await client.employee.findUnique({
      where: {
        id: data.id,
      },
      include: {
        timetable: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            from: data.order ?? 'desc',
          },
        },
      },
    });
    if (employee == null) {
      throw new NonexistentRecordError('The specified employee does not exist!');
    }
    if (employee.deletedAt != null) {
      throw new DeletedRecordError('The specified employee has already been deleted!');
    }
    return Result.ok(employee);
  } catch (e) {
    return genericError;
  }
};

/**
 * Write a function that returns a filter interval.
 * If the `data.interval` exists,
 * use the `data.interval.from` and `data.interval.to` dates.
 * If it does not exist, use the first day of the last month and the last day
 * of last month as the `from` and `to` dates.
 * (both Day.js and date-fns provide such date setting functions, DO NOT
 * attempt to write that logic by yourself)
 *
 * In both cases, set the returned `from` date's time to `T00:00:00.000Z`,
 * and set the returned `to` date's time to `23:59:59.999Z`.
 *
 * In date-fns, this can be achieved via calling:
 * ```ts
 * import { format } from 'date-fns';
 *
 * // `data.interval.from` and `data.interval.to` are both types Date
 * // note: same can (and should) be applied to dates when `data.interval` is
 * //       not defined
 *
 * // formatted `from` value
 * const formattedFromDate = new Date(
 *   format(data.interval.from, 'yyyy-MM-dd') + 'T00:00:00.000Z',
 * );
 * // formatted `to` date
 * const formattedToDate = new Date(
 *   format(data.interval.to, 'yyyy-MM-dd') + 'T23:59:59.999Z',
 * );
 * ```
 *
 * We're sure Day.js provides an equivalent way of setting the date
 *
 * The `data.interval.from` and `data.interval.to` properties are INCLUSIVE
 *
 *
 * @param data optional object. If contained, specifies the desired number
 *             of hours which the employees have worked (to filter by),
 *             as well as the desired interval
 *             (if empty, last month is chosen as the interval)
 * @returns
 * \{
 *   from: Date,
 *   to: Date
 * }
 * with the `from` property's time set to `T00:00:00.000Z`
 * and the `to` property's time set to `23:59:59.999Z`
 */
const getInterval = (data?: EmployeeReadMultipleData): {
  from: Date,
  to: Date,
} => {
  const prevMonth = subMonths(new Date(), 1);
  const interval = data?.interval ? {
    from: data.interval.from,
    to: data.interval.to,
  } : {
    from: startOfMonth(prevMonth),
    to: lastDayOfMonth(prevMonth),
  };
  interval.from = startOfDay(interval.from);
  interval.to = endOfDay(interval.to);
  return interval;
};

/**
 * Create a repository call that is able to retrieve employees and their
 * timetable records. The employees are ordered by their
 * surnames and then by their birth names alphabetically.
 *
 * Optionally, when hours are specified, it filters the employees
 * (after pulling them from the db) which have worked at least
 * the number of hours specified in a specified interval. Interval precision is
 * set to days.
 * If no interval is specified, it filters the data from the previous month.
 * Only timetable records that count towards work hours are
 * "Working" and "BusinessTrip".
 *
 * The input parameters (correct interval, non negative number of hours, etc.)
 * should be checked BEFORE the database call.
 *
 * Hints for Date manipulation and the post-db filtering are
 * in the comments.
 *
 * @param data optional object. If contained, specifies the desired number
 *             of hours which the employees have worked (to filter by),
 *             as well as the desired interval
 *             (if empty, last month is chosen as the interval)
 * @returns - On success(no parameters): All employees
 *          - On success(hours entered): All employees that worked at least
 *            `hours` number of hours last month
 *          - On success(hours entered, interval entered): All employees
 *            that worked at least `hours` number of hours in the specified
 *            time interval (interval precision = days!)
 *          - On failure: a generic error
 */
const multiple = async (
  data?: EmployeeReadMultipleData,
): EmployeeReadMultipleResult => {
  try {
    /*
      - Handle working with the dates from the `data` parameter by finishing
        the `getInterval` function.

      - use the prepared query (`from` and `to` properties are inclusive)

      - if `data` parameter of the function is not defined, return the data
        retrieved by the query

      - if `data` is defined, filter the retrieved data in TypeScript
        (not via Prisma) - we will only accept functional approach of data
        filtering. Hint: Use `.filter()` to filter the list stored
        in the `result` variable; within the filter function body
        do the following:
        - for each employee, filter their timetable records' type to
          only count the `Working` or `BusinessTrip` records
        - transform (map) the timetable objects to numbers by finding
          the difference between the `to` and `from` timetable fields
          in **minutes**
          (both Day.js and date-fns provide such diffing functions, DO NOT
           attempt to write that logic by yourself)
        - use `.reduce()` to produce a sum of total minutes that the
          employee has worked during the specified interval
          and store the sum in a variable
        - The filter condition (what the filter function should return) is
          "sum of total minutes" variable `>= data.hours * 60`
     */
    const filterInterval = getInterval(data);
    const employeeFilter = data ? {
      deletedAt: null,
      timetable: {
        some: {
          deletedAt: null,
          // in this case, the provided values <from, to> are inclusive
          // both days belong to the interval
          from: {
            gte: filterInterval.from,
          },
          to: {
            lte: filterInterval.to,
          },
        },
      },
    } : {
      deletedAt: null,
    };

    const timetableFilter = data ? {
      deletedAt: null,
      // in this case, the provided values <from, to> are inclusive
      // both days belong to the interval
      from: {
        gte: filterInterval.from,
      },
      to: {
        lte: filterInterval.to,
      },
    } : {
      deletedAt: null,
    };

    const result = await client.employee.findMany({
      where: employeeFilter,
      orderBy: [
        { surname: 'asc' },
        { name: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        timetable: {
          where: timetableFilter,
          orderBy: {
            from: 'desc',
          },
        },
      },
    });

    // return all data
    if (data === undefined) {
      return Result.ok(result);
    }

    // return filtered data
    return Result.ok(
      /* Filter the data as described */
      result.filter(
        (emFilter) => {
          const totalMinutes = emFilter.timetable.filter((attendance) => attendance.type === 'Working' || attendance.type === 'BusinessTrip')
            .map((attendace) => differenceInMinutes(attendace.to, attendace.from))
            .reduce((a, b) => a + b, 0);
          return totalMinutes >= data.hours * 60;
        },
      ),
    );
  } catch (e) {
    return genericError;
  }
};

export default {
  all: multiple,
  one: specific,
};
