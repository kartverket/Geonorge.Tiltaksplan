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
               canAddMeasure(this.props.authInfo)
                  ? <AddMeasure />
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
