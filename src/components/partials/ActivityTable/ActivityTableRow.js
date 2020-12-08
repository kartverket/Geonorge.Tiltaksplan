// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DayJS from 'react-dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom'
import showdown from 'showdown';
import { Link } from 'react-router-dom';


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

   getMeasureId() {
      return this.props.match && this.props.match.params && this.props.match.params.measureId
         ? this.props.match.params.measureId
         : null;
   }

   goToActivity() {
      this.props.history.push(`/tiltak/${this.getMeasureId()}/aktivitet/${this.props.activity.id}`);
   }

   renderActivity() {
      const activity = this.props.activity;
      const statusStyle = { width: `${activity.status * 20}%` }
      return (<React.Fragment>
         <td onClick={() => this.goToActivity()}>{activity.name}</td>
         <td className={style.htmlCell} dangerouslySetInnerHTML={this.markdownToHtml(activity.description)}></td>
         <td>{this.getParticitants(activity.participants)}</td>
         <td><div className={style.statusbar}><div className={style.block} style={statusStyle}></div></div>{this.getStatustext(activity.status)}</td>
         <td><DayJS format="DD.MM.YYYY">{activity.implementationStart}</DayJS></td>
         <td><DayJS format="DD.MM.YYYY">{activity.implementationEnd}</DayJS></td>
         <td><div className={style.svgblock}>
            <Link to={{pathname: `/tiltak/${this.getMeasureId()}/aktivitet/${this.props.activity.id}`, state: {editable: true}}}><FontAwesomeIcon onClick={() => this.goToActivity()} icon="edit" /></Link>
            </div></td>
      </React.Fragment>)
            
   }

   render() {
      return (
         <React.Fragment>
            <tr>{this.renderActivity()}</tr>            
         </React.Fragment>
      );
   }
}

ActivityTableRow.propTypes = {
   activity: PropTypes.object.isRequired
};

export default connect(null, null)(withRouter(ActivityTableRow));
