// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Components
import CommitsListElement from 'components/partials/CommitsList/CommitsListElement';

// Actions
import {fetchCommits} from 'actions/CommitActions';

// Stylesheets
import style from 'components/partials/CommitsList.module.scss';

class CommitsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingForCommitsResponse: true
    }
  }

  componentDidMount() {
    this.props.fetchCommits(this.props.owner, this.props.repo).then(() => {
      this.setState({waitingForCommitsResponse: false})
    });
  }

  renderCommitsListElements(commits) {
    return commits && commits.length
      ? commits.map(commit => {
        return <CommitsListElement key={commit.sha} commit={commit} />
      })
      : '';
  }

  render() {
    const commitsForRepo = !this.state.waitingForCommitsResponse && this.props.commits && this.props.commits[this.props.owner] && this.props.commits[this.props.owner][this.props.repo]
      ? this.props.commits[this.props.owner][this.props.repo]
      : null;
    return commitsForRepo
      ? (<div className={style.commitsList}>
        {this.renderCommitsListElements(commitsForRepo)}
      </div>)
      : '';
  }
}

CommitsList.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired
};

const mapStateToProps = state => ({commits: state.commits});

const mapDispatchToProps = {
  fetchCommits
};

export default connect(mapStateToProps, mapDispatchToProps)(CommitsList);
