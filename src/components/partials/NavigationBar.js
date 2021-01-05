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
    if (!this.props.oidc.isLoadingUser) {
      this.initMainNavigation();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.state.mainNavigationIsInitialized) {
      this.initMainNavigation();
    }
    const wasLoggedIn = prevProps.oidc.user;
    const isLoggedIn = this.props.oidc.user;
    const hadAuthInfo = prevProps.authInfo && prevProps.authInfo.user;
    const hasAuthInfo = this.props.authInfo && this.props.authInfo.user;
    if ((isLoggedIn !== wasLoggedIn) || (hasAuthInfo !== hadAuthInfo)) {
      this.props.updateOidcCookie(this.props.oidc.user);
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
        userManager.signoutRedirect({ 'id_token_hint': this.props.oidc.user.id_token });
        userManager.removeUser();
      }
    });
    this.setState({
      mainNavigationIsInitialized: true
    });
  }

  render() {
    const environment = getEnvironmentVariable('environment');
    return <main-navigation isLoggedIn={this.props.oidc.user ? true : false} environment={environment}></main-navigation>
  }
}

const mapStateToProps = state => ({
  oidc: state.oidc,
  config: state.config,
  authInfo: state.authInfo
});

const mapDispatchToProps = {
  updateOidcCookie,
  updateAuthInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
