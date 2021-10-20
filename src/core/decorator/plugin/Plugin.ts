import {PluginOptions} from "../options/PluginOptions";

/**
 * This decorator is used to mark classes that will be a provider plugin.
 */
export function Plugin(nameOrOptions?: string|PluginOptions, maybeOptions?: PluginOptions): ClassDecorator {
    const options = (typeof nameOrOptions === "object" ? nameOrOptions as PluginOptions : maybeOptions) || {};
    const name = typeof nameOrOptions === "string" ? nameOrOptions : (typeof nameOrOptions === "object" ? (nameOrOptions as PluginOptions).name : '');

    return function (target) {
        console.log(`Plugin: ${name}`);
    };
}