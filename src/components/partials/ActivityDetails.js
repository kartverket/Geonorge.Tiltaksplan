// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import SimpleMDE from "react-simplemde-editor";
import { registerLocale } from "react-datepicker";
import nb from 'date-fns/locale/nb';
import DayJS from 'react-dayjs';
import { Typeahead } from 'react-bootstrap-typeahead';
import { toastr } from 'react-redux-toastr'
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';

// Components
import { SelectDropdown } from 'components/custom-elements';

// Models
import { Activity } from 'models/activity';

// Actions
import { createActivity, updateActivity, deleteActivity } from 'actions/ActivityActions';
import { fetchOrganizations } from 'actions/OrganizationsActions';
import { fetchOptions } from 'actions/OptionsActions';

// Stylesheets
import formsStyle from 'components/partials/forms.module.scss';
import 'easymde/dist/easymde.min.css';
import "react-datepicker/dist/react-datepicker.css";
import "style/react-datepicker-override.scss";

registerLocale('nb', nb)

class ActivityDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: this.props.newActivity
        ? new Activity({ measureId: this.getMeasureId() })
        : props.selectedActivity,
      editable: this.props.location.state && this.props.location.state.editable || this.props.newActivity ? true : false,
      dataFetched: false,
      modalOpen: false
    };
    this.getMdeInstance = this.getMdeInstance.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
    this.saveActivity = this.saveActivity.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.props.fetchOrganizations(),
      this.props.fetchOptions()
    ])
      .then(() => {
        this.setState({ dataFetched: true });
      });
  }

  handleChange(data) {
    const { name, value } = data.target ? data.target : data;
    const activity = this.state.activity;
    activity[name] = isNaN(value) ? value : parseInt(value);
    this.setState({ activity });
  }
  openModal() {
    this.setState({ modalOpen: true });
  }
  closeModal() {
    this.setState({ modalOpen: false });
  }

  handleParticipantsChange(participants) {
    if (!participants.length) {
      return;
    }   
    participants.forEach(participant => {
      if (participant.customOption) {
        delete participant.id;
        delete participant.customOption
      }
      participant.activityId = this.state.activity.id;
    });


    this.handleChange({
      name: 'participants',
      value: participants
    });
  }
  getActivityStatusLabel(planStatuses, activity) {
    return planStatuses && activity.status && planStatuses[activity.status] && 
       planStatuses[activity.status].label ? planStatuses[activity.status].label : '';
 }

  handleDelete() {
    this.props.deleteActivity(this.state.activity)
      .then(() => {
        this.props.history.push(`/tiltak/${this.getMeasureId()}`);
      });
  }
  getMeasureId() {
    return this.props.match && this.props.match.params && this.props.match.params.measureId
      ? parseInt(this.props.match.params.measureId)
      : null;
  }


  saveActivity() {
    this.props.newActivity ? this.createActivity() : this.updateActivity();
  }

  createActivity() {
    this.props.createActivity(this.state.activity)
      .then(() => {
        this.props.history.push(`/tiltak/${this.getMeasureId()}`);
      })
      .catch(_ => {
        toastr.error('Kunne ikke opprette aktivitet');
      });
  }

  updateActivity() {
    this.props.updateActivity(this.state.activity)
      .then(_ => {
        toastr.success('Aktiviteten ble oppdatert');
      })
      .catch(_ => {
        toastr.error('Kunne ikke oppdatere aktivitet');
      });
  }


  getMdeInstance(instance) {
    const container = instance.element.nextSibling;
    container.setAttribute('tabIndex', '0');

    if (!this.state.editable) {
      instance.togglePreview()
      container.classList.add(formsStyle.mdePreview);
    }
  }


  render() {
    if (!this.state.dataFetched) {
      return '';
    }
    return this.state.activity ? (
      <React.Fragment>
        <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>Nummer</Form.Label>
          { this.state.editable
              ? (
                <div className={formsStyle.comboInput}>                  
                  <Form.Control type="number" min="0" name="no" value={this.state.activity.no} onChange={this.handleChange} />
                </div>
              )
              : (
                <div>{this.state.activity.no}</div>
              ) }
        </Form.Group>
        <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>Aktivitet </Form.Label>
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
        </Form.Group>

        <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>Beskrivelse </Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <SimpleMDE
                    value={this.state.activity.description || ''}
                    onChange={value => this.handleChange({ name: 'description', value })}
                    options={{ toolbar: ["bold", "italic", "link", "unordered-list", "|", "preview"] }}
                    getMdeInstance={this.getMdeInstance}

                  />
                </div>
              )
              : (
                <SimpleMDE
                  value={this.state.activity.description || ''}
                  options={{ toolbar: false, status: false }}
                  getMdeInstance={this.getMdeInstance} />
              )
          }
           </Form.Group>

          <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>Start </Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker name="implementationStart" placeholderText="Sett startdato" selected={this.state.activity.implementationStart ? new Date(this.state.activity.implementationStart) : null} onChange={(date) => this.handleChange({ name: 'implementationStart', value: date })} />
                </div>
              )
              : (
                <div><DayJS format="MMMM YYYY">{this.state.activity.implementationStart}</DayJS></div>
              )
          }
        </Form.Group>

        <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>Slutt </Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker name="implementationEnd" placeholderText="Sett sluttdato" selected={this.state.activity.implementationEnd ? new Date(this.state.activity.implementationEnd) : null} onChange={(date) => this.handleChange({ name: 'implementationEnd', value: date })} />
                </div>
              )
              : (
                <div><DayJS format="MMMM YYYY" locale="nb">{this.state.activity.implementationEnd}</DayJS></div>
              )
          }
          </Form.Group>
          <Form.Group controlId="formName" className={formsStyle.form}>
            <Form.Label>Status </Form.Label>
            {
              this.state.editable
                ? (
                  <div className={formsStyle.comboInput}>
                    <SelectDropdown
                      name="status"
                      value={this.state.activity.status || 1}
                      options={this.props.planStatuses}
                      onSelect={this.handleChange}
                      className={formsStyle.statusSelect}
                    />

                  </div>
                )
                : (
                  <span>{this.getActivityStatusLabel(this.props.planStatuses, this.state.activity)}</span>
                )
            }

          </Form.Group>
          <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>Deltakere </Form.Label>
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
        <div className={formsStyle.btngroup}>

          {this.state.editable ? (
            <div>
              <Button className="mr-2" variant="secondary" onClick={(event) => { this.setState({ editable: false }) }}>Avslutt redigering</Button>
              <Button variant="primary" onClick={this.saveActivity}>{this.props.newActivity ? 'Opprett' : 'Lagre'}</Button>
            </div>
          ) : (
              <div>
                <Button className="mr-2" variant="secondary" onClick={this.openModal} >Slett aktivitet</Button>
                <Button variant="primary" onClick={(event) => { this.setState({ editable: true }) }}>Rediger tiltak</Button>
              </div>
            )}
        </div>
        {<Modal
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
            <p>Er du sikker på at du vil slette {this.state.activity.name}?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>Avbryt</Button>
            <Button variant="danger" onClick={this.handleDelete}>Slett</Button>
          </Modal.Footer>
        </Modal>}
      </React.Fragment>
    ) : ''

  }
}

const mapStateToProps = state => ({
  selectedActivity: state.selectedActivity,
  organizations: state.organizations.map(organization => {
    return {
      organizationId: organization.id,
      name: organization.name
    };
  }),
  planStatuses: state.options.planStatuses
});

const mapDispatchToProps = {
  createActivity,
  updateActivity,
  fetchOrganizations,
  fetchOptions,
  deleteActivity
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ActivityDetails));
