// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { toastr } from 'react-redux-toastr';
import ValidationErrors from 'components/partials/ValidationErrors';

// Models
import { Measure } from 'models/measure';

// Actions
import { fetchOrganizations } from 'actions/OrganizationsActions';
import { createMeasure, updateMeasure } from 'actions/MeasuresActions';

// Helpers
import { canAddMeasure, canEditMeasure } from 'helpers/authorizationHelpers';

// Stylesheets
import 'react-bootstrap-typeahead/css/Typeahead.css';


class MeasureDetails extends Component {
   constructor(props) {
      super(props);

      this.state = {
         dataFetched: false,
         modalOpen: false,
         measure: props.newMeasure
            ? new Measure()
            : props.selectedMeasure,
         selectedOwner: props.newMeasure
            ? []
            : [
               props.selectedMeasure.owner
            ],
         validationErrors: []
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleOwnerSelect = this.handleOwnerSelect.bind(this);
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.saveMeasure = this.saveMeasure.bind(this);
   }

   componentDidMount() {
      this.props.fetchOrganizations()
         .then(() => {
            this.setState({ dataFetched: true });
         });
   }

   openModal() {
      this.setState({
         modalOpen: true
      });
   }

   closeModal() {
      this.setState({ modalOpen: false });
   }

   handleOwnerSelect(data) {
      this.setState({
         selectedOwner: data
      })
   }

   handleChange(data) {
      const measure = this.state.measure;
      const { name, value } = data.target ? data.target : data;   
      const parsed = parseInt(value);

      measure[name] = isNaN(parsed) ? value : parsed;

      this.setState({ measure });
   }

   saveMeasure() {
      const measure = this.state.measure;

      if (this.state.selectedOwner.length) {
         measure.owner.id = this.state.selectedOwner[0].id
      }

      this.props.newMeasure
         ? this.props.createMeasure(measure, this.props.user)
            .then(() => {
               this.closeModal();
               this.setState({ validationErrors: [] });
               toastr.success('Et nytt tiltak ble lagt til');
            })
            .catch(({ response }) => {   
               toastr.error('Kunne ikke opprette tiltak');            
               this.setState({ validationErrors: response.data });
            })            
         : this.props.updateMeasure(measure, this.props.user)
            .then(() => {
               this.closeModal();
               this.setState({ validationErrors: [] });
               toastr.success('Tiltaket ble oppdatert');
            })
            .catch(({ response }) => {
               toastr.error('Kunne ikke oppdatere tiltak');
               this.setState({ validationErrors: response.data });
            });
   }

   showAddMeasureContent(){
      return this.state.measure && this.props.newMeasure && canAddMeasure(this.props.authInfo);
   }

   showEditMeasureContent() {
      return this.state.measure && !this.props.newMeasure && canEditMeasure(this.props.authInfo);
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return this.showAddMeasureContent() || this.showEditMeasureContent() ? (
         <React.Fragment>
            <Button variant="primary" className="marginB-20" onClick={this.openModal}>{this.props.newMeasure ? 'Opprett tiltak' : 'Rediger tiltak'}</Button>
            <Modal
               show={this.state.modalOpen}
               onHide={this.closeModal}
               backdrop="static"
               centered
               keyboard={false}
               animation={false}
            >
               <Modal.Header closeButton>
                  <Modal.Title>{this.props.newMeasure ? 'Nytt tiltak' : `${this.state.measure.no} - ${this.state.measure.name}`}</Modal.Title>
               </Modal.Header>

               <Modal.Body>
                  <ValidationErrors errors={this.state.validationErrors} />

                  <Form.Group controlId="formNo">
                     <Form.Label>Nummer</Form.Label>
                     <Form.Control type="number" name="no" value={this.state.measure.no} onChange={this.handleChange} onBlur={this.checkForAvailability} />
                  </Form.Group>

                  <Form.Group controlId="formName">
                     <Form.Label>Navn</Form.Label>
                     <Form.Control type="text" name="name" value={this.state.measure.name} onChange={this.handleChange} />
                  </Form.Group>

                  <Form.Group controlId="formName">
                     <Form.Label>Eier</Form.Label>
                     <Typeahead
                        id="basic-typeahead-single"
                        labelKey="name"
                        onChange={this.handleOwnerSelect}
                        options={this.props.organizations}
                        selected={this.state.selectedOwner}
                        placeholder="Legg til eier..."
                     />
                  </Form.Group>
                  <Form.Group controlId="formInfoUrl">
                     <Form.Label>Url</Form.Label>
                     <Form.Control type="text" name="infoUrl" value={this.state.measure.infoUrl} onChange={this.handleChange} placeholder="http://www.name.org" />
                  </Form.Group>
               </Modal.Body>

               <Modal.Footer>
                  <Button variant="secondary" onClick={this.closeModal}>Avbryt</Button>
                  <Button variant="primary" onClick={this.saveMeasure}>Lagre</Button>
               </Modal.Footer>
            </Modal>
         </React.Fragment>
      ) : '';
   }
}

const mapStateToProps = state => {
   return ({
      organizations: state.organizations,
      user: state.oidc.user,
      authInfo: state.authInfo,
   });
};

const mapDispatchToProps = {
   fetchOrganizations,
   createMeasure,
   updateMeasure
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasureDetails);