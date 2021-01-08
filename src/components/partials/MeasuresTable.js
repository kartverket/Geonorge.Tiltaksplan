// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import MeasuresTableRow from 'components/partials/MeasuresTable/MeasuresTableRow';

// Actions
import { fetchMeasures } from 'actions/MeasuresActions';
import { fetchOptions } from 'actions/OptionsActions';
import { translate } from 'actions/ConfigActions';

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
      Promise.all([
         this.props.fetchMeasures(),
         this.props.fetchOptions()
      ])
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
               <th>Nr</th>
               <th>{this.props.translate('Measure')}</th>
               <th>Status</th>
               <th>Eier</th>
            </tr>
         </thead>
         <tbody>
            {this.props.measures.map(measure => <MeasuresTableRow key={measure.id} measure={measure} planStatuses={this.props.planStatuses} />)}
         </tbody>
      </table>
   );
 }
}


const mapStateToProps = state => ({ 
   measures: state.measures.measures,
   planStatuses: state.options.planStatuses,
   selectedLanguage: state.selectedLanguage
});

const mapDispatchToProps = {
   fetchMeasures,
   fetchOptions,
   translate
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasuresTable);
