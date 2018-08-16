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
import ReactDOM from 'react-dom';

class Profile extends Component {

    constructor(props) {
        super(props);
    
        this.application = props.application;
    
        // This binding is necessary to make `this` work in the callback
        this.logoutClick = this.logoutClick.bind(this);
    }

    logoutClick() {
        // Execute OIDC end session (logout) requests against WSO2 IS server
        this.application.makeLogoutRequest();
    }

    //TODO: Hide the logout button if the user is not logged in and show non logged in user content on this pasge
    render() {
        return (
            <div>
                <h2>Login</h2>
                <button onClick={this.logoutClick}>Logout</button>
            </div>
        );
    }
}
export default Profile;
