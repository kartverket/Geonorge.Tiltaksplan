// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import ActivityTableRow from 'components/partials/ActivityTable/ActivityTableRow';
import { fetchOptions } from 'actions/OptionsActions';
import { translate } from 'actions/ConfigActions';

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
                  <p>Tekst mangler</p>
               </div>
            </React.Fragment>
         );
      }

      return (
         <React.Fragment>
   
            <table className={style.activitiesTable}>
               <thead>
                  <tr>
                     <th>NR</th>
                     <th>{this.props.translate('Name')}</th>
                     <th>{this.props.translate('Description')}</th>
                     <th>{this.props.translate('Participants')}</th>
                     <th>Status</th>
                     <th>{this.props.translate('Start')}</th>
                     <th>{this.props.translate('End')}</th>
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
   fetchOptions,
   translate
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTable);
