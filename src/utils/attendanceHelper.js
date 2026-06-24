export const isFutureDate = (dateString) => {
  const today = new Date('2026-06-23T06:36:23+05:30');
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(dateString);
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return targetMidnight > todayMidnight;
};

export const isAttendanceLocked = (dateString) => {
  const today = new Date('2026-06-23T06:36:23+05:30');
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(dateString);
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffTime = todayMidnight - targetMidnight;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  // Locked if not the current day (diffDays !== 0)
  return diffDays !== 0;
};
