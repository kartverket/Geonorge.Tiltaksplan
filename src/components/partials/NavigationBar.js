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
    return (<main-navigation isLoggedIn={this.props.user ? true : false} environment={environment}></main-navigation>)
  }
}

const mapStateToProps = state => ({
  user: state.oidc.user
});

export default connect(mapStateToProps, null)(NavigationBar);
