// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DayJS from 'react-dayjs';
import { withRouter } from 'react-router-dom'
import showdown from 'showdown';
import { translate } from 'actions/ConfigActions';

// Stylesheets
import style from 'components/partials/ActivityTable/ActivityTableRow.module.scss';


class ActivityTableRow extends Component {
   constructor(props) {
      super(props);

      this.state = {
         modalOpen: false
      };

      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.converter = new showdown.Converter();
   }

   markdownToHtml(value) {
      return {
         __html: this.converter.makeHtml(value)
      };
   }

   getStatustext(status) {
      const foundStatus = this.props.planStatuses
         .find(planStatus => planStatus.value === status);

      return foundStatus ? foundStatus.label : '';
   }

   getParticitants(participants) {
      return participants && participants.length ? participants.map((participant, index) => {
         return (
            participant.name + (participants.length - index > 1 ? ', ' : ' ')
         )
      }) : null;
   }

   handleChange(event) {
      this.setState();
   }
   
   openModal() {
      this.setState({ modalOpen: true });
   }

   closeModal() {
      this.setState({ modalOpen: false });
   }

   saveModal() {
      this.closeModal();
   }

   getMeasureNumber() {
      return this.props.match && this.props.match.params && this.props.match.params.measureNumber
         ? this.props.match.params.measureNumber
         : null;
   }

   goToActivity() {
      this.props.history.push(`/tiltak/${this.getMeasureNumber()}/aktivitet/${this.props.activity.no}`);
   }

   renderActivity() {
      const activity = this.props.activity;
      const statusStyle = { width: `${activity.status * 20}%` }
      return (<React.Fragment>        
         <td data-label="Nr">{activity.no}</td>
         <td data-label={this.props.translate('Name')}>{activity.name}</td>
         <td data-label={this.props.translate('Description')} className={style.htmlCell} dangerouslySetInnerHTML={this.markdownToHtml(activity.description)}></td>
         <td data-label={this.props.translate('Participants')}>{this.getParticitants(activity.participants)}</td>
         <td data-label="Status"><div className={style.statusbar}><div className={style.block} style={statusStyle}></div></div>{this.getStatustext(activity.status)}</td>
         <td data-label={this.props.translate('Start')}><DayJS format="DD.MM.YYYY">{activity.implementationStart}</DayJS></td>
         <td data-label={this.props.translate('End')}><DayJS format="DD.MM.YYYY">{activity.implementationEnd}</DayJS></td>
      </React.Fragment>)            
   }

   render() {
      return (
         <React.Fragment>
            <tr onClick={() => this.goToActivity()}>{this.renderActivity()}</tr>            
         </React.Fragment>
      );
   }
}

ActivityTableRow.propTypes = {
   activity: PropTypes.object.isRequired
};

const mapDispatchToProps = {  
   translate
};

export default connect(null, mapDispatchToProps)(withRouter(ActivityTableRow));
