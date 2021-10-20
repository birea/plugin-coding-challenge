import { ISettingAspect } from './setting.aspect.interface';

export type Setting = {
  id: string;
  name: string;
  providerName: string;
  providerType: string;
  orgId?: string;
  configuration: ISettingAspect[];
}