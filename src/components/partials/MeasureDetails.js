// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { toastr } from 'react-redux-toastr'

// Models
import { Measure } from 'models/measure';

// Actions
import { fetchOrganizations } from 'actions/OrganizationsActions';
import { createMeasure, updateMeasure } from 'actions/MeasuresActions';

// Stylesheets
import 'react-bootstrap-typeahead/css/Typeahead.css';


class AddMeasure extends Component {
   constructor(props) {
      super(props);

      this.state = {
         dataFetched: false,
         modalOpen: false,
         measure: props.newMeasure
            ? new Measure()
            : props.selectedMeasure,
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
      this.handleChange({
         name: 'owner',
         value: {
            id: data[0].id
         }
      });
   }


   handleChange(data) {
      const { name, value } = data.target ? data.target : data;
      const measure = this.state.measure;
      measure[name] = isNaN(value) ? value : parseInt(value);
      this.setState({ measure });
   }

   saveMeasure() {
      const measure = this.state.measure;

      this.props.newMeasure
         ? this.props.createMeasure(this.state.measure)
            .then(() => {
               this.closeModal();
               toastr.success('Et nytt tiltak ble lagt til');
            })
            .catch(_ => {
               toastr.error('Kunne ikke opprette tiltak');
            })
         : this.props.updateMeasure(measure)
            .then(() => {
               this.closeModal();
               toastr.success('Tiltaket ble oppdatert');
            })
            .catch(_ => {
               toastr.error('Kunne ikke oppdatere tiltak');
            });
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return this.state.measure ? (
         <React.Fragment>
            <Button variant="primary" onClick={this.openModal}>{this.props.newMeasure ? 'Opprett tiltak' : 'Rediger tiltak'}</Button>
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
                  <Form.Group controlId="formNo">
                     <Form.Label>Nummer</Form.Label>
                     <Form.Control type="number" name="no" value={this.state.measure.no} onChange={this.handleChange} />
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
                        placeholder="Legg til eier..."
                     />
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
   });
};

const mapDispatchToProps = {
   fetchOrganizations,
   createMeasure,
   updateMeasure
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMeasure);