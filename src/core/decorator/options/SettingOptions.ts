/**
 * Describes all plugin's options.
 */
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