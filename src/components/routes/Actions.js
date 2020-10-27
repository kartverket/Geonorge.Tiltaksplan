// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';


// Template
import ActionsList from 'components/partials/ActionsList';
import Action from 'components/partials/Action';
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
        const selectedActionId = this.props.match && this.props.match.params && this.props.match.params.actionId
        ? this.props.match.params.actionId
        : null;
      return selectedActionId ?  (<Container>       
        <Action actionId = {selectedActionId} />
      </Container>) : (
        <Container>        
        <ActionsList  />
      </Container>
      )
    }
  }

export default connect(null, null)(Actions);
