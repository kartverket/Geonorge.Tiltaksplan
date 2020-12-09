// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MainNavigation } from '@kartverket/geonorge-web-components/MainNavigation';


// Utils
import userManager from 'utils/userManager';

// Helpers
import { getEnvironmentVariable } from 'helpers/environmentVariableHelpers.js';

class NavigationBar extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    MainNavigation.setup('main-navigation', {
      onSignInClick: () => {
        userManager.signinRedirect();
      },
      onSignOutClick: () => {
        userManager.signoutRedirect({ 'id_token_hint': this.props.user.id_token });
        userManager.removeUser();
      }
    })
  }

  render() {
    const environment = getEnvironmentVariable('environment');
    return (<main-navigation environment={environment}></main-navigation>)
  }
}

export default connect(null, null)(NavigationBar);
