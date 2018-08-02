"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var appauth_1 = require("@openid/appauth");
var appauth_2 = require("@openid/appauth");
var util_1 = require("./util");
/**
 * WSO2 IS Oauth/OIDC integration wrapper class.
 */
var ISIntegrator = /** @class */ (function () {
    function ISIntegrator(isConfig) {
        this.configuration = isConfig.getAuthorizationServiceConfiguration();
        this.clientId = isConfig.getClientId();
        this.clientSecret = isConfig.getClientSecret();
        this.redirectUri = isConfig.getRedirectUri();
        this.scope = isConfig.getScope();
        this.postLogoutRedirectUri = isConfig.getPostLogoutRedirectUri();
        this.localStorageBackend = isConfig.getUserStore();
        this.endSessionNotifier = new appauth_1.EndSessionNotifier();
        // uses a redirect flow
        this.endSessionHandler = new appauth_1.EndSessionRedirectRequestHandler();
        this.authorizationNotifier = new appauth_1.AuthorizationNotifier();
        // uses a redirect flow
        this.authorizationHandler = new appauth_1.RedirectRequestHandler();
        this.pkceTokenRequestHandler =
            new appauth_1.PKCETokenRequestHandler(this.authorizationHandler, this.configuration);
    }
    ISIntegrator.prototype.init = function (authorizationListenerCallback, endSessionListenerCallback) {
        var _this = this;
        // set notifier to deliver responses
        this.endSessionHandler.setEndSessionNotifier(this.endSessionNotifier);
        // set a listener to listen for authorization responses
        this.endSessionNotifier.setEndSessionListener(function (request, response, error) {
            console.log('Authorization request complete ', request, response, error);
            if (response) {
                endSessionListenerCallback(request, response, error);
            }
        });
        // set notifier to deliver responses
        this.authorizationHandler.setAuthorizationNotifier(this.authorizationNotifier);
        // set a listener to listen for authorization responses
        this.authorizationNotifier.setAuthorizationListener(function (request, response, error) {
            console.log('Authorization request complete ', request, response, error);
            if (response) {
                console.log('Authorization Code ' + response.code + ' or id_token: ' + response.id_token);
                if (_this.configuration.toJson().oauth_flow_type == appauth_2.FLOW_TYPE_PKCE && response.code) {
                    var tokenRequestExtras = {
                        client_secret: (_this.clientSecret == null ? '' : _this.clientSecret),
                        state: response.state
                    };
                    var request_1 = new appauth_1.TokenRequest(_this.clientId, _this.redirectUri, appauth_1.GRANT_TYPE_AUTHORIZATION_CODE, response.code, undefined, tokenRequestExtras);
                    _this.pkceTokenRequestHandler.performPKCEAuthorizationTokenRequest(_this.configuration, request_1);
                    authorizationListenerCallback(request_1, response, error);
                }
            }
        });
    };
    ISIntegrator.prototype.completeRedirect = function (location, redirectCompleteCallback) {
        var isAuthRequestComplete = false;
        switch (this.configuration.toJson().oauth_flow_type) {
            case appauth_2.FLOW_TYPE_IMPLICIT:
                var params = this.parseQueryString(location, true);
                isAuthRequestComplete = params.hasOwnProperty('id_token');
                break;
            case appauth_2.FLOW_TYPE_PKCE:
                var params = this.parseQueryString(location, false);
                isAuthRequestComplete = params.hasOwnProperty('code');
                break;
            default:
                var params = this.parseQueryString(location, true);
                isAuthRequestComplete = params.hasOwnProperty('id_token');
        }
        if (isAuthRequestComplete) {
            this.authorizationHandler.completeAuthorizationRequestIfPossible();
        }
        else {
            this.endSessionHandler.completeEndSessionRequestIfPossible();
        }
        redirectCompleteCallback();
    };
    ISIntegrator.prototype.login = function (state, nonce) {
        // generater state
        if (!state) {
            state = util_1.Util.generateState();
        }
        // create a request
        var request;
        if (this.configuration.toJson().oauth_flow_type == appauth_2.FLOW_TYPE_IMPLICIT) {
            // generater nonce
            if (!nonce) {
                nonce = util_1.Util.generateNonce();
            }
            request = new appauth_1.AuthorizationRequest(this.clientId, this.redirectUri, this.scope, appauth_1.AuthorizationRequest.RESPONSE_TYPE_ID_TOKEN, state, { 'prompt': 'consent', 'access_type': 'online', 'nonce': nonce });
            // make the authorization request
            this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
        }
        else if (this.configuration.toJson().oauth_flow_type == appauth_2.FLOW_TYPE_PKCE) {
            var authRequestExtras = { prompt: 'consent', access_type: 'online' };
            request = new appauth_1.AuthorizationRequest(this.clientId, this.redirectUri, this.scope, appauth_1.AuthorizationRequest.RESPONSE_TYPE_CODE, state, /* state */ authRequestExtras);
            this.pkceTokenRequestHandler.performPKCEAuthorizationCodeRequest(this.configuration, request);
        }
    };
    ISIntegrator.prototype.logout = function (state) {
        var _this = this;
        // generater state
        if (!state) {
            state = util_1.Util.generateState();
        }
        this.localStorageBackend.getItem(appauth_1.AUTHORIZATION_RESPONSE_HANDLE_KEY).then(function (result) {
            if (result != null) {
                _this.idTokenHandler(result, state);
            }
            else {
                console.log('Authorization response is not found in local or session storage');
            }
        });
    };
    ISIntegrator.prototype.idTokenHandler = function (result, state) {
        var authResponse = JSON.parse(result);
        var idTokenHint = authResponse.id_token;
        var request = new appauth_1.EndSessionRequest(idTokenHint, this.postLogoutRedirectUri, state /* state */, { client_id: this.clientId });
        // make the authorization request
        this.endSessionHandler.performEndSessionRequest(this.configuration, request);
    };
    ISIntegrator.prototype.parseQueryString = function (location, splitByHash) {
        var urlParams;
        if (splitByHash) {
            urlParams = location.hash;
        }
        else {
            urlParams = location.search;
        }
        var result = {};
        // if anything starts with ?, # or & remove it
        urlParams = urlParams.trim().replace(/^(\?|#|&)/, '');
        var params = urlParams.split('&');
        for (var i = 0; i < params.length; i += 1) {
            var param = params[i]; // looks something like a=b
            var parts = param.split('=');
            if (parts.length >= 2) {
                var key = decodeURIComponent(parts.shift());
                var value = parts.length > 0 ? parts.join('=') : null;
                if (value) {
                    result[key] = decodeURIComponent(value);
                }
            }
        }
        return result;
    };
    return ISIntegrator;
}());
exports.ISIntegrator = ISIntegrator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNfaW50ZWdyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pc19pbnRlZ3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCwyQ0FBa2E7QUFDbGEsMkNBQW1FO0FBR25FLCtCQUE0QjtBQUU1Qjs7R0FFRztBQUNIO0lBa0JFLHNCQUFZLFFBQXlCO1FBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLG9DQUFvQyxFQUFFLENBQUM7UUFFckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBRWpFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksNEJBQWtCLEVBQUUsQ0FBQztRQUNuRCx1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksMENBQWdDLEVBQUUsQ0FBQztRQUNoRSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSwrQkFBcUIsRUFBRSxDQUFDO1FBQ3pELHVCQUF1QjtRQUN2QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxnQ0FBc0IsRUFBRSxDQUFDO1FBQ3pELElBQUksQ0FBQyx1QkFBdUI7WUFDeEIsSUFBSSxpQ0FBdUIsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lB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LElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN0RCxJQUFJLEtBQUssRUFBRTtvQkFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3pDO2FBQ0Y7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUE3TEQsSUE2TEM7QUE3TFksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LCBXU08yIEluYy4gKGh0dHA6Ly93d3cud3NvMi5vcmcpIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtBVVRIT1JJWkFUSU9OX1JFU1BPTlNFX0hBTkRMRV9LRVksIEF1dGhvcml6YXRpb25Ob3RpZmllciwgQXV0aG9yaXphdGlvblJlcXVlc3QsIEF1dGhvcml6YXRpb25SZXF1ZXN0SGFuZGxlciwgQXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9uLCBCYXNpY1F1ZXJ5U3RyaW5nVXRpbHMsIEVuZFNlc3Npb25Ob3RpZmllciwgRW5kU2Vzc2lvblJlZGlyZWN0UmVxdWVzdEhhbmRsZXIsIEVuZFNlc3Npb25SZXF1ZXN0LCBFbmRTZXNzaW9uUmVxdWVzdEhhbmRsZXIsIEdSQU5UX1RZUEVfQVVUSE9SSVpBVElPTl9DT0RFLCBQS0NFVG9rZW5SZXF1ZXN0SGFuZGxlciwgUmVkaXJlY3RSZXF1ZXN0SGFuZGxlciwgU3RvcmFnZUJhY2tlbmQsIFN0cmluZ01hcCwgVG9rZW5SZXF1ZXN0fSBmcm9tICdAb3BlbmlkL2FwcGF1dGgnO1xuaW1wb3J0IHtGTE9XX1RZUEVfSU1QTElDSVQsIEZMT1dfVFlQRV9QS0NFfSBmcm9tICdAb3BlbmlkL2FwcGF1dGgnO1xuXG5pbXBvcnQge0lTQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtVdGlsfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIFdTTzIgSVMgT2F1dGgvT0lEQyBpbnRlZ3JhdGlvbiB3cmFwcGVyIGNsYXNzLlxuICovXG5leHBvcnQgY2xhc3MgSVNJbnRlZ3JhdG9yIHtcbiAgcHJpdmF0ZSBjb25maWd1cmF0aW9uOiBBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb247XG4gIHByaXZhdGUgY2xpZW50SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBjbGllbnRTZWNyZXQ6IHN0cmluZ3xudWxsO1xuICBwcml2YXRlIHJlZGlyZWN0VXJpOiBzdHJpbmc7XG4gIHByaXZhdGUgc2NvcGU6IHN0cmluZztcbiAgcHJpdmF0ZSBwb3N0TG9nb3V0UmVkaXJlY3RVcmk6IHN0cmluZztcblxuICBwcml2YXRlIGxvY2FsU3RvcmFnZUJhY2tlbmQ6IFN0b3JhZ2VCYWNrZW5kO1xuXG4gIHByaXZhdGUgZW5kU2Vzc2lvbk5vdGlmaWVyOiBFbmRTZXNzaW9uTm90aWZpZXI7XG4gIHByaXZhdGUgZW5kU2Vzc2lvbkhhbmRsZXI6IEVuZFNlc3Npb25SZXF1ZXN0SGFuZGxlcjtcblxuICBwcml2YXRlIGF1dGhvcml6YXRpb25Ob3RpZmllcjogQXV0aG9yaXphdGlvbk5vdGlmaWVyO1xuICBwcml2YXRlIGF1dGhvcml6YXRpb25IYW5kbGVyOiBBdXRob3JpemF0aW9uUmVxdWVzdEhhbmRsZXI7XG5cbiAgcHJpdmF0ZSBwa2NlVG9rZW5SZXF1ZXN0SGFuZGxlcjogUEtDRVRva2VuUmVxdWVzdEhhbmRsZXI7XG5cbiAgY29uc3RydWN0b3IoaXNDb25maWc6IElTQ29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IGlzQ29uZmlnLmdldEF1dGhvcml6YXRpb25TZXJ2aWNlQ29uZmlndXJhdGlvbigpO1xuXG4gICAgdGhpcy5jbGllbnRJZCA9IGlzQ29uZmlnLmdldENsaWVudElkKCk7XG4gICAgdGhpcy5jbGllbnRTZWNyZXQgPSBpc0NvbmZpZy5nZXRDbGllbnRTZWNyZXQoKTtcbiAgICB0aGlzLnJlZGlyZWN0VXJpID0gaXNDb25maWcuZ2V0UmVkaXJlY3RVcmkoKTtcbiAgICB0aGlzLnNjb3BlID0gaXNDb25maWcuZ2V0U2NvcGUoKTtcbiAgICB0aGlzLnBvc3RMb2dvdXRSZWRpcmVjdFVyaSA9IGlzQ29uZmlnLmdldFBvc3RMb2dvdXRSZWRpcmVjdFVyaSgpO1xuXG4gICAgdGhpcy5sb2NhbFN0b3JhZ2VCYWNrZW5kID0gaXNDb25maWcuZ2V0VXNlclN0b3JlKCk7XG4gICAgdGhpcy5lbmRTZXNzaW9uTm90aWZpZXIgPSBuZXcgRW5kU2Vzc2lvbk5vdGlmaWVyKCk7XG4gICAgLy8gdXNlcyBhIHJlZGlyZWN0IGZsb3dcbiAgICB0aGlzLmVuZFNlc3Npb25IYW5kbGVyID0gbmV3IEVuZFNlc3Npb25SZWRpcmVjdFJlcXVlc3RIYW5kbGVyKCk7XG4gICAgdGhpcy5hdXRob3JpemF0aW9uTm90aWZpZXIgPSBuZXcgQXV0aG9yaXphdGlvbk5vdGlmaWVyKCk7XG4gICAgLy8gdXNlcyBhIHJlZGlyZWN0IGZsb3dcbiAgICB0aGlzLmF1dGhvcml6YXRpb25IYW5kbGVyID0gbmV3IFJlZGlyZWN0UmVxdWVzdEhhbmRsZXIoKTtcbiAgICB0aGlzLnBrY2VUb2tlblJlcXVlc3RIYW5kbGVyID1cbiAgICAgICAgbmV3IFBLQ0VUb2tlblJlcXVlc3RIYW5kbGVyKHRoaXMuYXV0aG9yaXphdGlvbkhhbmRsZXIsIHRoaXMuY29uZmlndXJhdGlvbik7XG4gIH1cblxuICBpbml0KGF1dGhvcml6YXRpb25MaXN0ZW5lckNhbGxiYWNrOiBGdW5jdGlvbiwgZW5kU2Vzc2lvbkxpc3RlbmVyQ2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgLy8gc2V0IG5vdGlmaWVyIHRvIGRlbGl2ZXIgcmVzcG9uc2VzXG4gICAgdGhpcy5lbmRTZXNzaW9uSGFuZGxlci5zZXRFbmRTZXNzaW9uTm90aWZpZXIodGhpcy5lbmRTZXNzaW9uTm90aWZpZXIpO1xuICAgIC8vIHNldCBhIGxpc3RlbmVyIHRvIGxpc3RlbiBmb3IgYXV0aG9yaXphdGlvbiByZXNwb25zZXNcbiAgICB0aGlzLmVuZFNlc3Npb25Ob3RpZmllci5zZXRFbmRTZXNzaW9uTGlzdGVuZXIoKHJlcXVlc3QsIHJlc3BvbnNlLCBlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0F1dGhvcml6YXRpb24gcmVxdWVzdCBjb21wbGV0ZSAnLCByZXF1ZXN0LCByZXNwb25zZSwgZXJyb3IpO1xuICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgIGVuZFNlc3Npb25MaXN0ZW5lckNhbGxiYWNrKHJlcXVlc3QsIHJlc3BvbnNlLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBzZXQgbm90aWZpZXIgdG8gZGVsaXZlciByZXNwb25zZXNcbiAgICB0aGlzLmF1dGhvcml6YXRpb25IYW5kbGVyLnNldEF1dGhvcml6YXRpb25Ob3RpZmllcih0aGlzLmF1dGhvcml6YXRpb25Ob3RpZmllcik7XG4gICAgLy8gc2V0IGEgbGlzdGVuZXIgdG8gbGlzdGVuIGZvciBhdXRob3JpemF0aW9uIHJlc3BvbnNlc1xuICAgIHRoaXMuYXV0aG9yaXphdGlvbk5vdGlmaWVyLnNldEF1dGhvcml6YXRpb25MaXN0ZW5lcigocmVxdWVzdCwgcmVzcG9uc2UsIGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnQXV0aG9yaXphdGlvbiByZXF1ZXN0IGNvbXBsZXRlICcsIHJlcXVlc3QsIHJlc3BvbnNlLCBlcnJvcik7XG4gICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0F1dGhvcml6YXRpb24gQ29kZSAnICsgcmVzcG9uc2UuY29kZSArICcgb3IgaWRfdG9rZW46ICcgKyByZXNwb25zZS5pZF90b2tlbik7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb24udG9Kc29uKCkub2F1dGhfZmxvd190eXBlID09IEZMT1dfVFlQRV9QS0NFICYmIHJlc3BvbnNlLmNvZGUpIHtcbiAgICAgICAgICBsZXQgdG9rZW5SZXF1ZXN0RXh0cmFzID0ge1xuICAgICAgICAgICAgY2xpZW50X3NlY3JldDogKHRoaXMuY2xpZW50U2VjcmV0ID09IG51bGwgPyAnJyA6IHRoaXMuY2xpZW50U2VjcmV0KSxcbiAgICAgICAgICAgIHN0YXRlOiByZXNwb25zZS5zdGF0ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgVG9rZW5SZXF1ZXN0KFxuICAgICAgICAgICAgICB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgICB0aGlzLnJlZGlyZWN0VXJpLFxuICAgICAgICAgICAgICBHUkFOVF9UWVBFX0FVVEhPUklaQVRJT05fQ09ERSxcbiAgICAgICAgICAgICAgcmVzcG9uc2UuY29kZSxcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB0b2tlblJlcXVlc3RFeHRyYXMpO1xuICAgICAgICAgIHRoaXMucGtjZVRva2VuUmVxdWVzdEhhbmRsZXIucGVyZm9ybVBLQ0VBdXRob3JpemF0aW9uVG9rZW5SZXF1ZXN0KFxuICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24sIHJlcXVlc3QpO1xuICAgICAgICAgIGF1dGhvcml6YXRpb25MaXN0ZW5lckNhbGxiYWNrKHJlcXVlc3QsIHJlc3BvbnNlLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBsZXRlUmVkaXJlY3QobG9jYXRpb246IExvY2F0aW9uLCByZWRpcmVjdENvbXBsZXRlQ2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdmFyIGlzQXV0aFJlcXVlc3RDb21wbGV0ZSA9IGZhbHNlO1xuICAgIHN3aXRjaCAodGhpcy5jb25maWd1cmF0aW9uLnRvSnNvbigpLm9hdXRoX2Zsb3dfdHlwZSkge1xuICAgICAgY2FzZSBGTE9XX1RZUEVfSU1QTElDSVQ6XG4gICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcnNlUXVlcnlTdHJpbmcobG9jYXRpb24sIHRydWUpO1xuICAgICAgICBpc0F1dGhSZXF1ZXN0Q29tcGxldGUgPSBwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2lkX3Rva2VuJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBGTE9XX1RZUEVfUEtDRTpcbiAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMucGFyc2VRdWVyeVN0cmluZyhsb2NhdGlvbiwgZmFsc2UpO1xuICAgICAgICBpc0F1dGhSZXF1ZXN0Q29tcGxldGUgPSBwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2NvZGUnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgcGFyYW1zID0gdGhpcy5wYXJzZVF1ZXJ5U3RyaW5nKGxvY2F0aW9uLCB0cnVlKTtcbiAgICAgICAgaXNBdXRoUmVxdWVzdENvbXBsZXRlID0gcGFyYW1zLmhhc093blByb3BlcnR5KCdpZF90b2tlbicpO1xuICAgIH1cblxuICAgIGlmIChpc0F1dGhSZXF1ZXN0Q29tcGxldGUpIHtcbiAgICAgIHRoaXMuYXV0aG9yaXphdGlvbkhhbmRsZXIuY29tcGxldGVBdXRob3JpemF0aW9uUmVxdWVzdElmUG9zc2libGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmRTZXNzaW9uSGFuZGxlci5jb21wbGV0ZUVuZFNlc3Npb25SZXF1ZXN0SWZQb3NzaWJsZSgpO1xuICAgIH1cblxuICAgIHJlZGlyZWN0Q29tcGxldGVDYWxsYmFjaygpO1xuICB9XG5cbiAgbG9naW4oc3RhdGU6IHN0cmluZywgbm9uY2U/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBnZW5lcmF0ZXIgc3RhdGVcbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICBzdGF0ZSA9IFV0aWwuZ2VuZXJhdGVTdGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhIHJlcXVlc3RcbiAgICB2YXIgcmVxdWVzdDtcbiAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uLnRvSnNvbigpLm9hdXRoX2Zsb3dfdHlwZSA9PSBGTE9XX1RZUEVfSU1QTElDSVQpIHtcbiAgICAgIC8vIGdlbmVyYXRlciBub25jZVxuICAgICAgaWYgKCFub25jZSkge1xuICAgICAgICBub25jZSA9IFV0aWwuZ2VuZXJhdGVOb25jZSgpO1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0ID0gbmV3IEF1dGhvcml6YXRpb25SZXF1ZXN0KFxuICAgICAgICAgIHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgdGhpcy5yZWRpcmVjdFVyaSxcbiAgICAgICAgICB0aGlzLnNjb3BlLFxuICAgICAgICAgIEF1dGhvcml6YXRpb25SZXF1ZXN0LlJFU1BPTlNFX1RZUEVfSURfVE9LRU4sXG4gICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgeydwcm9tcHQnOiAnY29uc2VudCcsICdhY2Nlc3NfdHlwZSc6ICdvbmxpbmUnLCAnbm9uY2UnOiBub25jZX0pO1xuICAgICAgLy8gbWFrZSB0aGUgYXV0aG9yaXphdGlvbiByZXF1ZXN0XG4gICAgICB0aGlzLmF1dGhvcml6YXRpb25IYW5kbGVyLnBlcmZvcm1BdXRob3JpemF0aW9uUmVxdWVzdCh0aGlzLmNvbmZpZ3VyYXRpb24sIHJlcXVlc3QpO1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbmZpZ3VyYXRpb24udG9Kc29uKCkub2F1dGhfZmxvd190eXBlID09IEZMT1dfVFlQRV9QS0NFKSB7XG4gICAgICBsZXQgYXV0aFJlcXVlc3RFeHRyYXMgPSB7cHJvbXB0OiAnY29uc2VudCcsIGFjY2Vzc190eXBlOiAnb25saW5lJ307XG4gICAgICByZXF1ZXN0ID0gbmV3IEF1dGhvcml6YXRpb25SZXF1ZXN0KFxuICAgICAgICAgIHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgdGhpcy5yZWRpcmVjdFVyaSxcbiAgICAgICAgICB0aGlzLnNjb3BlLFxuICAgICAgICAgIEF1dGhvcml6YXRpb25SZXF1ZXN0LlJFU1BPTlNFX1RZUEVfQ09ERSxcbiAgICAgICAgICBzdGF0ZSwgLyogc3RhdGUgKi9cbiAgICAgICAgICBhdXRoUmVxdWVzdEV4dHJhcyk7XG4gICAgICB0aGlzLnBrY2VUb2tlblJlcXVlc3RIYW5kbGVyLnBlcmZvcm1QS0NFQXV0aG9yaXphdGlvbkNvZGVSZXF1ZXN0KHRoaXMuY29uZmlndXJhdGlvbiwgcmVxdWVzdCk7XG4gICAgfVxuICB9XG5cbiAgbG9nb3V0KHN0YXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBnZW5lcmF0ZXIgc3RhdGVcbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICBzdGF0ZSA9IFV0aWwuZ2VuZXJhdGVTdGF0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMubG9jYWxTdG9yYWdlQmFja2VuZC5nZXRJdGVtKEFVVEhPUklaQVRJT05fUkVTUE9OU0VfSEFORExFX0tFWSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuaWRUb2tlbkhhbmRsZXIocmVzdWx0LCBzdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnQXV0aG9yaXphdGlvbiByZXNwb25zZSBpcyBub3QgZm91bmQgaW4gbG9jYWwgb3Igc2Vzc2lvbiBzdG9yYWdlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpZFRva2VuSGFuZGxlcihyZXN1bHQ6IHN0cmluZywgc3RhdGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHZhciBhdXRoUmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgdmFyIGlkVG9rZW5IaW50ID0gYXV0aFJlc3BvbnNlLmlkX3Rva2VuO1xuXG4gICAgbGV0IHJlcXVlc3QgPSBuZXcgRW5kU2Vzc2lvblJlcXVlc3QoXG4gICAgICAgIGlkVG9rZW5IaW50LCB0aGlzLnBvc3RMb2dvdXRSZWRpcmVjdFVyaSwgc3RhdGUgLyogc3RhdGUgKi8sIHtjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWR9KTtcblxuICAgIC8vIG1ha2UgdGhlIGF1dGhvcml6YXRpb24gcmVxdWVzdFxuICAgIHRoaXMuZW5kU2Vzc2lvbkhhbmRsZXIucGVyZm9ybUVuZFNlc3Npb25SZXF1ZXN0KHRoaXMuY29uZmlndXJhdGlvbiwgcmVxdWVzdCk7XG4gIH1cblxuICBwYXJzZVF1ZXJ5U3RyaW5nKGxvY2F0aW9uOiBMb2NhdGlvbiwgc3BsaXRCeUhhc2g6IGJvb2xlYW4pOiBPYmplY3Qge1xuICAgIHZhciB1cmxQYXJhbXM7XG4gICAgaWYgKHNwbGl0QnlIYXNoKSB7XG4gICAgICB1cmxQYXJhbXMgPSBsb2NhdGlvbi5oYXNoO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmxQYXJhbXMgPSBsb2NhdGlvbi5zZWFyY2g7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICAvLyBpZiBhbnl0aGluZyBzdGFydHMgd2l0aCA/LCAjIG9yICYgcmVtb3ZlIGl0XG4gICAgdXJsUGFyYW1zID0gdXJsUGFyYW1zLnRyaW0oKS5yZXBsYWNlKC9eKFxcP3wjfCYpLywgJycpO1xuICAgIGxldCBwYXJhbXMgPSB1cmxQYXJhbXMuc3BsaXQoJyYnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgbGV0IHBhcmFtID0gcGFyYW1zW2ldOyAgLy8gbG9va3Mgc29tZXRoaW5nIGxpa2UgYT1iXG4gICAgICBsZXQgcGFydHMgPSBwYXJhbS5zcGxpdCgnPScpO1xuICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIGxldCBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHMuc2hpZnQoKSEpO1xuICAgICAgICBsZXQgdmFsdWUgPSBwYXJ0cy5sZW5ndGggPiAwID8gcGFydHMuam9pbignPScpIDogbnVsbDtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==