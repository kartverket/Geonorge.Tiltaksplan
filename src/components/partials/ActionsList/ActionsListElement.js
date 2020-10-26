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
        <div className={style.avatar}>
          <a href={action.author.html_url} className={style.author}>
            <img src={action.author.avatar_url} className={style.authorAvatar} alt={`Avatar for ${this.props.action.action.author.name}`}/>
          </a>
        </div>
        <div className={style.text}>
          <a href={action.html_url} className={style.message}>{action.action.message}</a>
          <a href={action.author.html_url} className={style.authorName}>{this.props.action.action.author.name}</a>
        </div>
      </div>)
      : '';
  }
}

ActionsListElement.propTypes = {
  action: PropTypes.object.isRequired
};

export default connect(null, null)(ActionsListElement);
