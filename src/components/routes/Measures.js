// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import Container from 'components/template/Container';
import AddMeasure from 'components/partials/AddMeasure';
import MeasuresTable from 'components/partials/MeasuresTable';

// Helpers
import { canAddMeasure } from 'helpers/authorizationHelpers';


class Measures extends Component {
   render() {
      return (
         <Container>
            <h1>Tiltaksplan</h1>
            {
               canAddMeasure()
                  ? <AddMeasure />
                  : ''
            }
            <MeasuresTable />
         </Container>
      )
   }
}

export default connect(null, null)(Measures);
