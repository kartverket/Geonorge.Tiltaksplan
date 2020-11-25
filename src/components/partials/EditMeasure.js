import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchOptions } from 'actions/OptionsActions';
import { updateMeasure } from 'actions/MeasuresActions';
import { SelectDropdown } from '../custom-elements';
import { toastr } from 'react-redux-toastr'
import SimpleMDE from "react-simplemde-editor";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StarIcon from 'gfx/icon-star.svg'



import style from 'components/partials/EditMeasure.module.scss'
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
      const measure = { ...this.props.initialMeasure, ...this.state.measure };

      this.props.updateMeasure(measure)
         .then(() => {
            toastr.success('Tiltaket ble oppdatert');
         })
         .catch(_ => {
            toastr.error('Kunne ikke oppdatere tiltak');
         });
   }

   getMdeInstance(instance) {
      const container = instance.element.nextSibling;
      container.setAttribute('tabIndex', '0');
      console.log(instance);
      if (!this.state.editable) {
         instance.togglePreview()
         container.classList.add(style.mdePreview);
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
      return [...Array(amount).keys()].map(nr => <img key={`star-${nr}`} className={style.star} src={StarIcon} alt="Stjerne" />)
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
            <div className={`${style.form} form-container`}>

               <Form.Group controlId="formProgress">
                  <Form.Label>Fremdrift</Form.Label>
                  {
                     this.state.editable
                        ? (
                           <div className={style.comboInput}>
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
                              <FontAwesomeIcon icon="edit" className={style.editIcon} />
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
                  <Form.Label>Volum</Form.Label>
                  {
                     this.state.editable
                        ? (
                           <div className={style.comboInput}>
                              <SelectDropdown
                                 name="volume"
                                 value={this.state.measure.volume || 0}
                                 options={this.props.measureVolume}
                                 onSelect={this.handleChange}
                                 className={style.defaultSelect}
                              />
                              <FontAwesomeIcon icon="edit" className={style.editIcon} />
                           </div>
                        )
                        : (
                           <span>{this.renderStars(this.state.measure.volume || 0)}</span>
                        )
                  }

               </Form.Group>

               <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  {
                     this.state.editable
                        ? (
                           <div className={style.comboInput}>
                              <SelectDropdown
                                 name="status"
                                 value={this.state.measure.status || 1}
                                 options={this.props.planStatuses}
                                 onSelect={this.handleChange}
                                 className={style.statusSelect}
                              />
                              <FontAwesomeIcon icon="edit" className={style.editIcon} />
                           </div>
                        )
                        : (
                        <span>{this.props.planStatuses[this.state.measure.status].label}</span>
                        )
                  }

               </Form.Group>

               <Form.Group controlId="formTrafficLight">
                  <Form.Label>Trafikklys</Form.Label>
                  {
                     this.state.editable
                        ? (
                           <div className={style.comboInput}>
                              <SelectDropdown
                                 name="trafficLight"
                                 value={this.state.measure.trafficLight || 1}
                                 options={this.props.trafficLights}
                                 onSelect={this.handleChange}
                                 className={style.trafficLightSelect}
                              />
                              <FontAwesomeIcon icon="edit" className={style.editIcon} />
                           </div>
                        )
                        : (
                           <span className={`${style.trafficLight} ${style['light-' + this.state.measure.trafficLight]}`}></span>
                        )
                  }
               </Form.Group>

               <Form.Group controlId="formResults">
                  <Form.Label>Konkrete resultater</Form.Label>
                  {
                     this.state.editable
                        ? (
                           <div className={style.comboInput}>
                              <SelectDropdown
                                 name="results"
                                 value={this.state.measure.results || 1}
                                 options={this.props.measureResults}
                                 onSelect={this.handleChange}
                                 className={style.defaultSelect}
                              />
                              <FontAwesomeIcon icon="edit" className={style.editIcon} />
                           </div>
                        )
                        : (
                           <span>{this.renderStars(this.state.measure.results || 0)}</span>
                        )
                  }
               </Form.Group>

               <Form.Group controlId="formComments">
                  <Form.Label>Kommentar</Form.Label>
                  {
                     this.state.editable
                        ? (
                           <div className={style.comboInput}>
                              <Form.Control as="textarea" name="comment" value={this.state.measure.comment || ''} onChange={this.handleChange} rows={3} />
                              <FontAwesomeIcon icon="edit" className={style.editIcon} />
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
