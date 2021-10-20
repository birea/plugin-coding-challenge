/*********************************************************************************************************************
 *  Copyright 2021 Configure8, Inc. or its affiliates. All Rights Reserved.                                           *
 *********************************************************************************************************************/

import { HttpVerb } from "./types/http.verbs.enum";

 /**
  * @author Configure8 Engineering
  */
 export interface IPluginRouteRequest { 
   /**
    * HTTP verb associated with request
    */
   httpVerb: HttpVerb;
 
   /**
    * Plugin method anme to trigger
    */
   pluginMethod: string;
 
   /**
    * Plugin method anme to trigger
    */
   queryParams: any;
 
   /**
    * Plugin method anme to trigger
    */
   body: any;
 }