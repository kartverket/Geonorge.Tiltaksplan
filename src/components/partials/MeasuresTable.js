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
                   <th>Kommentar</th>
                  <th>Volum</th>
                  <th>Status (ift. plan)</th>
                  <th>Trafikklys (iht. plan)</th>
                  
                 
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

      return this.renderMeasureTableRows(this.props.measures)
   }
}

const mapStateToProps = state => ({ measures: state.measures });

const mapDispatchToProps = {
   fetchMeasures
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasuresTable);
