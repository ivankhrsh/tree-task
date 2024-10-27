import { getPresets } from "eslint-config-molindo";

export default [
  ...(await getPresets(
    "typescript",

    "react",
    "cssModules",
    "tailwind",
    "jest"
  )),

  {},
];