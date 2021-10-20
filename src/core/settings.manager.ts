// mockout of settings manager
import { Setting } from './setting.interface';
export class SettingsManager {

  public static async getPluginSettingsById(orgId: string, settingId: string): Promise<Setting> {


    return <Setting>{
      id: 'sample-setting',
      name: 'plugin-test',
      orgId: 'sample-org',
      providerName: 'sample-provider',
      providerType: 'MESSAGE',
      configuration: [{
        name: 'access_token',
        value: 'sample-token-123'
      }, {
        name: 'channel_id',
        value: 'sample-channel'
      }]
    };

  }
}