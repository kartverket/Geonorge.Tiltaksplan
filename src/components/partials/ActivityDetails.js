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
import { withRouter, Redirect } from 'react-router-dom';

// Components
import { SelectDropdown } from 'components/custom-elements';
import { translate } from 'actions/ConfigActions';
import ValidationErrors from 'components/partials/ValidationErrors';

// Models
import { Activity } from 'models/activity';

// Actions
import { createActivity, updateActivity, deleteActivity } from 'actions/ActivityActions';
import { fetchOrganizations } from 'actions/OrganizationsActions';
import { fetchOptions } from 'actions/OptionsActions';

// Helpers
import { canDeleteActivity, canEditActivity } from 'helpers/authorizationHelpers';

// Stylesheets
import formsStyle from 'components/partials/forms.module.scss';


const editableMdeOptions = {
  toolbar: ["bold", "italic", "link", "unordered-list", "|", "preview"],
  spellChecker: false
};

const readOnlyMdeOptions = {
  toolbar: false,
  status: false,
  spellChecker: false,
  readOnly: true
};

registerLocale('nb', nb)

class ActivityDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity: this.props.newActivity
        ? new Activity({ measureId: this.props.selectedMeasure.id })
        : props.selectedActivity,
      editable: (this.props.location.state && this.props.location.state.editable) || this.props.newActivity ? true : false,
      dataFetched: false,
      modalOpen: false,
      validationErrors: [],
      redirect: null
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
    const activity = this.state.activity;
    const { name, value } = data.target ? data.target : data;
    let newValue;

    if (value instanceof Date) {
      newValue = this.formatDate(value);
    } else {
      const parsed = parseInt(value);
      newValue = isNaN(parsed) ? value : parsed;
    }

    activity[name] = newValue;

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

    let allStatus = {value:0, label: "Alle"};
    if(!this.statusExists(0, planStatuses))
       planStatuses.unshift(allStatus);

    return planStatuses && activity.status && planStatuses[activity.status] &&
      planStatuses[activity.status].label ? planStatuses[activity.status].label : '';
  }

  statusExists(status, arr) {
    return arr.some(function(el) {
      return el.value === status;
    }); 
  }

  formatDate(date) {

    const diff = 120 // max diff norway
    var newDateObj = new Date(date.getTime() + diff * 60000);
    return newDateObj;

  }

  handleDelete() {
    this.props.deleteActivity(this.state.activity, this.props.user)
      .then(() => {
        this.props.history.push(`/tiltak/${this.getMeasureNumber()}`);
      });
  }

  getMeasureNumber() {
    return this.props.match && this.props.match.params && this.props.match.params.measureNumber
      ? parseInt(this.props.match.params.measureNumber)
      : null;
  }

  saveActivity() {
    this.props.newActivity ? this.createActivity() : this.updateActivity();
  }

  createActivity() {
    this.props.createActivity(this.state.activity, this.props.user)
      .then(_ => {
        this.setState({ validationErrors: [] });
        this.props.history.push(`/tiltak/${this.getMeasureNumber()}`);
      })
      .catch(({ response }) => {
        toastr.error('Kunne ikke opprette aktivitet');
        this.setState({ validationErrors: response.data });
        window.scroll(0, 0);
      });
  }

  updateActivity() {
    this.props.updateActivity(this.state.activity, this.props.user)
      .then(_ => {
        this.setState({ validationErrors: [] });
        toastr.success('Aktiviteten ble oppdatert');
      })
      .catch(({ response }) => {
        toastr.error('Kunne ikke oppdatere aktivitet');
        this.setState({ validationErrors: response.data });
        window.scroll(0, 0);
      });
  }

  getMdeInstance(instance) {
    const container = instance?.element?.nextSibling;
    container.setAttribute('tabIndex', '0');

    if (!this.state.editable) {
      const editableElement = container.getElementsByClassName('CodeMirror-scroll')?.[0]
      editableElement.style.display = 'none';
      instance.togglePreview();
      instance.codemirror.options.readOnly = true;
      container.classList.add(formsStyle.mdePreview);
    }
  }

  getParticipants() {
    if (this.state.activity && this.state.activity.participants) {
      return this.state.activity.participants.map((participant, index) => <div key={`participant-${index}`}>{participant.name}</div>)
    }
    return '';
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    if (!this.state.dataFetched) {
      return '';
    }

    return this.state.activity ? (
      <React.Fragment>
        <ValidationErrors errors={this.state.validationErrors} />

        <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>{this.props.translate('labelNumber')}</Form.Label>
          {this.state.editable
            ? (
              <div className={formsStyle.comboInput}>
                <Form.Control type="number" min="0" name="no" value={this.state.activity.no} onChange={this.handleChange} />
              </div>
            )
            : (
              <div>{this.state.activity.no}</div>
            )}
        </Form.Group>
        <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>{this.props.translate('Activity')} </Form.Label>
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
          <Form.Label>{this.props.translate('Description')}  </Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput} style={{ display: 'block' }}>
                  <SimpleMDE
                    value={this.state.activity?.description || ''}
                    onChange={value => this.handleChange({ name: 'description', value })}
                    options={editableMdeOptions}
                    getMdeInstance={this.getMdeInstance}
                  />
                </div>
              )
              : (
                <SimpleMDE
                  value={this.state.activity?.description || ''}
                  options={readOnlyMdeOptions}
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
                  <DatePicker dateFormat="dd.MM.yyyy" locale="nb" name="implementationStart" placeholderText="Sett startdato" selected={this.state.activity.implementationStart ? new Date(this.state.activity.implementationStart) : null} onChange={(date) => this.handleChange({ name: 'implementationStart', value: date })} />
                </div>
              )
              : (
                <div><DayJS format="MMMM YYYY">{this.state.activity.implementationStart}</DayJS></div>
              )
          }
        </Form.Group>

        <Form.Group controlId="formName" className={formsStyle.form}>
          <Form.Label>{this.props.translate('End')}  </Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker dateFormat="dd.MM.yyyy" locale="nb" name="implementationEnd" placeholderText="Sett sluttdato" selected={this.state.activity.implementationEnd ? new Date(this.state.activity.implementationEnd) : null} onChange={(date) => this.handleChange({ name: 'implementationEnd', value: date })} />
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
          <Form.Label>{this.props.translate('Participants')}  </Form.Label>
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
                <div>{this.getParticipants()}</div>
              )
          }
        </Form.Group>
        <div className={formsStyle.btngroup}>
          {this.state.editable ? (
            <div>
              {
                this.props.newActivity
                  ? (
                    <React.Fragment>
                      <Button className="mr-2" variant="secondary" onClick={(event) => { this.setState({ redirect: `/tiltak/${this.props.selectedMeasure.no}/` }) }}>Avbryt oppretting</Button>
                      <Button variant="primary" onClick={this.saveActivity}>Opprett</Button>
                    </React.Fragment>
                  )
                  : (
                    <React.Fragment>
                      <Button className="mr-2" variant="secondary" onClick={(event) => { this.setState({ editable: false }) }}>Avslutt redigering</Button>
                      <Button variant="primary" onClick={this.saveActivity}>Lagre</Button>
                    </React.Fragment>
                  )
              }
            </div>
          ) : (
            <div>
              {
                canDeleteActivity(this.props.authInfo, this.props.selectedActivity.responsibleAgency)
                  ? <Button className="mr-2" variant="secondary" onClick={this.openModal} >Slett aktivitet</Button>
                  : ''
              }
              {
                canEditActivity(this.props.authInfo, this.props.selectedActivity.responsibleAgency)
                  ? <Button variant="primary" onClick={(event) => { this.setState({ editable: true }) }}>Rediger aktivitet</Button>
                  : ''
              }
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
            <Button variant="secondary" onClick={this.closeModal}>{this.props.translate('btnCancel')} </Button>
            <Button variant="danger" onClick={this.handleDelete}>{this.props.translate('btnDelete')} </Button>
          </Modal.Footer>
        </Modal>}
      </React.Fragment>
    ) : ''
  }
}

const mapStateToProps = state => ({
  selectedMeasure: state.measures.selectedMeasure,
  selectedActivity: state.activities.selectedActivity,
  organizations: state.organizations.map(organization => {
    return {
      organizationId: organization.id,
      name: organization.name
    };
  }),
  planStatuses: state.options.planStatuses,
  user: state.oidc.user,
  authInfo: state.authInfo
});

const mapDispatchToProps = {
  createActivity,
  updateActivity,
  fetchOrganizations,
  fetchOptions,
  deleteActivity,
  translate
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ActivityDetails));
