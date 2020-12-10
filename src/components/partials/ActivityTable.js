// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import ActivityTableRow from 'components/partials/ActivityTable/ActivityTableRow';
import { fetchOptions } from 'actions/OptionsActions';

// Stylesheets
import style from 'components/partials/ActivityTable.module.scss'

class ActivityTable extends Component {
   constructor(props) {
      super(props);

      this.state = {
         dataFetched: false
      };
   }

   componentDidMount() {
      this.props.fetchOptions()
         .then(() => {
            this.setState({ dataFetched: true });
         });
   }

   renderActivityTableRows(activities) {
      if (!activities || !activities.length) {
         return (
            <React.Fragment>
               <div className={style.block}>
                  <p>Ingen aktiveterer lagt til dette tiltaket enda.</p>
               </div>
            </React.Fragment>
         );
      }

      return (
         <React.Fragment>
            <table className={style.activitiesTable}>
               <thead>
                  <tr>
                     <th>Nr</th>
                     <th>Navn</th>
                     <th>Beskrivelse</th>
                     <th>Deltakere</th>
                     <th>Status</th>
                     <th>Start</th>
                     <th>Slutt</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  {activities.map(activity => <ActivityTableRow key={activity.id} activity={activity} planStatuses={this.props.planStatuses} />)}
               </tbody>
            </table>
         </React.Fragment>
      );
   }

   render() {
      if (!this.state.dataFetched || !this.props.activities) {
         return '';
      }
      
      return this.renderActivityTableRows(this.props.activities);
   }
}

const mapStateToProps = state => ({
   planStatuses: state.options.planStatuses
});

const mapDispatchToProps = {
   fetchOptions
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTable);
