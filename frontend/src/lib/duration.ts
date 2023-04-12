export const hoursFromSeconds = (d: number) => Math.floor(d / 3600);
export const minutesFromSeconds = (d: number) => Math.floor((d % 3600) / 60);
export const secondsFromSeconds = (d: number) => Math.floor((d % 3600) % 60);

export const formatDuration = (d: number) => {
  const h = hoursFromSeconds(d);
  const m = minutesFromSeconds(d);
  const s = secondsFromSeconds(d);

  const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};

/**
 * @param time
 * @returns number padded with one zero
 * @example padTime(9) => "09"
 * @example padTime(11) => "11"
 */
const padTime = (time: number) => String(time).padStart(2, "0");

export const formatDurationDigital = (d: number) => {
  const h = hoursFromSeconds(d);
  const m = minutesFromSeconds(d);
  const s = secondsFromSeconds(d);

  return `${padTime(h)}:${padTime(m)}:${padTime(s)}`;
};
