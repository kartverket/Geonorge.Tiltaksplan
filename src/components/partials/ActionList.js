// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Components
import ActionsListElement from 'components/partials/ActionsList/ActionsListElement';

// Actions
import {fetchActions} from 'actions/ActionActions';

// Stylesheets
import style from 'components/partials/ActionList.module.scss';

class ActionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingForActionsResponse: true
    }
  }

  componentDidMount() {
    this.props.fetchActions(this.props.owner, this.props.repo).then(() => {
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
    return 'fisk'
  }
}

ActionsList.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired
};

const mapStateToProps = state => ({commits: state.commits});

const mapDispatchToProps = {
  fetchActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsList);
