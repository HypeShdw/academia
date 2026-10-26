// @ts-check
import { module } from "@prisma/composer";
import academiaService from "./service.mjs";

export default module("academia", ({ provision }) => {
  provision(academiaService);
});
