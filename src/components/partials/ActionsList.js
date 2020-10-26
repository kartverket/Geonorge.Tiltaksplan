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
    this.props.fetchActions().then(() => {
      this.setState({waitingForActionsResponse: false})
    });
  }

  renderActionListElements(actions) {
    return actions && actions.length
      ? actions.map(action => {
        return <ActionsListElement action={action}  />
      })
      : '';
  }

  render() {
    const actionsForRepo = !this.state.waitingForActionsResponse && this.props.actions
      ? this.props.actions
      : null;
    return actionsForRepo
      ? (<div>
        {this.renderActionsListElements(actionsForRepo)}
      </div>)
      : '';
  }
}

const mapStateToProps = state => ({actions: state.actions});

const mapDispatchToProps = {
  fetchActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsList);
