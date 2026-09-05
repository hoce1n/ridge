// @ts-check
import { module } from "@prisma/composer";
import appBuilderWorkspaceService from "./service.mjs";

export default module("app-builder-workspace", ({ provision }) => {
  provision(appBuilderWorkspaceService, { id: "appbuilderworkspace" });
});
