export const formatTime = (time: string): string =>
  /^\d{2}:\d{2}(?::\d{2})?$/.test(time) ? time.slice(0, 5) : time;
