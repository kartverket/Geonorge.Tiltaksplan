// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import '@kartverket/geonorge-web-components/MainNavigation';

// Helpers
import {getEnvironmentVariable} from 'helpers/environmentVariableHelpers.js';

class NavigationBar extends Component {

  render() {
    const environment = getEnvironmentVariable('environment');
    return (<main-navigation environment={environment}></main-navigation>)
  }
}

export default connect(null, null)(NavigationBar);
