/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import { App } from '@openid/appauth';

class Home extends Component {

  constructor(props) {
    super(props);

    this.application = props.application;

    // This binding is necessary to make `this` work in the callback
    this.loginClick = this.loginClick.bind(this);
  }

  componentDidMount() {

    // Redirect completion callback method execution for authorization completion callback and end session (logout) completion callabck.
    this.application.checkForAuthorizationResponse();
    
  }

  loginClick() {

    // Execute OIDC authorize requests against WSO2 IS server
    this.application.makeAuthorizationRequest();
  }

   render() {
      return (
         <div>
            <h2>Home</h2>
            <button onClick={this.loginClick}>Login</button>
         </div>
      );
   }
}
export default Home;
