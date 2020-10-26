// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';


// Template
import ActionsList from 'components/partials/ActionsList';
import Container from 'components/template/Container';


class Actions extends Component {
    renderActionsList(actions) {
      const actionsElements = actions && actions.length
        ? actions.map(action => {
          return (<div key={action.sha}>{action.action.message}</div>)
        })
        : null;
      return actionsElements
        ? actionsElements
        : '';
    }
  
    render() {
      return (<Container>
        <h1>Actions</h1>
        <ActionsList  />
      </Container>)
    }
  }

export default connect(null, null)(Actions);
