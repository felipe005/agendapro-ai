import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`AgendaPro AI API rodando na porta ${env.port}`);
});
