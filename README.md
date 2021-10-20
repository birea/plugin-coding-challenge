# Plugin Coding Challenge
Configure8 is a platform geared towards enabling engineering teams to manage all lifecycle facets of applications and services from a centralized portal. Configure8 offers many integration points with third party service providers to facilitate the “one-stop shop” catalog view of an organization's IT service matrix. These integration points are driven by Configure8 plugin architecture to provide the flexibility for customers to extend integration points to supplement functionality for their business needs. This approach helps unchain potential limitations in the product roadmap to enable customers to customize their experience, as well as, promote and foster a community around the product.

As a Configure8 engineer, we need you to create a new plugin to support a new third party integration. Recently, there has been high demand from customers to discover and list their organizations repositories in Bitbucket. Configure8 needs you to build a connector for Bitbucket using our plugin architecture below to pull the list of repositories with the associated metadata for a team. This plugin should provide the hooks for a REST API on-demand call as well as a hook for consumption as a class library by other services.

## Plugin Model
The Configure8 platform is built to load plugins dynamically based on their core definitions. In order for the Configure8 plugin system to dynamically load plugins, there must be a way for the platform to identify assets that are indeed plugins. This is implemented by the following:

Plugin metadata annotation via Typescript Decorators. Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members. This approach allows plugins to be easily annotated for consumption within the Configure8 platform.

Implementation of the IPlugin interface for each plugin.

### Plugin Decorators
The Configure8 plugin system supports three (3) types of decorators:

- Plugin Class Decorator. This decorator identifies the class as a plugin to be dynamically loaded into the Configure8 plugin system.
The Plugin Class Decorator is declared just before a plugin class declaration. The Plugin Class Decorator is applied to the constructor of the class and is used to observe the class definition. The Plugin Class Decorator has the following properties:

```
 export enum PluginScope {
  PROVIDER = 'PROVIDER',
  SERVICE = 'SERVICE'
}

export enum PluginType {
  REPOSITORIES = 'REPOS',
  CLOUD = 'CLOUD',
  SSO = 'SSO',
  EMAIL = 'EMAIL',
  MSG = 'MESSAGE',
  OHTER = 'OTHER'
}

export interface PluginOptions {

  /**
   * Plugin name.
   * If not specified then naming strategy will generate plugin name from entity name.
   */
  name?: string;

  /**
   * Plugin type.
   */
  scope?: PluginScope;  

  /**
   * Plugin type.
   */
  type?: PluginType;
}
``` 

- PluginSetting Property Decorator. Many third party providers have settings required to enable connectivity to their platform (API keys, access keys, oath creds, etc…) or as parameters to their APIs (such as a team id, region, etc…).  This decorator identifies properties of the plugin that should be available to users through the UI for configuration to support its intended functionality. 
The PluginSetting Property Decorator is declared just before a property declaration. The PluginSetting Property Decorator has the following properties:

```
export interface SettingOptions {

  /**
   * Setting name.
   * If not specified then naming strategy will generate setting name from property name.
   */
  name?: string;

  /**
   * Setting display name for UI.
   * If not specified then naming strategy will generate setting name from property name.
   */
  displayName?: string;

  /**
   * Whether the setting is required or not.
   * If not specified then set to true.
   */
  isRequired?: boolean;
}
```

- RestExtensionOptions Method Decorator. This decorator identifies methods of the plugin that should be available through a REST API proxy for on-demand calls via the Configure8 platform. 
The RestExtensionOptions Property Decorator is declared just before a method declaration. The RestExtensionOptions Property Decorator has the following properties:

```
export enum HttpVerb {
  /**
   * The `CONNECT` method establishes a tunnel to the server identified by the
   * target resource.
   */
  CONNECT = 'CONNECT',

  /**
   * The `DELETE` method deletes the specified resource.
   */
  DELETE = 'DELETE',

  /**
   * The `GET` method requests a representation of the specified resource.
   * Requests using GET should only retrieve data.
   */
  GET = 'GET',

  /**
   * The `HEAD` method asks for a response identical to that of a GET request,
   * but without the response body.
   */
  HEAD = 'HEAD',

  /**
   * The `OPTIONS` method is used to describe the communication options for the
   * target resource.
   */
  OPTIONS = 'OPTIONS',

  /**
   * The PATCH method is used to apply partial modifications to a resource.
   */
  PATCH = 'PATCH',

  /**
   * The `POST` method is used to submit an entity to the specified resource,
   * often causing a change in state or side effects on the server.
   */
  POST = 'POST',

  /**
   * The `PUT` method replaces all current representations of the target
   * resource with the request payload.
   */
  PUT = 'PUT',

  /**
   * The `TRACE` method performs a message loop-back test along the path to the
   * target resource.
   */
  TRACE = 'TRACE'
}

export interface RestExtensionOptions {
  /**
   * Rest extension name.
   * If not specified then naming strategy will generate setting name from method name.
   */
  name: string;

  /**
   * Rest extension verb.
   */
  httpVerb: HttpVerb;
}
```

### Plugin Interface
All Configure8 plugins must implement the IPlugin interface. This ensures required methods and properties of the base plugin definition is defined for proper compilation. The following is the IPlugin interface:

```
export interface IPlugin {
  init(): Promise<void>;
  routeRequest(request: IPluginRouteRequest): Promise<any>;
  resourceDiscovery(): Promise<any>;
}
```

## How to use a plugin
### As a direct class
At the core, plugins are simply Typescript classes contained within the @c8/plugins library that can be instantiated and initialized just like any other class. For example, let’s say we had a message API in the backend that the Configure8 management console UI called to send an instance message to our core-engineering channel.

All we need to do is instantiate our SampleMessenger plugin within the backend message service. Initialize our plugin, so the settings load. Then simply call the sendMessage on our instantiated SampleMessage object. The following is an example of a potential message service API:

```
import { SampleMessenger } from '@c8/plugins';

@Injectable()
export class MessageService {
  private sampleMessenger: SampleMessenger;

  constructor() {
    this.sampleMessenger = new SampleMessenger();
  }

  public async sendInstantMessage(): Promise<void> {
    const result: boolean = this.sampleMessenger.sendMessage('Hello World!');
    if (!result) {
      throw new BadGatewayException('Message delivery to SampleMessenger failed.');
    }
  }
}
```

### As a REST Extension
For those plugins that expose REST extension methods, those exposed methods can be directly called from the Configure8 REST API via a built in proxy layer. To invoke a plugin REST extension method, the following signature is required:

`/api/v1/_plugin/{providerType}/{pluginName}/{pluginMethod}/{settingId}?queryParams&body`

Using this signature the following API call to the backend would invoke the sendMessage REST extension method of our SampleMessenger plugin in. (Assumes our persisted SampleMessenger settings are under settingId dbaca097-6225-4d24-b354-5c45653ecb96)

```
POST /api/v1/_plugin/MESSAGE/SampleMessenger/sendMessage/dbaca097-6225-4d24-b354-5c45653ecb96 HTTP/1.1
Host: app.configure8.io
message=this is my test
```

## Plugin Class Example
The following shows an example of a SampleMessenger decorated plugin class that is able to be automatically recognized by the Configure8 plugin system:

```
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
```
