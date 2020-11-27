// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import nb  from 'date-fns/locale/nb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DayJS from 'react-dayjs'; 
import { fetchOrganizations } from 'actions/OrganizationsActions';
import { Typeahead } from 'react-bootstrap-typeahead';


// Actions
import { updateActivity } from 'actions/ActivityActions';

// Stylesheets
import formsStyle from 'components/partials/forms.module.scss';
import style from 'components/partials/EditActivity.module.scss';
import 'easymde/dist/easymde.min.css';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('nb', nb)

class EditActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: props.selectedActivity,
      editable: true,
      dataFetched: false
    };   
    this.handleChange = this.handleChange.bind(this);
    this.handleOwnerSelect = this.handleOwnerSelect.bind(this);
    this.saveActivity = this.saveActivity.bind(this);
  }
  componentDidMount() {
    this.props.fetchOrganizations()
       .then(() => {
          this.setState({ dataFetched: true });
       });
 }
 
 handleOwnerSelect(data) {       
    this.handleChange({   
      name: 'participants',
      value: data      
   }) 
 
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
  getParticitants(participants) {

    return participants && participants.length ? participants.map((participant, index) => {

       return (
          participant.name + (participants.length - index > 1 ? ', ' : ' ')
       )
    }) : null;
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
          <Form.Label>Aktivitet <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
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

          <Form.Label>Tittel <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
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

          <Form.Label>Start <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker name="implementationStart" placeholderText="Sett startdato" selected={new Date(this.state.activity.implementationStart)} onChange={this.handleChange} />
                </div>
              )
              : (
                <div><DayJS format="MMMM YYYY">{this.state.activity.implementationStart}</DayJS></div>
              )
          }

          <Form.Label>Slutt <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
          {
            this.state.editable
              ? (
                <div className={formsStyle.comboInput}>
                  <DatePicker name="implementationEnd" placeholderText="Sett sluttdato" selected={new Date(this.state.activity.implementationEnd)} onChange={this.handleChange} />
                </div>
              )
              : (
                <div><DayJS format="MMMM YYYY" locale="nb">{this.state.activity.implementationEnd}</DayJS></div>
              )
          }

          <Form.Label>Deltakere <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
          {
            this.state.editable
              ? (                
                     <Typeahead    
                        allowNew     
                        multiple                
                        id="basic-typeahead-multiple"
                        labelKey="name"                         
                        onChange={this.handleOwnerSelect}
                        options={this.props.organizations}
                        placeholder="Legg til deltakere..."
                        newSelectionPrefix="Legg til "
                     />                 
              )
              : (
                <div></div>
              )
          }
          <div>{this.getParticitants(this.state.activity.participants)}</div>
        </Form.Group>
        <div className={style.btngroup}>
        <Button variant="secondary" onClick={this.closeModal}>Avbryt</Button>
        <Button variant="primary" onClick={this.saveActivity}>Lagre</Button>
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
  updateActivity,
  fetchOrganizations
};

export default connect(mapStateToProps, mapDispatchToProps)(EditActivity);
