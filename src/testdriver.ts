import { HttpVerb } from "./core";
import SampleMessenger from "./plugins/sample/sample.plugin";


async function load(): Promise<void> {
  const samplePlugin: SampleMessenger = new SampleMessenger();
  await samplePlugin.init('sample-org', 'sample-setting-id');
  const result = await samplePlugin.sendMessage('test message');

  await samplePlugin.routeRequest({
    httpVerb: HttpVerb.POST,
    pluginMethod: 'sendChatMessage',
    queryParams: {},
    body: {
      message: 'REST API test message',
    }
  });

  return;
}

load().then();


