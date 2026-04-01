/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_reportData from "../actions/reportData.js";
import type * as mutations_createOrUpdateAgent from "../mutations/createOrUpdateAgent.js";
import type * as mutations_createOrUpdateMysqlSnapshot from "../mutations/createOrUpdateMysqlSnapshot.js";
import type * as mutations_createOrUpdateTask from "../mutations/createOrUpdateTask.js";
import type * as mutations_createTaskLog from "../mutations/createTaskLog.js";
import type * as queries_getAgents from "../queries/getAgents.js";
import type * as queries_getLogs from "../queries/getLogs.js";
import type * as queries_getMysqlData from "../queries/getMysqlData.js";
import type * as queries_getMysqlSnapshots from "../queries/getMysqlSnapshots.js";
import type * as queries_getTaskLogs from "../queries/getTaskLogs.js";
import type * as queries_getTasks from "../queries/getTasks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/reportData": typeof actions_reportData;
  "mutations/createOrUpdateAgent": typeof mutations_createOrUpdateAgent;
  "mutations/createOrUpdateMysqlSnapshot": typeof mutations_createOrUpdateMysqlSnapshot;
  "mutations/createOrUpdateTask": typeof mutations_createOrUpdateTask;
  "mutations/createTaskLog": typeof mutations_createTaskLog;
  "queries/getAgents": typeof queries_getAgents;
  "queries/getLogs": typeof queries_getLogs;
  "queries/getMysqlData": typeof queries_getMysqlData;
  "queries/getMysqlSnapshots": typeof queries_getMysqlSnapshots;
  "queries/getTaskLogs": typeof queries_getTaskLogs;
  "queries/getTasks": typeof queries_getTasks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
