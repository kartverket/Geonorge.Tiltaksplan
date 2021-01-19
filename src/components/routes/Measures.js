// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import Button from 'react-bootstrap/Button';

// Components
import Container from 'components/template/Container';
import MeasureDetails from 'components/partials/MeasureDetails';
import MeasuresTable from 'components/partials/MeasuresTable';
import { translate } from 'actions/ConfigActions';
// Helpers
import { convertMeasureReportsToCSV } from 'helpers/csvHelpers';

// Actions
import { fetchMeasures } from 'actions/MeasuresActions';


class Measures extends Component {


   saveCSVFileForMeasureReports() {
      const filename = "reports.csv";
      const BOM = "\uFEFF";
      const csvData = `${BOM} ${convertMeasureReportsToCSV(this.props.measures, this.props.options)}`;
      const blob = new Blob([csvData], {
         type: "text/csv;charset=utf-8"
      });
      saveAs(blob, filename);
   }

   render() {
      return (
         <Container>
            <h1>{this.props.translate('MeasureActivitiesTitle')}</h1>
            <MeasureDetails newMeasure />
            <MeasuresTable measures={this.props.measures} />
            <Button variant="primary" onClick={() => this.saveCSVFileForMeasureReports()}>Lagre som CSV</Button>
         </Container>
      )
   }
}

const mapStateToProps = state => ({
   authInfo: state.authInfo,
   measures: state.measures.measures,
   options: state.options
});

const mapDispatchToProps = {
   fetchMeasures,
   translate
};

export default connect(mapStateToProps, mapDispatchToProps)(Measures);
