
import { PluginScope } from "../types/PluginScope";
import { PluginType } from "../types/PluginType";

/**
 * Describes all plugin's options.
 */
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
