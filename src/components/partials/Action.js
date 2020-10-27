// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Components
import ActionsListElement from 'components/partials/ActionsList/ActionsListElement';

// Actions
import {fetchActions} from 'actions/ActionActions';

// Stylesheets


class Action extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingForActionsResponse: true
    }
  }

  

  renderActionsListElements(action) {
    return '';
  }

  render() {
    return 'fisk'
  }
}

const mapStateToProps = state => ({action: state.action});

const mapDispatchToProps = {
  fetchActions
};

export default connect(mapStateToProps, mapDispatchToProps)(Action);
