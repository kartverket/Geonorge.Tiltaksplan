// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';

// Components
import CommitsList from 'components/partials/CommitsList';

// Template
import Container from 'components/template/Container';

class Commits extends Component {
  renderCommitsList(commits) {
    const commitsElements = commits && commits.length
      ? commits.map(commit => {
        return (<div key={commit.sha}>{commit.commit.message}</div>)
      })
      : null;
    return commitsElements
      ? commitsElements
      : '';
  }

  render() {
    return (<Container>
      <h1>Commits</h1>
      <CommitsList owner='benjamindehli' repo='react-redux-boilerplate'/>
    </Container>)
  }
}

export default connect(null, null)(Commits);
