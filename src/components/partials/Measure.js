// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';

// Components
import MeasuresListElement from 'components/partials/MeasuresList/MeasuresListElement';

// Actions
import {fetchMeasures} from 'actions/MeasureActions';

// Stylesheets


class Measure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingForActionsResponse: true
    }
  }

  

  renderMeasuresListElements(measure) {
    return '';
  }

  render() {
    return <MeasuresListElement />
  }
}

const mapStateToProps = state => ({action: state.measure});

const mapDispatchToProps = {
  fetchMeasures
};

export default connect(mapStateToProps, mapDispatchToProps)(Measure);
