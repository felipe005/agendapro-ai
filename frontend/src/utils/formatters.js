export const formatDateTime = (dateString) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(dateString));

export const getTodayInput = () => new Date().toISOString().split("T")[0];

