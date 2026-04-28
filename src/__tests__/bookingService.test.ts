/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */
import * as db from '../config/db';

jest.mock('../config/db');

const mockedDbQuery = db.dbQuery as jest.MockedFunction<typeof db.dbQuery>;

import bookingService from '../services/bookingService';

describe('bookingService', () => {
  beforeEach(() => {
    mockedDbQuery.mockReset();
  });

  test('createBooking throws when table not found', async () => {
    mockedDbQuery.mockResolvedValueOnce([] as any); // table select
    await expect(
      bookingService.createBooking({
        tableId: 999,
        partySize: 2,
        startTime: '2026-01-01T10:00:00Z',
        endTime: '2026-01-01T11:00:00Z',
      }),
    ).rejects.toThrow('Table not found');
  });

  test('createBooking throws when party size exceeds capacity', async () => {
    mockedDbQuery.mockResolvedValueOnce([{ capacity: 2 }] as any); // table select
    await expect(
      bookingService.createBooking({
        tableId: 1,
        partySize: 4,
        startTime: '2026-01-01T10:00:00Z',
        endTime: '2026-01-01T11:00:00Z',
      }),
    ).rejects.toThrow('Party size exceeds table capacity');
  });

  test('createBooking throws when time conflict exists', async () => {
    mockedDbQuery.mockResolvedValueOnce([{ capacity: 4 }] as any); // table select
    mockedDbQuery.mockResolvedValueOnce([{ id: 123 }] as any); // conflict check
    await expect(
      bookingService.createBooking({
        tableId: 1,
        partySize: 2,
        startTime: '2026-01-01T10:00:00Z',
        endTime: '2026-01-01T11:00:00Z',
      }),
    ).rejects.toThrow('Table not available at requested time');
  });
});
