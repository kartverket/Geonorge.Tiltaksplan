// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Stylesheets
import style from 'components/partials/ActionsList/ActionsListElement.module.scss';

class ActionsListElement extends Component {

  render() {
    const action = this.props.action;
    return this.props.action
      ? (<div className={style.ActionsListElement}>
        {action.name}
      </div>)
      : '';
  }
}

ActionsListElement.propTypes = {
  action: PropTypes.object.isRequired
};

export default connect(null, null)(ActionsListElement);
