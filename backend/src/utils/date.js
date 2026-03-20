export const getDayRange = (dateString) => {
  const baseDate = dateString ? new Date(`${dateString}T00:00:00`) : new Date();
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(baseDate);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const mergeDateAndTime = (date, time) => new Date(`${date}T${time}:00`);
