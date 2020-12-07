import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'components/template/Container';
import AddMeasure from 'components/partials/AddMeasure';
import MeasuresTable from 'components/partials/MeasuresTable';

class Measures extends Component {
   render() {
      return (
         <Container>
            <h1>Tiltaksplan</h1>

            <AddMeasure />
            <MeasuresTable />
         </Container>
      )
   }
}

export default connect(null, null)(Measures);
