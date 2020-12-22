// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import Container from 'components/template/Container';
import MeasureDetails from 'components/partials/MeasureDetails';
import MeasuresTable from 'components/partials/MeasuresTable';

// Helpers
import { canAddMeasure } from 'helpers/authorizationHelpers';


class Measures extends Component {
   render() {
      return (
         <Container>
            <h1>Tiltaksplan</h1>
            {
               canAddMeasure(this.props.authInfo)
                  ? <MeasureDetails newMeasure />
                  : ''
            }
            <MeasuresTable />
         </Container>
      )
   }
}

const mapStateToProps = state => ({
   authInfo: state.authInfo
 });

export default connect(mapStateToProps, null)(Measures);
