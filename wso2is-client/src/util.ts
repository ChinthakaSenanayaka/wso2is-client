/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as crypto from 'crypto';

export class Util {
  static generateNonce() {
    var nonceLen = 16;
    return crypto.randomBytes(Math.ceil(nonceLen * 3 / 4))
        .toString('base64')    // convert to base64 format
        .slice(0, nonceLen)    // return required number of characters
        .replace(/\+/g, '0')   // replace '+' with '0'
        .replace(/\//g, '0');  // replace '/' with '0'
  }

  static generateState() {
    var stateLen = 8;
    return crypto.randomBytes(Math.ceil(stateLen * 3 / 4))
        .toString('base64')    // convert to base64 format
        .slice(0, stateLen)    // return required number of characters
        .replace(/\+/g, '0')   // replace '+' with '0'
        .replace(/\//g, '0');  // replace '/' with '0'
  }
}