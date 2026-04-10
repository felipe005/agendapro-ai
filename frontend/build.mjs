import { mkdir, readFile, writeFile, rm, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const apiUrl = process.env.VITE_API_URL || "";

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

const htmlTemplate = await readFile(path.join(__dirname, "index.html"), "utf8");
await writeFile(path.join(distDir, "index.html"), htmlTemplate.replaceAll("__VITE_API_URL__", apiUrl));
await copyFile(path.join(__dirname, "script.js"), path.join(distDir, "script.js"));
await copyFile(path.join(__dirname, "styles.css"), path.join(distDir, "styles.css"));

console.log(`Static build generated in dist/ using API ${apiUrl}`);
