// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Stylesheets
import style from 'components/partials/CommitsList/CommitsListElement.module.scss';

class CommitsListElement extends Component {

  render() {
    const commit = this.props.commit;
    return this.props.commit
      ? (<div className={style.commitsListElement}>
        <div className={style.avatar}>
          <a href={commit.author.html_url} className={style.author}>
            <img src={commit.author.avatar_url} className={style.authorAvatar} alt={`Avatar for ${this.props.commit.commit.author.name}`}/>
          </a>
        </div>
        <div className={style.text}>
          <a href={commit.html_url} className={style.message}>{commit.commit.message}</a>
          <a href={commit.author.html_url} className={style.authorName}>{this.props.commit.commit.author.name}</a>
        </div>
      </div>)
      : '';
  }
}

CommitsListElement.propTypes = {
  commit: PropTypes.object.isRequired
};

export default connect(null, null)(CommitsListElement);
