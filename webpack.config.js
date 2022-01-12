import { resolve } from 'path';

export const mode = "production";
export const entry = {
  app: "./javascript/index.min.js"
};
export const output = {
  filename: "[name].bundle.js",
  path: resolve(__dirname, "dist")
};