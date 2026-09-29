import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// This file's only job is to load server/.env as early as possible. Import
// it as the FIRST line of any entry point (server.js, api/index.js, seed.js)
// — before any other local import — because ES module imports fully
// evaluate in the order they're written, and any module imported before
// this one that reads process.env at its own top level (not inside a
// function) would otherwise see undefined values.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
