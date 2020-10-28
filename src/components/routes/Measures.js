// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';


// Template
import MeasuresList from 'components/partials/MeasuresList';
import Measure from 'components/partials/Measure'
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
        const selectedMeasureId = this.props.match && this.props.match.params && this.props.match.params.measureId
        ? this.props.match.params.measureId
        : null;
      return selectedMeasureId ?  (<Container>       
        <Measure measureId = {selectedMeasureId} />
      </Container>) : (
        <Container>        
        <MeasuresList  />
      </Container>
      )
    }
  }

export default connect(null, null)(Measures);
