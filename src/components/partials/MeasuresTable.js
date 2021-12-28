// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

// Components
import MeasuresTableRow from 'components/partials/MeasuresTable/MeasuresTableRow';
import { SelectDropdown } from 'components/custom-elements';
import Form from 'react-bootstrap/Form';

// Actions
import { fetchMeasures } from 'actions/MeasuresActions';
import { fetchOptions } from 'actions/OptionsActions';
import { translate } from 'actions/ConfigActions';

// Stylesheets
import style from 'components/partials/MeasuresTable.module.scss';
import formsStyle from 'components/partials/forms.module.scss';


class MeasuresTable extends Component {
   constructor(props) {
      super(props);
      this.state = {
         dataFetched: false,
         statusSelected: 0,
         statuses : null,
         measures: null,
            sort: {
            column: null,
            direction: 'desc',
            },
         measuresAll: null
      }

      this.handleChange = this.handleChange.bind(this);
   }



   handleChange(data) {

      let statusMeasures = this.state.measuresAll;
      let status = data.value;

      if(status != 0)
      {
      statusMeasures = statusMeasures.filter(function (el) {
         return el.status == status ;
       });
      }

      this.setState({
         statusSelected: status,
         measures: statusMeasures
     })
    }

   getMeasureStatusLabel(planStatuses, measure) {
      return planStatuses.find(status => measure.status === status.value).label;
   }

   statusExists(status, arr) {
      return arr.some(function(el) {
        return el.value === status;
      }); 
    }


   componentDidMount() {
      Promise.all([
         this.props.fetchMeasures(),
         this.props.fetchOptions()
      ])
      .then(() => {
         this.setState({ dataFetched: true, measures: this.props.measures, measuresAll: this.props.measures, statuses: this.props.planStatuses });
         let planStatuses = this.state.statuses;
         console.log(this.props.measures);
         let allStatus = {value:0, label: "Alle"};
         if(!this.statusExists(0, planStatuses))
            planStatuses.unshift(allStatus);
         this.setState({ statuses: planStatuses });
      });
   }

   setArrow = (column) => {
      let className = 'sort-direction';
      
      if (this.state.sort.column === column) {
        className += this.state.sort.direction === 'asc' ? ` ${style.asc}` : ` ${style.desc}`;
      }
      
      return className;
      };

   onSort = column => {
      return e => {
          const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'asc'
          const sortedMeasures = this.state.measures.sort((a, b) => {
              if (column === 'owner') {
                  const nameA = a.owner.name;
                  const nameB = b.owner.name;
  
                  if (nameA < nameB)
                      return -1
                  if (nameA < nameB)
                      return 1
                  else return 0
              }
              else if (column === 'status') {

               const nameA = this.getMeasureStatusLabel(this.props.planStatuses, a)
               const nameB = this.getMeasureStatusLabel(this.props.planStatuses, b)

               if (nameA < nameB)
                   return -1
               if (nameA < nameB)
                   return 1
               else return 0
               }
               else if (column === 'name') {

                  const nameA = a.name
                  const nameB = b.name
   
                  if (nameA < nameB)
                      return -1
                  if (nameA < nameB)
                      return 1
                  else return 0
               }
               else if (column === 'lastupdated') {

                  const nameA = a.lastUpdatedActivity
                  const nameB = b.lastUpdatedActivity

                  return new Date(nameA) - new Date(nameB)
               }
               else if (column === 'no') {

                  const nameA = a.no
                  const nameB = b.no
   
                  if (nameA < nameB)
                        return -1
                  if (nameA < nameB)
                        return 1
                  else return 0
               }
              else {
                  return a.first - b.first
              }
          })

          if (direction === 'desc') {
            sortedMeasures.reverse()
          }
          

          this.setState({
              measures: sortedMeasures,
              sort: {
                  column,
                  direction,
              },
          })
      }
  }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return (
         <React.Fragment>

            <p>{this.props.translate('MeasureActivitiesDescription')}</p>
            <div>Status </div>
            <div className={formsStyle.comboInput}>
                  <SelectDropdown
                    name="status"
                    value={this.state.statusSelected}
                    options={this.state.statuses}
                    onSelect={this.handleChange}
                    className={formsStyle.statusSelect}
                  />

            </div>
            <ReactTooltip />
            <table className={style.measuresTable}>
               <thead>
                  <tr>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('no')}><span data-tip="Unikt nummer på tiltaket">Nr</span><span className={this.setArrow('no')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('name')}><span data-tip="Navn på tiltaket">{this.props.translate('Measure')}</span><span className={this.setArrow('name')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('status')}><span data-tip="Viser fremdrift på tiltaket">Status</span><span className={this.setArrow('status')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('owner')}><span data-tip="Hovedansvarlig for gjennomføring av tiltaket">{this.props.translate('Owner')}</span><span className={this.setArrow('owner')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('lastupdated')}><span data-tip="Siste oppdatering av aktiviteter">Sist&nbsp;oppdatert</span><span className={this.setArrow('lastupdated')}></span></th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  {this.state.measures.map(measure => <MeasuresTableRow key={measure.id} measure={measure} planStatuses={this.props.planStatuses} />)}
               </tbody>
            </table>
         </React.Fragment>
      );
   }
}


const mapStateToProps = state => ({
   planStatuses: state.options.planStatuses,
   selectedLanguage: state.selectedLanguage
});

const mapDispatchToProps = {
   fetchMeasures,
   fetchOptions,
   translate
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasuresTable);
