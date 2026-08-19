import { parseWakeRequestPayload } from '../wakeRequestPayload';

describe('parseWakeRequestPayload', () => {
  it('creates navigation params from a valid WAKE_REQUEST payload', () => {
    expect(
      parseWakeRequestPayload({ type: 'WAKE_REQUEST', referenceId: '42' }),
    ).toEqual({ requestId: 42 });
  });

  it.each([
    undefined,
    '',
    'abc',
    '-1',
    '0',
    '1.5',
    String(Number.MAX_SAFE_INTEGER + 1),
  ])('rejects invalid referenceId %p', referenceId => {
    expect(
      parseWakeRequestPayload({
        type: 'WAKE_REQUEST',
        ...(referenceId === undefined ? {} : { referenceId }),
      }),
    ).toBeNull();
  });

  it('ignores other notification types', () => {
    expect(
      parseWakeRequestPayload({ type: 'BEDTIME_REMINDER', referenceId: '42' }),
    ).toBeNull();
  });
});
