// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import nb from 'date-fns/locale/nb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DayJS from 'react-dayjs';
import { fetchOrganizations } from 'actions/OrganizationsActions';
import { Typeahead } from 'react-bootstrap-typeahead';

// Models
import { Activity } from 'models/activity';

// Actions
import { createActivity, updateActivity } from 'actions/ActivityActions';

// Stylesheets
import formsStyle from 'components/partials/forms.module.scss';
import style from 'components/partials/ActivityDetails.module.scss';
import 'easymde/dist/easymde.min.css';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('nb', nb)

class ActivityDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: this.props.newActivity 
        ? new Activity() 
        : props.selectedActivity,
      editable: true,
      dataFetched: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
    this.saveActivity = this.saveActivity.bind(this);
  }

  componentDidMount() {
    this.props.fetchOrganizations()
      .then(() => {
        this.setState({ dataFetched: true });
      });
  }

  handleChange(data) {
    const { name, value } = data.target ? data.target : data;
    const activity = this.state.activity;
    activity[name] = value;
    this.setState({ activity });
  }

  handleParticipantsChange(participants) {
    participants = participants && participants.length
      ? participants.map(participant => {
        return participant.customOption
          ? {
            name: participant.name,
            activityId: this.state.activityId
          }
          : {
            organizationId: participant.id,
            name: participant.name,
            activityId: this.state.activity.id
          }
      })
      : [];

    this.handleChange({
      name: 'participants',
      value: participants
    })
  }

  saveActivity() {
    this.props.newActivity
      ? this.props.createActivity(this.state.activity)
      : this.props.updateActivity(this.state.activity);
    
  }

  render() {
    return this.state.activity ? (
      <React.Fragment>
        <div>
          <label>
            <input type="checkbox" checked={this.state.editable} onChange={(event) => { this.setState({ editable: event.target.checked }) }} />
                Aktiver redigering for debugging
            </label>
        </div>
        <Form.Group controlId="formName" className={style.form}>
          <Form.Label>Aktivitet <span className={`${this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <Form.Control type="text" name="name" value={this.state.activity.name} onChange={this.handleChange} />

                </div>
              )
              : (
                <div>{this.state.activity.name}</div>
              )
          }

          <Form.Label>Tittel <span className={`${this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <Form.Control type="text" name="title" value={this.state.activity.title} onChange={this.handleChange} />

                </div>
              )
              : (
                <div>{this.state.activity.title}</div>
              )
          }

          <Form.Label>Start <span className={`${this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker name="implementationStart" placeholderText="Sett startdato" selected={this.state.activity.implementationStart ? new Date(this.state.activity.implementationStart) : null} onChange={(date) => this.handleChange({name: 'implementationStart', value: date})} />
                </div>
              )
              : (
                <div><DayJS format="MMMM YYYY">{this.state.activity.implementationStart}</DayJS></div>
              )
          }

          <Form.Label>Slutt <span className={`${this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker name="implementationEnd" placeholderText="Sett sluttdato" selected={this.state.activity.implementationEnd ? new Date(this.state.activity.implementationEnd) : null} onChange={(date) => this.handleChange({name: 'implementationEnd', value: date})} />
                </div>
              )
              : (
                <div><DayJS format="MMMM YYYY" locale="nb">{this.state.activity.implementationEnd}</DayJS></div>
              )
          }

          <Form.Label>Deltakere <span className={`${this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
          {
            this.state.editable
              ? (
                <Typeahead
                  allowNew
                  multiple
                  id="basic-typeahead-multiple"
                  labelKey="name"
                  onChange={this.handleParticipantsChange}
                  options={this.props.organizations}
                  selected={this.state.activity.participants}
                  placeholder="Legg til deltakere..."
                  newSelectionPrefix="Legg til "
                />
              )
              : (
                ''
              )
          }
        </Form.Group>
        <div className={style.btngroup}>
          <Button variant="secondary" onClick={this.closeModal}>Avbryt</Button>
          <Button variant="primary" onClick={this.saveActivity}>{this.props.newActivity ? 'Opprett' : 'Lagre'}</Button>
        </div>
      </React.Fragment>
    ) : ''

  }
}

const mapStateToProps = state => ({
  selectedActivity: state.selectedActivity,
  organizations: state.organizations
});

const mapDispatchToProps = {
  createActivity,
  updateActivity,
  fetchOrganizations
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetails);
