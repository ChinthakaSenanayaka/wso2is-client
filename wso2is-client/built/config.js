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
/**
 * WSO2 IS Oauth/OIDC configuration definition class.
 */
var ISConfiguration = /** @class */ (function () {
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
    function ISConfiguration(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.isBaseUrl, isBaseUrl = _c === void 0 ? 'https://localhost:9443' : _c, _d = _b.flowType, flowType = _d === void 0 ? exports.IMPLICIT_FLOW : _d, _e = _b.userStore, userStore = _e === void 0 ? exports.USER_STORE_LOCAL : _e, _f = _b.clientId, clientId = _f === void 0 ? '' : _f, _g = _b.clientSecret, clientSecret = _g === void 0 ? null : _g, _h = _b.redirectUri, redirectUri = _h === void 0 ? 'http://localhost:7777/' : _h, _j = _b.scope, scope = _j === void 0 ? 'openid' : _j, _k = _b.postLogoutRedirectUri, postLogoutRedirectUri = _k === void 0 ? 'http://localhost:7777/' : _k;
        // Where token should be saved in the browser - currently AppAuth supports only local storage
        this.userStore = new appauth_1.LocalStorageBackend();
        // client secret for PKCE flow
        this.clientSecret = null;
        var flowTypeInternal;
        switch (flowType) {
            case exports.PKCE_FLOW:
                flowTypeInternal = appauth_1.FLOW_TYPE_PKCE;
                break;
            case exports.IMPLICIT_FLOW:
                flowTypeInternal = appauth_1.FLOW_TYPE_IMPLICIT;
                break;
            default:
                flowTypeInternal = appauth_1.FLOW_TYPE_IMPLICIT;
        }
        this.authorizationServiceConfiguration = new appauth_1.AuthorizationServiceConfiguration(flowTypeInternal, isBaseUrl + '/oauth2/authorize', isBaseUrl + '/oauth2/token', isBaseUrl + '/oauth2/revoke', isBaseUrl + '/oidc/logout', isBaseUrl + '/oauth2/userinfo');
        switch (userStore) {
            case exports.USER_STORE_LOCAL:
                this.userStore = new appauth_1.LocalStorageBackend();
                break;
            case exports.USER_STORE_SESSION:
                console.log('Session storage is not currently supported on underlying platform.');
                break;
            default:
                this.userStore = new appauth_1.LocalStorageBackend();
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
    ISConfiguration.prototype.getAuthorizationServiceConfiguration = function () {
        return this.authorizationServiceConfiguration;
    };
    /**
     * Getter for client ID
     */
    ISConfiguration.prototype.getClientId = function () {
        return this.clientId;
    };
    /**
     * Getter for user store
     */
    ISConfiguration.prototype.getUserStore = function () {
        return this.userStore;
    };
    /**
     * Getter for client secret
     */
    ISConfiguration.prototype.getClientSecret = function () {
        return this.clientSecret;
    };
    /**
     * Getter for redirect URL
     */
    ISConfiguration.prototype.getRedirectUri = function () {
        return this.redirectUri;
    };
    /**
     * Getter for scope
     */
    ISConfiguration.prototype.getScope = function () {
        return this.scope;
    };
    /**
     * Getter for post lougout URL
     */
    ISConfiguration.prototype.getPostLogoutRedirectUri = function () {
        return this.postLogoutRedirectUri;
    };
    return ISConfiguration;
}());
exports.ISConfiguration = ISConfiguration;
/**
 * Constants for local storage and session storage
 */
exports.USER_STORE_LOCAL = 'localStorage';
exports.USER_STORE_SESSION = 'sessionStorage';
/**
 * Constants for OIDC flow type
 */
exports.IMPLICIT_FLOW = 'IMPLICIT';
exports.PKCE_FLOW = 'PKCE';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUgsMkNBQTJJO0FBRTNJOztHQUVHO0FBQ0g7SUFzQkU7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILHlCQUFZLEVBU047WUFUTSw0QkFTTixFQVJKLGlCQUFvQyxFQUFwQyx5REFBb0MsRUFDcEMsZ0JBQXdCLEVBQXhCLHFEQUF3QixFQUN4QixpQkFBNEIsRUFBNUIseURBQTRCLEVBQzVCLGdCQUFhLEVBQWIsa0NBQWEsRUFDYixvQkFBbUIsRUFBbkIsd0NBQW1CLEVBQ25CLG1CQUFzQyxFQUF0QywyREFBc0MsRUFDdEMsYUFBZ0IsRUFBaEIscUNBQWdCLEVBQ2hCLDZCQUFnRCxFQUFoRCxxRUFBZ0Q7UUFyQ2xELDZGQUE2RjtRQUNyRixjQUFTLEdBQW1CLElBQUksNkJBQW1CLEVBQUUsQ0FBQztRQUU5RCw4QkFBOEI7UUFDdEIsaUJBQVksR0FBZ0IsSUFBSSxDQUFDO1FBbUN2QyxJQUFJLGdCQUFnQixDQUFDO1FBQ3JCLFFBQVEsUUFBUSxFQUFFO1lBQ2hCLEtBQUssaUJBQVM7Z0JBQ1osZ0JBQWdCLEdBQUcsd0JBQWMsQ0FBQztnQkFDbEMsTUFBTTtZQUNSLEtBQUsscUJBQWE7Z0JBQ2hCLGdCQUFnQixHQUFHLDRCQUFrQixDQUFDO2dCQUN0QyxNQUFNO1lBQ1I7Z0JBQ0UsZ0JBQWdCLEdBQUcsNEJBQWtCLENBQUM7U0FDekM7UUFDRCxJQUFJLENBQUMsaUNBQWlDLEdBQUcsSUFBSSwyQ0FBaUMsQ0FDMUUsZ0JBQWdCLEVBQ2hCLFNBQVMsR0FBRyxtQkFBbUIsRUFDL0IsU0FBUyxHQUFHLGVBQWUsRUFDM0IsU0FBUyxHQUFHLGdCQUFnQixFQUM1QixTQUFTLEdBQUcsY0FBYyxFQUMxQixTQUFTLEdBQUcsa0JBQWtCLENBQUMsQ0FBQztRQUVwQyxRQUFRLFNBQVMsRUFBRTtZQUNqQixLQUFLLHdCQUFnQjtnQkFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLDZCQUFtQixFQUFFLENBQUM7Z0JBQzNDLE1BQU07WUFFUixLQUFLLDBCQUFrQjtnQkFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO2dCQUNsRixNQUFNO1lBRVI7Z0JBQ0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLDZCQUFtQixFQUFFLENBQUM7U0FDOUM7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMscUJBQXFCLEdBQUcscUJBQXFCLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsOERBQW9DLEdBQXBDO1FBQ0UsT0FBTyxJQUFJLENBQUMsaUNBQWlDLENBQUM7SUFDaEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gscUNBQVcsR0FBWDtRQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxzQ0FBWSxHQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7T0FFRztJQUNILHlDQUFlLEdBQWY7UUFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVEOztPQUVHO0lBQ0gsd0NBQWMsR0FBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxrQ0FBUSxHQUFSO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7T0FFRztJQUNILGtEQUF3QixHQUF4QjtRQUNFLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBQ3BDLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFySUQsSUFxSUM7QUFySVksMENBQWU7QUF1STVCOztHQUVHO0FBQ1UsUUFBQSxnQkFBZ0IsR0FBRyxjQUFjLENBQUM7QUFDbEMsUUFBQSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUVuRDs7R0FFRztBQUNVLFFBQUEsYUFBYSxHQUFHLFVBQVUsQ0FBQztBQUMzQixRQUFBLFNBQVMsR0FBRyxNQUFNLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LCBXU08yIEluYy4gKGh0dHA6Ly93d3cud3NvMi5vcmcpIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb24sIEZMT1dfVFlQRV9JTVBMSUNJVCwgRkxPV19UWVBFX1BLQ0UsIExvY2FsU3RvcmFnZUJhY2tlbmQsIFN0b3JhZ2VCYWNrZW5kfSBmcm9tICdAb3BlbmlkL2FwcGF1dGgnO1xuXG4vKipcbiAqIFdTTzIgSVMgT2F1dGgvT0lEQyBjb25maWd1cmF0aW9uIGRlZmluaXRpb24gY2xhc3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBJU0NvbmZpZ3VyYXRpb24ge1xuICAvLyBBcHBBdXRoIGxpYnJhcnkgY29uZmlnIGNsYXNzXG4gIHByaXZhdGUgYXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9uOiBBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb247XG5cbiAgLy8gb2F1dGgvT0lEQyBjbGllbnRJZFxuICBwcml2YXRlIGNsaWVudElkOiBzdHJpbmc7XG5cbiAgLy8gV2hlcmUgdG9rZW4gc2hvdWxkIGJlIHNhdmVkIGluIHRoZSBicm93c2VyIC0gY3VycmVudGx5IEFwcEF1dGggc3VwcG9ydHMgb25seSBsb2NhbCBzdG9yYWdlXG4gIHByaXZhdGUgdXNlclN0b3JlOiBTdG9yYWdlQmFja2VuZCA9IG5ldyBMb2NhbFN0b3JhZ2VCYWNrZW5kKCk7XG5cbiAgLy8gY2xpZW50IHNlY3JldCBmb3IgUEtDRSBmbG93XG4gIHByaXZhdGUgY2xpZW50U2VjcmV0OiBzdHJpbmd8bnVsbCA9IG51bGw7XG5cbiAgLy8gcmVkaXJlY3QgYmFjayB0byBhcHAgVVJMXG4gIHByaXZhdGUgcmVkaXJlY3RVcmk6IHN0cmluZztcblxuICAvLyBzY29wZSBvZiBPSURDL09hdXRoXG4gIHByaXZhdGUgc2NvcGU6IHN0cmluZztcblxuICAvLyBhZnRlciBsb2dvdXQgd2hlcmUgdG8gcmVkaXJlY3QgVVJMXG4gIHByaXZhdGUgcG9zdExvZ291dFJlZGlyZWN0VXJpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIHdzbzJpcy1jbGllbnQgY29uZmlnIGNsYXNzIGNvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gaXNCYXNlVXJsIHdzbzJpcyBzZXJ2ZXIgaG9zdGVkIGJhc2UgdXJsIC0gZGVmYXVsdDogaHR0cHM6Ly9sb2NhbGhvc3Q6OTQ0M1xuICAgKiBAcGFyYW0gZmxvd1R5cGUgc3BlY2lmeSB3aGV0aGVyIHRvIGdvIHdpdGggSU1QTElDSVRfRkxPVyBvciBQS0NFX0ZMT1cgLSBkZWZhdWx0OiBJTVBMSUNJVF9GTE9XXG4gICAqIEBwYXJhbSB1c2VyU3RvcmUgc3BlY2lmeSB3aGV0aGVyIHRvIGdvIHdpdGggVVNFUl9TVE9SRV9MT0NBTCBvciBVU0VSX1NUT1JFX1NFU1NJT04gKGN1cnJlbnRseVxuICAgKiBub3Qgc3VwcG9ydGVkKSAtIGRlZmF1bHQ6IFVTRVJfU1RPUkVfTE9DQUxcbiAgICogQHBhcmFtIGNsaWVudElkIG9hdXRoL09JREMgY2xpZW50SWQgLSBkZWZhdWx0OiBlbXB0eSB0ZXh0XG4gICAqIEBwYXJhbSBjbGllbnRTZWNyZXQgY2xpZW50IHNlY3JldCBmb3IgUEtDRSBmbG93IC0gZGVmYXVsdDogbnVsbFxuICAgKiBAcGFyYW0gcmVkaXJlY3RVcmkgcmVkaXJlY3QgYmFjayB0byBhcHAgVVJMIC0gZGVmYXVsdDogaHR0cDovL2xvY2FsaG9zdDo3Nzc3L1xuICAgKiBAcGFyYW0gc2NvcGUgc2NvcGUgb2YgT0lEQy9PYXV0aCAtIGRlZmF1bHQ6IG9wZW5pZFxuICAgKiBAcGFyYW0gcG9zdExvZ291dFJlZGlyZWN0VXJpIGFmdGVyIGxvZ291dCB3aGVyZSB0byByZWRpcmVjdCBVUkwgLSBkZWZhdWx0OlxuICAgKiBodHRwOi8vbG9jYWxob3N0Ojc3NzcvXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgaXNCYXNlVXJsID0gJ2h0dHBzOi8vbG9jYWxob3N0Ojk0NDMnLFxuICAgIGZsb3dUeXBlID0gSU1QTElDSVRfRkxPVyxcbiAgICB1c2VyU3RvcmUgPSBVU0VSX1NUT1JFX0xPQ0FMLFxuICAgIGNsaWVudElkID0gJycsXG4gICAgY2xpZW50U2VjcmV0ID0gbnVsbCxcbiAgICByZWRpcmVjdFVyaSA9ICdodHRwOi8vbG9jYWxob3N0Ojc3NzcvJyxcbiAgICBzY29wZSA9ICdvcGVuaWQnLFxuICAgIHBvc3RMb2dvdXRSZWRpcmVjdFVyaSA9ICdodHRwOi8vbG9jYWxob3N0Ojc3NzcvJ1xuICB9ID0ge30pIHtcbiAgICB2YXIgZmxvd1R5cGVJbnRlcm5hbDtcbiAgICBzd2l0Y2ggKGZsb3dUeXBlKSB7XG4gICAgICBjYXNlIFBLQ0VfRkxPVzpcbiAgICAgICAgZmxvd1R5cGVJbnRlcm5hbCA9IEZMT1dfVFlQRV9QS0NFO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSU1QTElDSVRfRkxPVzpcbiAgICAgICAgZmxvd1R5cGVJbnRlcm5hbCA9IEZMT1dfVFlQRV9JTVBMSUNJVDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBmbG93VHlwZUludGVybmFsID0gRkxPV19UWVBFX0lNUExJQ0lUO1xuICAgIH1cbiAgICB0aGlzLmF1dGhvcml6YXRpb25TZXJ2aWNlQ29uZmlndXJhdGlvbiA9IG5ldyBBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb24oXG4gICAgICAgIGZsb3dUeXBlSW50ZXJuYWwsXG4gICAgICAgIGlzQmFzZVVybCArICcvb2F1dGgyL2F1dGhvcml6ZScsXG4gICAgICAgIGlzQmFzZVVybCArICcvb2F1dGgyL3Rva2VuJyxcbiAgICAgICAgaXNCYXNlVXJsICsgJy9vYXV0aDIvcmV2b2tlJyxcbiAgICAgICAgaXNCYXNlVXJsICsgJy9vaWRjL2xvZ291dCcsXG4gICAgICAgIGlzQmFzZVVybCArICcvb2F1dGgyL3VzZXJpbmZvJyk7XG5cbiAgICBzd2l0Y2ggKHVzZXJTdG9yZSkge1xuICAgICAgY2FzZSBVU0VSX1NUT1JFX0xPQ0FMOlxuICAgICAgICB0aGlzLnVzZXJTdG9yZSA9IG5ldyBMb2NhbFN0b3JhZ2VCYWNrZW5kKCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFVTRVJfU1RPUkVfU0VTU0lPTjpcbiAgICAgICAgY29uc29sZS5sb2coJ1Nlc3Npb24gc3RvcmFnZSBpcyBub3QgY3VycmVudGx5IHN1cHBvcnRlZCBvbiB1bmRlcmx5aW5nIHBsYXRmb3JtLicpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy51c2VyU3RvcmUgPSBuZXcgTG9jYWxTdG9yYWdlQmFja2VuZCgpO1xuICAgIH1cblxuICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcbiAgICB0aGlzLmNsaWVudFNlY3JldCA9IGNsaWVudFNlY3JldDtcbiAgICB0aGlzLnJlZGlyZWN0VXJpID0gcmVkaXJlY3RVcmk7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIHRoaXMucG9zdExvZ291dFJlZGlyZWN0VXJpID0gcG9zdExvZ291dFJlZGlyZWN0VXJpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgQXV0aCBjb25maWcgb2JqZWN0XG4gICAqL1xuICBnZXRBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb24oKTogQXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5hdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjbGllbnQgSURcbiAgICovXG4gIGdldENsaWVudElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2xpZW50SWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB1c2VyIHN0b3JlXG4gICAqL1xuICBnZXRVc2VyU3RvcmUoKTogU3RvcmFnZUJhY2tlbmQge1xuICAgIHJldHVybiB0aGlzLnVzZXJTdG9yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNsaWVudCBzZWNyZXRcbiAgICovXG4gIGdldENsaWVudFNlY3JldCgpOiBzdHJpbmd8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuY2xpZW50U2VjcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgcmVkaXJlY3QgVVJMXG4gICAqL1xuICBnZXRSZWRpcmVjdFVyaSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnJlZGlyZWN0VXJpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3Igc2NvcGVcbiAgICovXG4gIGdldFNjb3BlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGU7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBwb3N0IGxvdWdvdXQgVVJMXG4gICAqL1xuICBnZXRQb3N0TG9nb3V0UmVkaXJlY3RVcmkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wb3N0TG9nb3V0UmVkaXJlY3RVcmk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb25zdGFudHMgZm9yIGxvY2FsIHN0b3JhZ2UgYW5kIHNlc3Npb24gc3RvcmFnZVxuICovXG5leHBvcnQgY29uc3QgVVNFUl9TVE9SRV9MT0NBTCA9ICdsb2NhbFN0b3JhZ2UnO1xuZXhwb3J0IGNvbnN0IFVTRVJfU1RPUkVfU0VTU0lPTiA9ICdzZXNzaW9uU3RvcmFnZSc7XG5cbi8qKlxuICogQ29uc3RhbnRzIGZvciBPSURDIGZsb3cgdHlwZVxuICovXG5leHBvcnQgY29uc3QgSU1QTElDSVRfRkxPVyA9ICdJTVBMSUNJVCc7XG5leHBvcnQgY29uc3QgUEtDRV9GTE9XID0gJ1BLQ0UnOyJdfQ==