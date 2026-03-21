const pad = (value) => String(value).padStart(2, "0");

export const getDayRange = (dateString) => {
  const baseDate = dateString
    ? new Date(`${dateString}T00:00:00`)
    : new Date();
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(baseDate);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const mergeDateAndTime = (date, time) => new Date(`${date}T${time}:00`);

export const toDateInputValue = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const toTimeInputValue = (date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const getWeekdayFromDate = (dateString) => new Date(`${dateString}T00:00:00`).getDay();

export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
