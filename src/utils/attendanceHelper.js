export const isFutureDate = (dateString) => {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(dateString);
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return targetMidnight  < todayMidnight || targetMidnight > todayMidnight;
};

export const isAttendanceLocked = (dateString) => {
  return isFutureDate(dateString);
};
