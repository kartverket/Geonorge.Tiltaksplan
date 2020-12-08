// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import SimpleMDE from "react-simplemde-editor";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import { SelectDropdown } from 'components/custom-elements';

// Actions
import { fetchOptions } from 'actions/OptionsActions';
import { updateMeasure } from 'actions/MeasuresActions';

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
      this.saveMeasure = this.saveMeasure.bind(this);

      this.state = {
         dataFetched: false,
         measure: props.selectedMeasure,
         editable: false
      };
   }

   componentDidMount() {
      this.props.fetchOptions()
         .then(() => {
            this.setState({ dataFetched: true });
         });
   }

   handleChange(data) {
      const { name, value } = data.target ? data.target : data;
      const measure = this.state.measure;
      measure[name] = value;

      this.setState({ measure });
   }

   saveMeasure() {
      const measure = this.state.measure;

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

   handleMdeBlur(instance, event){
      console.log("blur");
   }

   handleMdeFocus(isntance, event){
      console.log("focus");
   }

   handleEditableChange(event) {
      const editable = event.target.checked;
      this.setState({ editable });
   }

   renderStars(amount) {
      return [...Array(amount).keys()].map(nr => <img key={`star-${nr}`} className={formsStyle.star} src={StarIcon} alt="Stjerne" />)
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return (
         <React.Fragment>
            <div>
               <label>
                  <input type="checkbox" checked={this.state.editable} onChange={(event) => { this.setState({ editable: event.target.checked }) }} />
                Aktiver redigering for debugging
            </label>
            </div>
            <div className={`${formsStyle.form} form-container`}>

               <Form.Group controlId="formProgress">
                  <Form.Label>Fremdrift <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
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

               <Form.Group controlId="formVolume">
                  <Form.Label>Volum <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
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
                  <Form.Label>Status <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
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
                  <Form.Label>Trafikklys <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
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
                  <Form.Label>Konkrete resultater<span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
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

               <Form.Group controlId="formComments">
                  <Form.Label>Kommentar <span className={`${ this.state.editable ? formsStyle.visibl : formsStyle.hiddn}`}> <FontAwesomeIcon icon="edit" className={formsStyle.editIcon} /></span></Form.Label>
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

            <Button variant="primary" onClick={this.saveMeasure}>Lagre tiltak</Button>

         </React.Fragment>
      );
   }
}

const mapStateToProps = state => ({
   selectedMeasure: state.selectedMeasure,
   measureVolume: state.options.measureVolume,
   measureResults: state.options.measureResults,
   trafficLights: state.options.trafficLights,
   planStatuses: state.options.planStatuses
});

const mapDispatchToProps = {
   fetchOptions,
   updateMeasure
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMeasure);
