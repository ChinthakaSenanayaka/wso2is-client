import React, { Component } from 'react';
import { ISIntegrator, ISConfiguration, IMPLICIT_FLOW, PKCE_FLOW, USER_STORE_LOCAL } from 'wso2is-client';

class Home extends Component {

  constructor(props) {
    super(props);
    
    // Basic WSO2 IS configurations and client service provider details JSON object
    var basicConfig = {clientId: '0Ob7gGlPWWoCMx4qrGNSWjRgnMwa', clientSecret: '4jjZU5nke4iovlq5seaSPVxnqBMa'};
    // WSO2 IS configurations object
    this.iSConfiguration = new ISConfiguration(basicConfig);
    // WSO2 IS integration service object
    this.iSIntegrator = new ISIntegrator(this.iSConfiguration);
    // Initialize integration service object
    this.iSIntegrator.init(this.authorizationCallback, this.endSessionCallback);

    // This binding is necessary to make `this` work in the callback
    this.loginClick = this.loginClick.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
  }

  componentDidMount() {

    // Redirect completion callback method execution for authorization completion callback and end session (logout) completion callabck.
    this.iSIntegrator.completeRedirect(window.location, this.redirectCompleteCallback);
    
  }

  loginClick() {
    var state = undefined;//'Wcj2hE0rCb';
    var nonce = undefined;//'1234';

    // Execute OIDC authorize requests against WSO2 IS server
    this.iSIntegrator.login(state, nonce);
  }

  // End session (logout) callback which will run after the end session (logout) redirection completes
  endSessionCallback(request, response, error) {
    console.log("endSessionCallback " + response.state);
  }

  // Authorization callback which will run after the authorization redirection completes
  authorizationCallback(request, response, error) {
    console.log("authorizationCallback " + response);
  }

  // Redirect completeion callback which will run after the authorization or end session (logout) request completes
  redirectCompleteCallback() {
    console.log("redirectCompleteCallback");
  }

  logoutClick() {
    var state = undefined;//'Wcj2hE0rCb';

    // Execute OIDC end session (logout) requests against WSO2 IS server
    this.iSIntegrator.logout(state);
  }

   render() {
      return (
         <div>
            <h2>Home</h2>
            <button onClick={this.loginClick}>Login</button>
            <button onClick={this.logoutClick}>Logout</button>
         </div>
      );
   }
}
export default Home;
