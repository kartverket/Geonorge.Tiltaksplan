// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import MeasuresTableRow from 'components/partials/MeasuresTable/MeasuresTableRow';

// Actions
import { fetchMeasures } from 'actions/MeasuresActions';

// Stylesheets
import style from 'components/partials/MeasuresTable.module.scss'


class MeasuresTable extends Component {
   constructor(props) {
      super(props);

      this.state = {
         dataFetched: false
      }
   }


   componentDidMount() {
      this.props.fetchMeasures()
        .then(() => {
          this.setState({ dataFetched: true });
        });
   }

   
   render() {
    if (!this.state.dataFetched) {
       return '';
    }

    return (
      <table className={style.measuresTable}>
         <thead>
            <tr>
               <th>Tiltak</th>
               <th>Status</th>
               <th>Eier</th>
            </tr>
         </thead>
         <tbody>
            {this.props.measures.map(measure => <MeasuresTableRow key={measure.id} measure={measure} />)}
         </tbody>
      </table>
   );
 }
}


const mapStateToProps = state => ({ measures: state.measures });

const mapDispatchToProps = {
   fetchMeasures
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasuresTable);
