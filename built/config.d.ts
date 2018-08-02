import { AuthorizationServiceConfiguration, StorageBackend } from '@openid/appauth';
/**
 * WSO2 IS Oauth/OIDC configuration definition class.
 */
export declare class ISConfiguration {
    private authorizationServiceConfiguration;
    private clientId;
    private userStore;
    private clientSecret;
    private redirectUri;
    private scope;
    private postLogoutRedirectUri;
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
    constructor({ isBaseUrl, flowType, userStore, clientId, clientSecret, redirectUri, scope, postLogoutRedirectUri }?: {
        isBaseUrl?: string;
        flowType?: string;
        userStore?: string;
        clientId?: string;
        clientSecret?: null;
        redirectUri?: string;
        scope?: string;
        postLogoutRedirectUri?: string;
    });
    /**
     * Getter for Auth config object
     */
    getAuthorizationServiceConfiguration(): AuthorizationServiceConfiguration;
    /**
     * Getter for client ID
     */
    getClientId(): string;
    /**
     * Getter for user store
     */
    getUserStore(): StorageBackend;
    /**
     * Getter for client secret
     */
    getClientSecret(): string | null;
    /**
     * Getter for redirect URL
     */
    getRedirectUri(): string;
    /**
     * Getter for scope
     */
    getScope(): string;
    /**
     * Getter for post lougout URL
     */
    getPostLogoutRedirectUri(): string;
}
/**
 * Constants for local storage and session storage
 */
export declare const USER_STORE_LOCAL = "localStorage";
export declare const USER_STORE_SESSION = "sessionStorage";
/**
 * Constants for OIDC flow type
 */
export declare const IMPLICIT_FLOW = "IMPLICIT";
export declare const PKCE_FLOW = "PKCE";
