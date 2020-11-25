// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import ActivityTableRow from 'components/partials/ActivityTable/ActivityTableRow';

// Stylesheets
import style from 'components/partials/ActivityTable.module.scss'

class ActivityTable extends Component {
      
   renderActivityTableRows(activities) {
      if (!activities || !activities.length) {
         return (<React.Fragment>
            <div className={style.block}>
            <p>Ingen aktiveterer lagt til dette tiltaket enda.</p>
            </div>
         </React.Fragment>);
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

export default connect(null, null)(ActivityTable);
