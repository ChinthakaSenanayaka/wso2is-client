import { ISConfiguration } from './config';
/**
 * WSO2 IS Oauth/OIDC integration wrapper class.
 */
export declare class ISIntegrator {
    private configuration;
    private clientId;
    private clientSecret;
    private redirectUri;
    private scope;
    private postLogoutRedirectUri;
    private localStorageBackend;
    private endSessionNotifier;
    private endSessionHandler;
    private authorizationNotifier;
    private authorizationHandler;
    private pkceTokenRequestHandler;
    constructor(isConfig: ISConfiguration);
    init(authorizationListenerCallback: Function, endSessionListenerCallback: Function): void;
    completeRedirect(location: Location, redirectCompleteCallback: Function): void;
    login(state: string, nonce?: string): void;
    logout(state: string): void;
    idTokenHandler(result: string, state: string): void;
    parseQueryString(location: Location, splitByHash: boolean): Object;
}
