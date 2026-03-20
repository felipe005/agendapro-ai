export const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? "Erro interno do servidor.";

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
  });
};

