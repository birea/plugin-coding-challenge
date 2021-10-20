import { HttpVerb } from "../types/http.verbs.enum";

/**
 * Describes all plugin's options.
 */
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
