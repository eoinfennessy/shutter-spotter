import { DbTypes } from "../models/store-types";

export const isDbType = function (input: unknown): input is DbTypes {
  return typeof input === "string" &&
  ["mem", "json", "mongo"].indexOf(input) !== -1;
};
