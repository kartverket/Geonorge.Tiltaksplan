// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { MainNavigation } from '@kartverket/geonorge-web-components/MainNavigation';


class NavigationBar extends Component {

  render() {
    return (<main-navigation environment="dev"></main-navigation>)
  }
}

export default connect(null, null)(NavigationBar);
