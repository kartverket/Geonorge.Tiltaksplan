// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import SimpleMDE from "react-simplemde-editor";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { fetchOrganizations } from 'actions/OrganizationsActions';
import { withRouter } from 'react-router-dom';
// Components
import { SelectDropdown } from 'components/custom-elements';
import { Typeahead } from 'react-bootstrap-typeahead';

// Actions
import { fetchOptions } from 'actions/OptionsActions';
import { updateMeasure, deleteMeasure } from 'actions/MeasuresActions';

// Assets
import StarIcon from 'gfx/icon-star.svg'

// Stylesheets
import formsStyle from 'components/partials/forms.module.scss'
import 'easymde/dist/easymde.min.css';

class EditMeasure extends Component {
   constructor(props) {
      super(props);

      this.handleEditableChange = this.handleEditableChange.bind(this);
      this.getMdeInstance = this.getMdeInstance.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleOwnerSelect = this.handleOwnerSelect.bind(this);
      this.saveMeasure = this.saveMeasure.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);

      this.state = {
         dataFetched: false,
         measure: props.selectedMeasure,
         editable: false,
         selectedOwner: [
            props.selectedMeasure.owner
         ]
      };
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
      const measure = this.state.measure;
      console.log(value);
      measure[name] = isNaN(value) ? value : parseInt(value);

