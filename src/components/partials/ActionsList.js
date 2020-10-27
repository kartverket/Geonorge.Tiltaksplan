// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Components
import ActionsListElement from 'components/partials/ActionsList/ActionsListElement';

// Actions
import {fetchActions} from 'actions/ActionActions';

// Stylesheets


class ActionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingForActionsResponse: true
    }
  }

  componentDidMount() {
    this.props.fetchActions();
  }

  renderActionsListElements(actions) {
    return actions && actions.length
      ? actions.map(action => {
        return <ActionsListElement action={action}  />
      })
      : '';
  }

  render() {
    return this.props.actions
      ? (<div>
        {this.renderActionsListElements(this.props.actions)}
      </div>)
      : '';
  }
}

const mapStateToProps = state => ({actions: state.actions});

const mapDispatchToProps = {
  fetchActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsList);
