// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MainNavigation } from '@kartverket/geonorge-web-components/MainNavigation';

// Actions
import { updateOidcCookie } from 'actions/AuthenticationActions';
import { updateAuthInfo } from 'actions/AuthorizationActions';

// Helpers
import { getEnvironmentVariable } from 'helpers/environmentVariableHelpers.js';

class NavigationBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mainNavigationIsInitialized: false
    };
  }

  componentDidMount() {
    this.initMainNavigation();
  }

  componentDidUpdate(prevProps) {
    const wasLoggedIn = prevProps.user;
    const isLoggedIn = this.props.user;
    const hadAuthInfo = prevProps.authInfo && prevProps.authInfo.user;
    const hasAuthInfo = this.props.authInfo && this.props.authInfo.user;
    if ((isLoggedIn !== wasLoggedIn) || (hasAuthInfo !== hadAuthInfo)) {
      this.props.updateOidcCookie(this.props.user);
      this.props.updateAuthInfo();
    }
  }

  initMainNavigation() {
    const userManager = this.props.userManager;
    MainNavigation.setup('main-navigation', {
      onSignInClick: () => {
        userManager.signinRedirect();
      },
      onSignOutClick: () => {
        userManager.signoutRedirect({ 'id_token_hint': this.props.user.id_token });
        userManager.removeUser();
      }
    });
  }

  render() {
    const environment = getEnvironmentVariable('environment');
    return this.props.user
      ? <main-navigation isLoggedIn environment={environment}></main-navigation>
      : <main-navigation environment={environment}></main-navigation>;
  }
}

const mapStateToProps = state => ({
  user: state.oidc.user,
  config: state.config,
  authInfo: state.authInfo
});

const mapDispatchToProps = {
  updateOidcCookie,
  updateAuthInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
