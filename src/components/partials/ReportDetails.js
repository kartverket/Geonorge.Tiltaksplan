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
import { translate } from 'actions/ConfigActions';


// Actions
import { fetchOptions } from 'actions/OptionsActions';
import { updateMeasure } from 'actions/MeasuresActions';

// Helpers
import { canEditMeasure, canEditReport } from 'helpers/authorizationHelpers';

// Assets
import StarIcon from 'gfx/icon-star.svg'

// Stylesheets
import formsStyle from 'components/partials/forms.module.scss'
import 'easymde/dist/easymde.min.css';

class EditMeasure extends Component {
   constructor(props) {
      super(props);

      this.handleEditableReportChange = this.handleEditableReportChange.bind(this);
      this.getMdeInstance = this.getMdeInstance.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleOwnerSelect = this.handleOwnerSelect.bind(this);
      this.saveMeasure = this.saveMeasure.bind(this);

      this.state = {
         dataFetched: false,
         measure: props.selectedMeasure,
         editableReport: false,
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
      let newValue;
      if (value instanceof Date) {
         newValue = value.toISOString();
      } else if (!isNaN(value)) {
         newValue = parseInt(value);
      } else {
         newValue = value;
      }
      measure[name] = newValue;

      this.setState({ measure });
   }


   

   saveMeasure() {
      const measure = this.state.measure;

      if (this.state.selectedOwner.length) {
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

      return planStatuses.find(status => measure.status === status.value).label;
   }

   getMdeInstance(instance) {
      const container = instance.element.nextSibling;
      container.setAttribute('tabIndex', '0');
      if (!this.state.editableReport) {
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

   handleEditableReportChange(event) {
      const editableReport = event.target.checked;
      this.setState({ editableReport });
   }

   renderStars(amount) {
      return [...Array(amount).keys()].map(nr => <img key={`star-${nr}`} className={formsStyle.star} src={StarIcon} alt="Stjerne" />)
   }

   handleOwnerSelect(data) {
      this.setState({
         selectedOwner: data
      })
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return (
         <React.Fragment>
            
            <div className={`${formsStyle.form} form-container`}>
               <div className={formsStyle.block}>
                  <Form.Group controlId="formProgress">
                     {
                        this.state.editableReport
                           ? (<React.Fragment>
                              <Form.Label>{this.props.translate('statusProgress')} </Form.Label>
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
                           </React.Fragment>
                           )
                           : (
                              <SimpleMDE
                                 value={this.state.measure.progress || ''}
                                 options={{ toolbar: false, status: false }}
                                 getMdeInstance={this.getMdeInstance} />
                           )
                     }

                  </Form.Group>
                  <div className={`${this.state.editableReport ? '' : `${formsStyle.flex}`}`}>
                     <Form.Group controlId="formVolume">
                        <Form.Label>{this.props.translate('Volume')} </Form.Label>
                        {
                           this.state.editableReport
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
                           this.state.editableReport
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
                        <Form.Label>{this.props.translate('TrafficLight')} </Form.Label>
                        {
                           this.state.editableReport
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
                        <Form.Label>{this.props.translate('Results')}</Form.Label>
                        {
                           this.state.editableReport
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
                     <Form.Label>{this.props.translate('Commment')}  </Form.Label>
                     {
                        this.state.editableReport
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
            </div>
            {
               this.state.editableReport
                  ? (
                     <div>
                        {
                           canEditReport(this.props.authInfo)
                              ? (
                                 <React.Fragment>
                                    <Button className="mr-2" variant="secondary" onClick={(event) => { this.setState({ editableReport: false }) }}>Avslutt redigering</Button>
                                    <Button variant="primary" onClick={this.saveMeasure}>{this.props.translate('btnSave')}</Button>
                                 </React.Fragment>
                              )
                              : ''
                        }
                     </div>
                  ) : (
                     <div>
                        
                        {
                           canEditMeasure(this.props.authInfo)
                              ? <Button variant="primary" onClick={(event) => { this.setState({ editableReport: true }) }}>{this.props.translate('btnEditReport')}</Button>
                              : ''
                        }
                     </div>
                  )

            }
            {<Modal
               show={this.state.deleteMeasureModalOpen}
               onHide={this.closeDeleteMeasureModal}
               keyboard={false}
               animation={false}
               centered
               backdrop="static"
               aria-labelledby="form-dialog-title">
               <Modal.Header closeButton>
                  <Modal.Title>{this.props.translate('btnDelete')}</Modal.Title>
               </Modal.Header>

               <Modal.Body>
                  <p>Er du sikker på at du vil slette {this.state.measure.name}?</p>
                  {this.state.measure.activities.length > 0 ? 'Du kan ikke slette da det er aktiviteter knyttet til tiltaket' + this.state.measure.name : ''}
               </Modal.Body>

               <Modal.Footer>
                  <Button variant="secondary" onClick={this.closeDeleteMeasureModal}>Avbryt</Button>
                  <Button disabled={this.state.measure.activities.length > 0} variant="danger" onClick={this.handleDelete}>Slett</Button>
               </Modal.Footer>
            </Modal>}


         </React.Fragment>
      );
   }
}

const mapStateToProps = state => ({
   selectedMeasure: state.measures.selectedMeasure,
   measureVolume: state.options.measureVolume,
   measureResults: state.options.measureResults,
   trafficLights: state.options.trafficLights,
   planStatuses: state.options.planStatuses,
   organizations: state.organizations,
   authInfo: state.authInfo
});

const mapDispatchToProps = {
   fetchOptions,
   updateMeasure,
   fetchOrganizations,
   translate
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditMeasure));
