/*********************************************************************************************************************
 *  Copyright 2021 Configure8, Inc. or its affiliates. All Rights Reserved.                                           *
 *********************************************************************************************************************/

import { IPluginRouteRequest } from "./plugin.route.request.interface";

/**
 * @author Configure8 Engineering
 */

export interface IPlugin {
  init(orgId: string, settingId: string): Promise<void>;
  routeRequest(request: IPluginRouteRequest): Promise<any>;
}