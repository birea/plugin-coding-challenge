import { SettingOptions } from "../options/SettingOptions";

/**
 * This decorator will store meta data for s plugin setting.
 */
export function PluginSetting(maybeOptions?: SettingOptions): PropertyDecorator {
    const options = typeof maybeOptions === "object" ? maybeOptions as SettingOptions : {};

    return function (object: Object, propertyName: string) {
        // if type is not given explicitly then try to guess it
        const reflectMetadataType = Reflect && (Reflect as any).getMetadata ? (Reflect as any).getMetadata("design:type", object, propertyName) : undefined;
        console.log(`Plugin Settings: ${propertyName}`);
    };
}