      this.setState({ measure });
   }
   openModal() {
      this.setState({ modalOpen: true });
   }
   closeModal() {
      this.setState({ modalOpen: false });
   }
   handleDelete() {            
      this.props.deleteMeasure(this.state.measure)
        .then(() => {
          this.props.history.push(`/`);
        });    
   }
  
   saveMeasure() {
      const measure = this.state.measure;
      if(this.state.selectedOwner.length) {
         measure.owner.id = this.state.selectedOwner[0].id
      }      
      this.props.updateMeasure(measure)
         .then(() => {
            toastr.success('Tiltaket ble oppdatert');
         })
         .catch(_ => {
            toastr.error('Kunne ikke oppdatere tiltak');
         });
   }


   getMeasureStatusLabel(planStatuses, measure) {
      return planStatuses && measure.status && planStatuses[measure.status] && planStatuses[measure.status].label ? planStatuses[measure.status].label : '';
   }

   getMdeInstance(instance) {
      const container = instance.element.nextSibling;
      container.setAttribute('tabIndex', '0');
      if (!this.state.editable) {
         instance.togglePreview()
         container.classList.add(formsStyle.mdePreview);
      }
   }

   handleMdeBlur(instance, event) {
      console.log("blur");
   }

   handleMdeFocus(isntance, event) {
      console.log("focus");
   }

   handleEditableChange(event) {
      const editable = event.target.checked;
      this.setState({ editable });
   }

   renderStars(amount) {
      return [...Array(amount).keys()].map(nr => <img key={`star-${nr}`} className={formsStyle.star} src={StarIcon} alt="Stjerne" />)
   }
   handleOwnerSelect(data) { 
      this.setState({
         selectedOwner : data
      })           
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return (
         <React.Fragment>
            <div className={`${formsStyle.form} form-container`}>
            {
                     this.state.editable
                        ? (<Form.Group controlId="formNo">
                              <Form.Label>Nummer  </Form.Label>
                                 <div className={`${formsStyle.comboInput} ${formsStyle.fullWidth}`}>
                                    <Form.Control type="number" min="0" name="no" value={this.state.measure.no} onChange={this.handleChange} />
                                 </div>
                              </Form.Group> 
                           )
                        : ''
                  }
            
                  {
                     this.state.editable
                        ? (<Form.Group controlId="formName">
                              <Form.Label>Navn  </Form.Label>
                                 <div className={`${formsStyle.comboInput} ${formsStyle.fullWidth}`}>
                                    <Form.Control type="text" name="name" value={this.state.measure.name} onChange={this.handleChange} />
                                 </div>
                              </Form.Group> 
                           )
                        : ''
                  }
                  <Form.Group controlId="formOwner">
                        <Form.Label>Eier</Form.Label>
                  {

                        this.state.editable
                        ? ( 
                        <Typeahead
                           id="basic-typeahead-single"
                           labelKey="name"
                           onChange={this.handleOwnerSelect}
                           options={this.props.organizations}
                           placeholder="Legg til eier..."
                           selected={this.state.selectedOwner}
                        />
                    
                      ) : (
                         <div>
                            {this.state.measure.owner.name}
                         </div>
                      )
              
                      } </Form.Group>

               <Form.Group controlId="formProgress">
                  <Form.Label>Fremdrift </Form.Label>
                  {
                     this.state.editable
                        ? (
                           <div className={`${formsStyle.comboInput} ${formsStyle.fullWidth}`}>
                              <SimpleMDE
                                 value={this.state.measure.progress || ''}
                                 onChange={value => this.handleChange({ name: 'progress', value })}
                                 options={{ toolbar: ["bold", "italic", "link", "unordered-list", "|", "preview"] }}
                                 getMdeInstance={this.getMdeInstance}
                                 events={{
                                    'blur': this.handleMdeBlur,
                                    'focus': (event) => this.handleMdeFocus(event)
                                 }}
                              />

                           </div>
                        )
                        : (
                           <SimpleMDE
                              value={this.state.measure.progress || ''}
                              options={{ toolbar: false, status: false }}
                              getMdeInstance={this.getMdeInstance} />
                        )
                  }

               </Form.Group>
               <div className={`${this.state.editable ? '' : `${formsStyle.flex}`}`}>
                  <Form.Group controlId="formVolume">
                     <Form.Label>Volum </Form.Label>
                     {
                        this.state.editable
                           ? (
                              <div className={formsStyle.comboInput}>
                                 <SelectDropdown
                                    name="volume"
                                    value={this.state.measure.volume || 0}
                                    options={this.props.measureVolume}
                                    onSelect={this.handleChange}
                                    className={formsStyle.defaultSelect}
                                 />

                              </div>
                           )
                           : (
                              <span>{this.renderStars(this.state.measure.volume || 0)}</span>
                           )
                     }

                  </Form.Group>

                  <Form.Group controlId="formStatus">
                     <Form.Label>Status </Form.Label>
                     {
                        this.state.editable
                           ? (
                              <div className={formsStyle.comboInput}>
                                 <SelectDropdown
                                    name="status"
                                    value={this.state.measure.status || 1}
                                    options={this.props.planStatuses}
                                    onSelect={this.handleChange}
                                    className={formsStyle.statusSelect}
                                 />

                              </div>
                           )
                           : (
                              <span>{this.getMeasureStatusLabel(this.props.planStatuses, this.state.measure)}</span>
                           )
                     }

                  </Form.Group>

                  <Form.Group controlId="formTrafficLight">
                     <Form.Label>Trafikklys </Form.Label>
                     {
                        this.state.editable
                           ? (
                              <div className={formsStyle.comboInput}>
                                 <SelectDropdown
                                    name="trafficLight"
                                    value={this.state.measure.trafficLight || 1}
                                    options={this.props.trafficLights}
                                    onSelect={this.handleChange}
                                    className={formsStyle.trafficLightSelect}
                                 />

                              </div>
                           )
                           : (
                              <span className={`${formsStyle.trafficLight} ${formsStyle['light-' + this.state.measure.trafficLight]}`}></span>
                           )
                     }
                  </Form.Group>

                  <Form.Group controlId="formResults">
                     <Form.Label>Konkrete resultater</Form.Label>
                     {
                        this.state.editable
                           ? (
                              <div className={formsStyle.comboInput}>
                                 <SelectDropdown
                                    name="results"
                                    value={this.state.measure.results || 1}
                                    options={this.props.measureResults}
                                    onSelect={this.handleChange}
                                    className={formsStyle.defaultSelect}
                                 />

                              </div>
                           )
                           : (
                              <span>{this.renderStars(this.state.measure.results || 0)}</span>
                           )
                     }
                  </Form.Group>
               </div>
               <Form.Group controlId="formComments">
                  <Form.Label>Kommentar  </Form.Label>
                  {
                     this.state.editable
                        ? (
                           <div className={`${formsStyle.comboInput} ${formsStyle.fullWidth}`}>
                              <Form.Control as="textarea" name="comment" value={this.state.measure.comment || ''} onChange={this.handleChange} rows={3} />
                           </div>
                        )
                        : (
                           <span>{this.state.measure.comment}</span>
                        )
                  }
               </Form.Group>
            </div>
                  {this.state.editable ? (
                     <div>
                        <Button className="mr-2" variant="secondary" onClick={(event) => { this.setState({ editable: false }) }}>Avslutt redigering</Button>
                        <Button variant="primary" onClick={this.saveMeasure}>Lagre</Button>
                     </div>
                  ) : (
                     <div>
                    <Button className="mr-2" variant="secondary" onClick={this.openModal} >Slett tiltaket</Button>
                        <Button variant="primary" onClick={(event) => { this.setState({ editable: true }) }}>Rediger tiltak</Button>
                     </div>
                  )}
            
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
               <p>Er du sikker på at du vil slette {this.state.measure.name}?</p>
                {this.state.measure.activities.length > 0 ? 'Du kan ikke slette da det er aktiviteter knyttet til tiltaket' + this.state.measure.name : ''}
            </Modal.Body>

            <Modal.Footer>
               <Button variant="secondary" onClick={this.closeModal}>Avbryt</Button>
               <Button disabled={this.state.measure.activities.length > 0} variant="danger" onClick={this.handleDelete}>Slett</Button>
            </Modal.Footer>
         </Modal>}

          
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => ({
   selectedMeasure: state.selectedMeasure,
   measureVolume: state.options.measureVolume,
   measureResults: state.options.measureResults,
   trafficLights: state.options.trafficLights,
   planStatuses: state.options.planStatuses,
   organizations: state.organizations
});

const mapDispatchToProps = {
   fetchOptions,
   updateMeasure,
   fetchOrganizations,
   deleteMeasure
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditMeasure));
