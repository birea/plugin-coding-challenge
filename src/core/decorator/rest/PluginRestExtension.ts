import { RestExtensionOptions } from "../options/RestExtensionOptions";
 
 /**
  * This decorator will store meta data for plugin rest extensions.
  */
 export function PluginRestExtension(options: RestExtensionOptions): MethodDecorator { 
     return function (object: Object, methodName: string | symbol, descriptor: PropertyDescriptor) {
        console.log(`Plugin REST Extention: ${String(methodName)}`);
     };
 }