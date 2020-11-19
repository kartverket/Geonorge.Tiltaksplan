import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchOptions } from 'actions/OptionsActions';
import { updateMeasure } from 'actions/MeasuresActions';
import { SelectDropdown } from '../custom-elements';
import { Remarkable } from 'remarkable';
import SimpleMDE from "react-simplemde-editor";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import style from 'components/partials/EditMeasure.module.scss'
import "easymde/dist/easymde.min.css";

class EditMeasure extends Component {
   constructor(props) {
      super(props);

      this.state = {
         dataFetched: false,
         measure: props.initialMeasure
      };

      this.handleChange = this.handleChange.bind(this);
      this.save = this.save.bind(this);
      this.markdown = new Remarkable();
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

   save() {
      const measure = { ...this.props.initialMeasure, ...this.state.measure }

      this.props.updateMeasure(measure)
         .catch(_ => {
            throw new Error("Could not save measure");
         });
   }

   getMdeInstance(instance) {
      const container = instance.element.nextSibling
      container.setAttribute('tabIndex', '0');
   }

   render() {
      if (!this.state.dataFetched) {
         return '';
      }

      return (
         <React.Fragment>
            <div className="form-container">
               <Form.Group controlId="formProgress">
                  <Form.Label>Fremdrift</Form.Label>
                  <SimpleMDE
                     value={this.state.measure.progress || ''}
                     onChange={value => this.handleChange({ name: 'progress', value })}
                     options={{ toolbar: ["bold", "italic", "link", "unordered-list", "|", "preview"] }}
                     getMdeInstance={this.getMdeInstance}
                  />
               </Form.Group>

               <Form.Group controlId="formVolume">
                  <Form.Label>Volum</Form.Label>
                  <SelectDropdown
                     name="volume"
                     value={this.state.measure.volume || 0}
                     options={this.props.measureVolume}
                     onSelect={this.handleChange}
                     className={style.defaultSelect}
                  />
               </Form.Group>

               <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <SelectDropdown
                     name="status"
                     value={this.state.measure.status || 1}
                     options={this.props.planStatuses}
                     onSelect={this.handleChange}
                     className={style.statusSelect}
                  />
               </Form.Group>

               <Form.Group controlId="formTrafficLight">
                  <Form.Label>Trafikklys</Form.Label>
                  <SelectDropdown
                     name="trafficLight"
                     value={this.state.measure.trafficLight || 1}
                     options={this.props.trafficLights}
                     onSelect={this.handleChange}
                     className={style.trafficLightSelect}
                  />
               </Form.Group>

               <Form.Group controlId="formResults">
                  <Form.Label>Konkrete resultater</Form.Label>
                  <SelectDropdown
                     name="results"
                     value={this.state.measure.results || 1}
                     options={this.props.measureResults}
                     onSelect={this.handleChange}
                     className={style.defaultSelect}
                  />
               </Form.Group>

               <Form.Group controlId="formComments">
                  <Form.Label>Kommentar</Form.Label>
                  <Form.Control as="textarea" name="comment" value={this.state.measure.comment || ''} onChange={this.handleChange} rows={3} />
               </Form.Group>
            </div>

            <Button variant="primary" onClick={this.save}>Lagre</Button>
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => ({
   initialMeasure: state.measure,
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
