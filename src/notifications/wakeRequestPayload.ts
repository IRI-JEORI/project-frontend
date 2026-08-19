export type WakeRequestNavigationParams = { requestId: number };

export const parseWakeRequestPayload = (
  data: Record<string, unknown> | undefined,
): WakeRequestNavigationParams | null => {
  if (data?.type !== 'WAKE_REQUEST') {
    return null;
  }

  const referenceId = data.referenceId;
  if (typeof referenceId !== 'string' || !/^[0-9]+$/.test(referenceId)) {
    return null;
  }

  const requestId = Number(referenceId);
  if (!Number.isSafeInteger(requestId) || requestId <= 0) {
    return null;
  }

  return { requestId };
};
