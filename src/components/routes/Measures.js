// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import Button from 'react-bootstrap/Button';

// Components
import Container from 'components/template/Container';
import MeasureDetails from 'components/partials/MeasureDetails';
import MeasuresTable from 'components/partials/MeasuresTable';

// Helpers
import { canAddMeasure } from 'helpers/authorizationHelpers';
import { convertMeasureReportsToCSV } from 'helpers/csvHelpers';

// Actions
import { fetchMeasures } from 'actions/MeasuresActions';


class Measures extends Component {


   saveCSVFileForMeasureReports() {
      var filename = 'reports.csv';
      const contentString = convertMeasureReportsToCSV(this.props.measures)
      var blob = new Blob([contentString], {
         type: "text/csv;charset=utf-8"
      });
      saveAs(blob, filename);
   }

   render() {
      return (
         <Container>
            <h1>Tiltaksplan</h1>
            <MeasureDetails newMeasure />
            <MeasuresTable measures={this.props.measures} />
            <Button variant="primary" onClick={() => this.saveCSVFileForMeasureReports()}>Lagre som CSV</Button>
         </Container>
      )
   }
}

const mapStateToProps = state => ({
   authInfo: state.authInfo,
   measures: state.measures.measures
});

const mapDispatchToProps = {
   fetchMeasures
};

export default connect(mapStateToProps, mapDispatchToProps)(Measures);
