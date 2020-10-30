// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Template
import MeasuresList from 'components/partials/MeasuresList';
import Container from 'components/template/Container';


class Measures extends Component {
  renderMeasuresList(measures) {
    const measuresElements = measures && measures.length
      ? measures.map(measure => {
        return (<div key={measure.sha}>{measure.action.message}</div>)
      })
      : null;
    return measuresElements
      ? measuresElements
      : '';
  }

  render() {
    return (
      <Container>
        <MeasuresList />
      </Container>
    )
  }
}

export default connect(null, null)(Measures);
