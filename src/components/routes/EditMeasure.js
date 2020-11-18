// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { fetchMeasure, createMeasure } from 'actions/MeasuresActions';
import { fetchOptions } from 'actions/OptionsActions';
import Container from 'components/template/Container';
import { SelectDropdown } from '../custom-elements';
import { Remarkable } from 'remarkable';
import SimpleMDE from "react-simplemde-editor";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import style from 'components/routes/EditMeasure.module.scss'
import "easymde/dist/easymde.min.css";

class EditMeasure extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataFetched: false,
      model: this.getModel()
    };

    this.abort = this.abort.bind(this);
    this.save = this.save.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.markdown = new Remarkable();
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    await this.props.fetchOptions()
    const measureId = this.getMeasureId();

    if (measureId) {
      await this.props.fetchMeasure(measureId);
    }

    this.setState({ dataFetched: true });
  }

  getMeasureId() {
    return this.props.match && this.props.match.params && this.props.match.params.measureId
      ? this.props.match.params.measureId
      : null;
  }

  getModel(data = {}) {
    return {
      id: data.id || 0,
      name: data.name || '',
      progress: data.progress || '',
      volume: data.volume || 0,
      status: data.status || 1,
      trafficLight: data.trafficLight || 1,
      comment: data.comment || '',
      results: data.results || ''
    }
  }

  getMdeInstance(instance) {
    const container = instance.element.nextSibling
    container.setAttribute('tabIndex', '0');
  }

  handleChange(data) {
    const { name, value } = data.target ? data.target : data;
    const model = this.state.model;
    model[name] = value;

    this.setState({ model }, () => console.log(this.state.model));
  }

  async save() {
    try {
      await this.props.createMeasure(this.state.model)
    } catch (error) {
      throw new Error("Could not save measure");
    }
  }

  abort() {
    this.props.history.goBack();
  }

  render() {
    if (!this.state.dataFetched) {
      return '';
    }

    return (
      <Container>
        <h1>{this.getMeasureId() ? 'Rediger tiltak' : 'Nytt tiltak'}</h1>

        <Button variant="light" onClick={this.abort}>Avbryt</Button>

        <div className="form-container">
          <Form.Group controlId="formName">
            <Form.Label>Navn</Form.Label>
            <Form.Control type="text" name="name" value={this.state.model.name} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formProgress">
            <Form.Label>Fremdrift</Form.Label>
            <SimpleMDE
              getMdeInstance={this.getMdeInstance}
              onChange={value => this.handleChange({ name: 'progress', value })}
              options={{ toolbar: ["bold", "italic", "heading-1", "heading-2", "heading-3", "link", "unordered-list", "|", "preview"] }}
            />
          </Form.Group>

          <Form.Group controlId="formVolume">
            <Form.Label>Volum</Form.Label>
            <SelectDropdown
              name="volume"
              value={this.state.model.volume}
              options={this.props.measureVolume}
              onSelect={this.handleChange}
              className={style.volumeSelect}
            />
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <SelectDropdown
              name="status"
              value={this.state.model.status}
              options={this.props.planStatuses}
              onSelect={this.handleChange}
              className={style.statusSelect}
            />
          </Form.Group>

          <Form.Group controlId="formTrafficLight">
            <Form.Label>Trafikklys</Form.Label>
            <SelectDropdown
              name="trafficLight"
              value={this.state.model.trafficLight}
              options={this.props.trafficLights}
              onSelect={this.handleChange}
              className={style.trafficLightSelect}
            />
          </Form.Group>

          <Form.Group controlId="formResults">
            <Form.Label>Konkrete resultater</Form.Label>
            <Form.Control as="textarea" name="results" value={this.state.model.results} onChange={this.handleChange} rows={3} />
          </Form.Group>

          <Form.Group controlId="formComments">
            <Form.Label>Kommentar</Form.Label>
            <Form.Control as="textarea" name="comment" value={this.state.model.comment} onChange={this.handleChange} rows={3} />
          </Form.Group>
        </div>

        <Button variant="primary" onClick={this.save}>Lagre</Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return ({
    measure: state.measure,
    measureVolume: state.options.measureVolume,
    trafficLights: state.options.trafficLights,
    planStatuses: state.options.planStatuses
  });
};

const mapDispatchToProps = {
  fetchMeasure,
  fetchOptions,
  createMeasure
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditMeasure));
