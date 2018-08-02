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

import {AUTHORIZATION_RESPONSE_HANDLE_KEY, AuthorizationNotifier, AuthorizationRequest, AuthorizationRequestHandler, AuthorizationServiceConfiguration, BasicQueryStringUtils, EndSessionNotifier, EndSessionRedirectRequestHandler, EndSessionRequest, EndSessionRequestHandler, GRANT_TYPE_AUTHORIZATION_CODE, PKCETokenRequestHandler, RedirectRequestHandler, StorageBackend, StringMap, TokenRequest} from '@openid/appauth';
import {FLOW_TYPE_IMPLICIT, FLOW_TYPE_PKCE} from '@openid/appauth';

import {ISConfiguration} from './config';
import {Util} from './util';

/**
 * WSO2 IS Oauth/OIDC integration wrapper class.
 */
export class ISIntegrator {
  private configuration: AuthorizationServiceConfiguration;
  private clientId: string;
  private clientSecret: string|null;
  private redirectUri: string;
  private scope: string;
  private postLogoutRedirectUri: string;

  private localStorageBackend: StorageBackend;

  private endSessionNotifier: EndSessionNotifier;
  private endSessionHandler: EndSessionRequestHandler;

  private authorizationNotifier: AuthorizationNotifier;
  private authorizationHandler: AuthorizationRequestHandler;

  private pkceTokenRequestHandler: PKCETokenRequestHandler;

  constructor(isConfig: ISConfiguration) {
    this.configuration = isConfig.getAuthorizationServiceConfiguration();

    this.clientId = isConfig.getClientId();
    this.clientSecret = isConfig.getClientSecret();
    this.redirectUri = isConfig.getRedirectUri();
    this.scope = isConfig.getScope();
    this.postLogoutRedirectUri = isConfig.getPostLogoutRedirectUri();

    this.localStorageBackend = isConfig.getUserStore();
    this.endSessionNotifier = new EndSessionNotifier();
    // uses a redirect flow
    this.endSessionHandler = new EndSessionRedirectRequestHandler();
    this.authorizationNotifier = new AuthorizationNotifier();
    // uses a redirect flow
    this.authorizationHandler = new RedirectRequestHandler();
    this.pkceTokenRequestHandler =
        new PKCETokenRequestHandler(this.authorizationHandler, this.configuration);
  }

  init(authorizationListenerCallback: Function, endSessionListenerCallback: Function): void {
    // set notifier to deliver responses
    this.endSessionHandler.setEndSessionNotifier(this.endSessionNotifier);
    // set a listener to listen for authorization responses
    this.endSessionNotifier.setEndSessionListener((request, response, error) => {
      console.log('Authorization request complete ', request, response, error);
      if (response) {
        endSessionListenerCallback(request, response, error);
      }
    });

    // set notifier to deliver responses
    this.authorizationHandler.setAuthorizationNotifier(this.authorizationNotifier);
    // set a listener to listen for authorization responses
    this.authorizationNotifier.setAuthorizationListener((request, response, error) => {
      console.log('Authorization request complete ', request, response, error);
      if (response) {
        console.log('Authorization Code ' + response.code + ' or id_token: ' + response.id_token);
        if (this.configuration.toJson().oauth_flow_type == FLOW_TYPE_PKCE && response.code) {
          let tokenRequestExtras = {
            client_secret: (this.clientSecret == null ? '' : this.clientSecret),
            state: response.state
          };
          let request = new TokenRequest(
              this.clientId,
              this.redirectUri,
              GRANT_TYPE_AUTHORIZATION_CODE,
              response.code,
              undefined,
              tokenRequestExtras);
          this.pkceTokenRequestHandler.performPKCEAuthorizationTokenRequest(
              this.configuration, request);
          authorizationListenerCallback(request, response, error);
        }
      }
    });
  }

  completeRedirect(location: Location, redirectCompleteCallback: Function): void {
    var isAuthRequestComplete = false;
    switch (this.configuration.toJson().oauth_flow_type) {
      case FLOW_TYPE_IMPLICIT:
        var params = this.parseQueryString(location, true);
        isAuthRequestComplete = params.hasOwnProperty('id_token');
        break;
      case FLOW_TYPE_PKCE:
        var params = this.parseQueryString(location, false);
        isAuthRequestComplete = params.hasOwnProperty('code');
        break;
      default:
        var params = this.parseQueryString(location, true);
        isAuthRequestComplete = params.hasOwnProperty('id_token');
    }

    if (isAuthRequestComplete) {
      this.authorizationHandler.completeAuthorizationRequestIfPossible();
    } else {
      this.endSessionHandler.completeEndSessionRequestIfPossible();
    }

    redirectCompleteCallback();
  }

  login(state: string, nonce?: string): void {
    // generater state
    if (!state) {
      state = Util.generateState();
    }

    // create a request
    var request;
    if (this.configuration.toJson().oauth_flow_type == FLOW_TYPE_IMPLICIT) {
      // generater nonce
      if (!nonce) {
        nonce = Util.generateNonce();
      }

      request = new AuthorizationRequest(
          this.clientId,
          this.redirectUri,
          this.scope,
          AuthorizationRequest.RESPONSE_TYPE_ID_TOKEN,
          state,
          {'prompt': 'consent', 'access_type': 'online', 'nonce': nonce});
      // make the authorization request
      this.authorizationHandler.performAuthorizationRequest(this.configuration, request);

    } else if (this.configuration.toJson().oauth_flow_type == FLOW_TYPE_PKCE) {
      let authRequestExtras = {prompt: 'consent', access_type: 'online'};
      request = new AuthorizationRequest(
          this.clientId,
          this.redirectUri,
          this.scope,
          AuthorizationRequest.RESPONSE_TYPE_CODE,
          state, /* state */
          authRequestExtras);
      this.pkceTokenRequestHandler.performPKCEAuthorizationCodeRequest(this.configuration, request);
    }
  }

  logout(state: string): void {
    // generater state
    if (!state) {
      state = Util.generateState();
    }

    this.localStorageBackend.getItem(AUTHORIZATION_RESPONSE_HANDLE_KEY).then(result => {
      if (result != null) {
        this.idTokenHandler(result, state);
      } else {
        console.log('Authorization response is not found in local or session storage');
      }
    });
  }

  idTokenHandler(result: string, state: string): void {
    var authResponse = JSON.parse(result);
    var idTokenHint = authResponse.id_token;

    let request = new EndSessionRequest(
        idTokenHint, this.postLogoutRedirectUri, state /* state */, {client_id: this.clientId});

    // make the authorization request
    this.endSessionHandler.performEndSessionRequest(this.configuration, request);
  }

  parseQueryString(location: Location, splitByHash: boolean): Object {
    var urlParams;
    if (splitByHash) {
      urlParams = location.hash;
    } else {
      urlParams = location.search;
    }

    let result: {[key: string]: string} = {};
    // if anything starts with ?, # or & remove it
    urlParams = urlParams.trim().replace(/^(\?|#|&)/, '');
    let params = urlParams.split('&');
    for (let i = 0; i < params.length; i += 1) {
      let param = params[i];  // looks something like a=b
      let parts = param.split('=');
      if (parts.length >= 2) {
        let key = decodeURIComponent(parts.shift()!);
        let value = parts.length > 0 ? parts.join('=') : null;
        if (value) {
          result[key] = decodeURIComponent(value);
        }
      }
    }
    return result;
  }
}
