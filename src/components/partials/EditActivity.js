// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import nb from 'date-fns/locale/nb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { updateActivity } from 'actions/ActivityActions';

// Stylesheets
import formsStyle from 'components/partials/forms.module.scss'
import 'easymde/dist/easymde.min.css';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('nb', nb)

class EditActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: props.selectedActivity,
      editable: false
    };
    this.saveActivity = this.saveActivity.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(data) {
    const { name, value } = data.target ? data.target : data;
    const activity = this.state.activity;
    activity[name] = value;
    this.setState({ activity });
  }

  saveActivity() {
    this.props.updateActivity(this.state.activity);
  }

  render() {
    return this.state.activity ? (
      <Container>
        <div>
          <label>
            <input type="checkbox" checked={this.state.editable} onChange={(event) => { this.setState({ editable: event.target.checked }) }} />
                Aktiver redigering for debugging
            </label>
        </div>
        <Form.Group controlId="formName">
          <Form.Label>Aktivitet</Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <Form.Control type="text" name="name" value={this.state.activity.name} onChange={this.handleChange} />
                  <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} />
                </div>
              )
              : (
                <span>{this.state.activity.name}</span>
              )
          }

          <Form.Label>Tittel</Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <Form.Control type="text" name="title" value={this.state.activity.title} onChange={this.handleChange} />
                  <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} />
                </div>
              )
              : (
                <span>{this.state.activity.title}</span>
              )
          }

          <Form.Label>Start</Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker name="implementationStart" placeholderText="Sett startdato" selected={new Date(this.state.activity.implementationStart)} onChange={this.handleChange} />
                  <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} />
                </div>
              )
              : (
                <span>{this.state.activity.implementationStart}</span>
              )
          }

          <Form.Label>Slutt</Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker name="implementationEnd" placeholderText="Sett sluttdato" selected={new Date(this.state.activity.implementationEnd)} onChange={this.handleChange} />
                  <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} />
                </div>
              )
              : (
                <span>{this.state.activity.implementationEnd}</span>
              )
          }

          <Form.Label>Deltakere</Form.Label>
         
        </Form.Group>
        <Button variant="secondary" onClick={this.closeModal}>Avbryt</Button>
        <Button variant="primary" onClick={this.saveActivity}>Lagre</Button>
      </Container>
    ) : ''

  }
}

const mapStateToProps = state => ({
  selectedActivity: state.selectedActivity
});

const mapDispatchToProps = {
  updateActivity
};

export default connect(mapStateToProps, mapDispatchToProps)(EditActivity);
