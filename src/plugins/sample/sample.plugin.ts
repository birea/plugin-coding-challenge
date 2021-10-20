/*********************************************************************************************************************
 *  Copyright 2021 Configure8, Inc. or its affiliates. All Rights Reserved.                                           *
 *********************************************************************************************************************/

/**
 * @author Configure8 Engineering
 */

 import {
  Plugin,
  PluginType,
  PluginScope,
  PluginSetting,
  IPlugin,
  Setting,
  IPluginRouteRequest,
  HttpVerb,
  PluginRestExtension,
  MissingSettingError,
  RestServerError,
  SettingsManager
} from "../../core";

import { WebClient } from './webclient.mock';

@Plugin({
  name: "SampleMessenger",
  scope: PluginScope.PROVIDER,
  type: PluginType.MSG,
})
export default class SampleMessenger implements IPlugin {
  @PluginSetting({ name: "access_token", displayName: "Access Token" })
  accessToken: string;

  @PluginSetting({ name: "channel_id", displayName: "Channel ID" })
  channelId: string;
  
  messagingWebClient: WebClient;

  constructor() {}

  async init(orgId: string, settingId: string): Promise<void> {
    console.log(`Initializing ${this.constructor.name} plugin`);
    await this.loadSettings(orgId, settingId);
    this.messagingWebClient = new WebClient(this.accessToken);
  }

  private async loadSettings(orgId: string, settingId: string): Promise<void> {
    const result: Setting = await SettingsManager.getPluginSettingsById('sample-org', 'sample-id');

    const _accessToken = result.configuration.find((d) => d.name === 'access_token');
    if (!_accessToken) {
      throw new MissingSettingError(`${this.constructor.name} accessToken missing from provider settings.`);
    }
    this.accessToken = _accessToken.value;

    const _channelId = result.configuration.find((d) => d.name === 'channel_id');
    if (!_channelId) {
      throw new MissingSettingError(`${this.constructor.name} channelId missing from provider settings.`);
    }
    this.channelId = _channelId.value;
  }

  public async routeRequest(request: IPluginRouteRequest): Promise<any> {
    try {
      return await this[request.pluginMethod](request.queryParams, request.body);
    } catch (error) {
      console.log(`The ${request.httpVerb} method ${request.pluginMethod} is not recognized by ${this.constructor.name} plugin.`);
      throw error;
    }
  }
  
  public async sendMessage(message: string): Promise<boolean> {
    try {
      const result = await this.messagingWebClient.postMessage({
        text: message,
        channel: this.channelId,
      });
  
      return result.ok; // true if successful, false if failed
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @PluginRestExtension({ name: 'sendChatMessage', httpVerb: HttpVerb.POST })
  public async sendChatMessage(queryParams: any, body: any): Promise<boolean> {
    if(!body.message) {
      throw new RestServerError(
        `${this.constructor.name} sendMessage call missing "message" parameter in body.`
      );
    }
     try {
      return await this.sendMessage(body.message);
     } catch (error) {
      throw new RestServerError(
        `${this.constructor.name} sendChatMessage error: `,
        `${error}`
      ); 
     }
  }
   
  public async resourceDiscovery(): Promise<any> {
    // IPlugin conformance. Empty function as this plugin does not support discovery engine integration.
  }

}
