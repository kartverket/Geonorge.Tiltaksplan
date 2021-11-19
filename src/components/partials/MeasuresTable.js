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
         dataFetched: false,
         measures: null,
            sort: {
            column: null,
            direction: 'desc',
            }
      }
   }

   getMeasureStatusLabel(planStatuses, measure) {
      return planStatuses.find(status => measure.status === status.value).label;
   }

   componentDidMount() {
      Promise.all([
         this.props.fetchMeasures(),
         this.props.fetchOptions()
      ])
      .then(() => {
         this.setState({ dataFetched: true, measures: this.props.planStatuses });
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
          const sortedMeasures = this.props.measures.sort((a, b) => {
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
            <table className={style.measuresTable}>
               <thead>
                  <tr>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('no')}>Nr<span className={this.setArrow('no')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('name')}>{this.props.translate('Measure')}<span className={this.setArrow('name')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('status')}>Status<span className={this.setArrow('status')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('owner')}>{this.props.translate('Owner')}<span className={this.setArrow('owner')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={this.onSort('lastupdated')}>Sist&nbsp;oppdatert<span className={this.setArrow('lastupdated')}></span></th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  {this.props.measures.map(measure => <MeasuresTableRow key={measure.id} measure={measure} planStatuses={this.props.planStatuses} />)}
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
