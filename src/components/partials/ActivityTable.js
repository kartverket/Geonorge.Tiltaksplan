// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ActivityTableRow from 'components/partials/ActivityTable/ActivityTableRow';

import { DataTable } from '@kartverket/geonorge-web-components/DataTable';
import style from 'components/partials/ActivityTable.module.scss'

class ActivityTable extends Component {
      
   renderActivityTableRows(activities) {
      if (!activities || !activities.length) {
         return 'Ingen aktivitere lagt til';
      }

      return (<React.Fragment>         

         <table className={style.activitiesTable}>
         <thead>
             <tr>
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
         {activities.map(activity => <ActivityTableRow key={activity.id} activity={activity} />)}
         </tbody>
         </table>

        
        </React.Fragment>
      );
   }

   render() {
      const activities = this.props.activities;        
      return activities ? this.renderActivityTableRows(activities) : ''
   }
}

const mapStateToProps = state => ({ activities: state.activities });


export default connect(null, null)(ActivityTable);
