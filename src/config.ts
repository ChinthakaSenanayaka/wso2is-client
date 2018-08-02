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

import {AuthorizationServiceConfiguration, FLOW_TYPE_IMPLICIT, FLOW_TYPE_PKCE, LocalStorageBackend, StorageBackend} from '@openid/appauth';

/**
 * WSO2 IS Oauth/OIDC configuration definition class.
 */
export class ISConfiguration {
  // AppAuth library config class
  private authorizationServiceConfiguration: AuthorizationServiceConfiguration;

  // oauth/OIDC clientId
  private clientId: string;

  // Where token should be saved in the browser - currently AppAuth supports only local storage
  private userStore: StorageBackend = new LocalStorageBackend();

  // client secret for PKCE flow
  private clientSecret: string|null = null;

  // redirect back to app URL
  private redirectUri: string;

  // scope of OIDC/Oauth
  private scope: string;

  // after logout where to redirect URL
  private postLogoutRedirectUri: string;

  /**
   * wso2is-client config class constructor.
   *
   * @param isBaseUrl wso2is server hosted base url - default: https://localhost:9443
   * @param flowType specify whether to go with IMPLICIT_FLOW or PKCE_FLOW - default: IMPLICIT_FLOW
   * @param userStore specify whether to go with USER_STORE_LOCAL or USER_STORE_SESSION (currently
   * not supported) - default: USER_STORE_LOCAL
   * @param clientId oauth/OIDC clientId - default: empty text
   * @param clientSecret client secret for PKCE flow - default: null
   * @param redirectUri redirect back to app URL - default: http://localhost:7777/
   * @param scope scope of OIDC/Oauth - default: openid
   * @param postLogoutRedirectUri after logout where to redirect URL - default:
   * http://localhost:7777/
   */
  constructor({
    isBaseUrl = 'https://localhost:9443',
    flowType = IMPLICIT_FLOW,
    userStore = USER_STORE_LOCAL,
    clientId = '',
    clientSecret = null,
    redirectUri = 'http://localhost:7777/',
    scope = 'openid',
    postLogoutRedirectUri = 'http://localhost:7777/'
  } = {}) {
    var flowTypeInternal;
    switch (flowType) {
      case PKCE_FLOW:
        flowTypeInternal = FLOW_TYPE_PKCE;
        break;
      case IMPLICIT_FLOW:
        flowTypeInternal = FLOW_TYPE_IMPLICIT;
        break;
      default:
        flowTypeInternal = FLOW_TYPE_IMPLICIT;
    }
    this.authorizationServiceConfiguration = new AuthorizationServiceConfiguration(
        flowTypeInternal,
        isBaseUrl + '/oauth2/authorize',
        isBaseUrl + '/oauth2/token',
        isBaseUrl + '/oauth2/revoke',
        isBaseUrl + '/oidc/logout',
        isBaseUrl + '/oauth2/userinfo');

    switch (userStore) {
      case USER_STORE_LOCAL:
        this.userStore = new LocalStorageBackend();
        break;

      case USER_STORE_SESSION:
        console.log('Session storage is not currently supported on underlying platform.');
        break;

      default:
        this.userStore = new LocalStorageBackend();
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.scope = scope;
    this.postLogoutRedirectUri = postLogoutRedirectUri;
  }

  /**
   * Getter for Auth config object
   */
  getAuthorizationServiceConfiguration(): AuthorizationServiceConfiguration {
    return this.authorizationServiceConfiguration;
  }

  /**
   * Getter for client ID
   */
  getClientId(): string {
    return this.clientId;
  }

  /**
   * Getter for user store
   */
  getUserStore(): StorageBackend {
    return this.userStore;
  }

  /**
   * Getter for client secret
   */
  getClientSecret(): string|null {
    return this.clientSecret;
  }

  /**
   * Getter for redirect URL
   */
  getRedirectUri(): string {
    return this.redirectUri;
  }

  /**
   * Getter for scope
   */
  getScope(): string {
    return this.scope;
  }

  /**
   * Getter for post lougout URL
   */
  getPostLogoutRedirectUri(): string {
    return this.postLogoutRedirectUri;
  }
}

/**
 * Constants for local storage and session storage
 */
export const USER_STORE_LOCAL = 'localStorage';
export const USER_STORE_SESSION = 'sessionStorage';

/**
 * Constants for OIDC flow type
 */
export const IMPLICIT_FLOW = 'IMPLICIT';
export const PKCE_FLOW = 'PKCE';