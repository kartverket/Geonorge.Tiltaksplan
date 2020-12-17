// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MainNavigation } from '@kartverket/geonorge-web-components/MainNavigation';

// Actions
import { updateOidcCookie, updateBaatInfo } from 'actions/AuthenticationActions';

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
    const hadBaatInfo = prevProps.baatInfo && prevProps.baatInfo.user;
    const hasBaatInfo = this.props.baatInfo && this.props.baatInfo.user;
    if ((isLoggedIn !== wasLoggedIn) || (hasBaatInfo !== hadBaatInfo)) {
      this.props.updateOidcCookie(this.props.user);
      this.props.updateBaatInfo(this.props.user, this.props.baatInfo);
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
    return true
      ? (<main-navigation isLoggedIn={this.props.user ? true : false} environment={environment}></main-navigation>)
      : '';
  }
}

const mapStateToProps = state => ({
  user: state.oidc.user,
  config: state.config,
  baatInfo: state.baatInfo
});

const mapDispatchToProps = {
  updateOidcCookie,
  updateBaatInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
