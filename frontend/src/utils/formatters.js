export const formatDateTime = (dateString) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(dateString));

const pad = (value) => String(value).padStart(2, "0");

export const getTodayInput = () => {
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const toDateInputValue = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const toTimeInputValue = (dateString) => {
  const date = new Date(dateString);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value || 0));

export const weekdayLabels = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];
