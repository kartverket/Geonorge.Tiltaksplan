// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import MeasuresTableRow from 'components/partials/MeasuresTable/MeasuresTableRow';
import { fetchMeasures } from 'actions/MeasureActions';
import style from 'components/partials/MeasuresTable.module.scss'

class MeasuresTable extends Component {
   constructor(props) {
      super(props);

      this.state = {
         waitingForActionsResponse: true
      }
   }

   componentDidMount() {
      this.props.fetchMeasures();
   }

   renderMeasureTableRows(measures) {
      if (!measures || !measures.length) {
         return '';
      }

      return (
         <table className={style.measuresTable}>
            <thead>
               <tr>
                  <th>Tiltak</th>
                  <th>Fremdrift</th>
                  <th>Volum</th>
                  <th>Status (ift. plan)</th>
                  <th>Trafikklys (iht. plan)</th>
                  <th>Konkrete resultater</th>
                  <th>Kommentar</th>
               </tr>
            </thead>
            <tbody>
               {measures.map(measure => <MeasuresTableRow key={measure.id} measure={measure} />)}
            </tbody>
         </table>
      );
   }

   render() {
      if (!this.props.measures) {
         return '';
      }

      return (
         <div>
            <h1>Tiltaksplaner</h1>

            {this.renderMeasureTableRows(this.props.measures)}
         </div>
      );
   }
}

const mapStateToProps = state => ({ measures: state.measures });

const mapDispatchToProps = {
   fetchMeasures
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasuresTable);
