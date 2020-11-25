// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DayJS from 'react-dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom'

// Stylesheets
import style from 'components/partials/ActivityTable/ActivityTableRow.module.scss';

class ActivityTableRow extends Component {
   constructor(props) {
      super(props);

      this.state = {
         modalOpen: false,
      };

      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.saveModal = this.saveModal.bind(this);
      this.handleChange = this.handleChange.bind(this);
   }

   getStatustext(status) {
      switch (status) {
         case 1:
            return 'Oppstart';
         case 2:
            return 'Utredning';
         case 3:
            return 'Utarbeidende';
         case 4:
            return 'Avsluttende fase';
         case 5:
            return 'Gjennomført';
         default:
            return '';
      };
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
      this.setState({
         modalOpen: true
      });
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
         <td>{activity.name}</td>
         <td>{activity.description}</td>
         <td>{this.getParticitants(activity.participants)}</td>
         <td><div className={style.statusbar}><div className={style.block} style={statusStyle}></div></div>{this.getStatustext(activity.status)}</td>
         <td><DayJS format="DD.MM.YYYY">{activity.implementationStart}</DayJS></td>
         <td><DayJS format="DD.MM.YYYY">{activity.implementationEnd}</DayJS></td>
         <td><div className={style.svgblock}>
            <FontAwesomeIcon onClick={this.openModal} icon="edit" />
            <FontAwesomeIcon onClick={this.openModal} icon="trash-alt" /></div></td>
      </React.Fragment>)
   }

   render() {
      return (
         <React.Fragment>
            <tr onClick={() => this.goToActivity()}>{this.renderActivity()}</tr>
            { /*<Modal
            show={this.state.modalOpen}
            onHide={this.closeModal}
            keyboard={false}
            animation={false}
            centered
            backdrop="static"
            aria-labelledby="form-dialog-title">
            <Modal.Header closeButton>
               <Modal.Title>Slett aktivitet</Modal.Title>
            </Modal.Header>

            <Modal.Body>
               <p>Er du sikker på at du vil slette {this.props.activity.name}?</p>
            </Modal.Body>

            <Modal.Footer>
               <Button variant="secondary" onClick={this.closeModal}>Avbryt</Button>
               <Button variant="danger" onClick={this.delete}>Slett</Button>
            </Modal.Footer>
         </Modal> */}
         </React.Fragment>
      );
   }
}

ActivityTableRow.propTypes = {
   activity: PropTypes.object.isRequired
};

export default connect(null, null)(withRouter(ActivityTableRow));
