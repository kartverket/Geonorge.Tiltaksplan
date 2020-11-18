// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { fetchOrganizations } from 'actions/OrganizationsActions';
import { createMeasure } from 'actions/MeasuresActions';
import MeasuresTable from 'components/partials/MeasuresTable';
import Container from 'components/template/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class Measures extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataFetched: false,
      modalOpen: false,
      singleSelections: [],
      model: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOwnerSelect = this.handleOwnerSelect.bind(this);
    this.addMeasure = this.addMeasure.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    this.props.fetchOrganizations()
      .then(() => {
        this.setState({ dataFetched: true });
      });
  }

  addMeasure() {
    this.props.history.push(`/tiltak/nytt`);
  }

  openModal() {
    this.setState({
      modalOpen: true,
      model: {
        name: '',
        owner: {
          id: 0,
          name: ''
        }
      }
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
    const model = this.state.model;
    model[name] = value;

    this.setState({ model }, () => console.log(this.state.model));
  }

  save() {
    this.props.createMeasure(this.state.model)
      .catch(error => {
        throw new Error(error);
      });
  }

  render() {
    if (!this.state.dataFetched) {
      return '';
    }

    return (
      <Container>
        <h1>Tiltaksplaner</h1>

        <Button variant="primary" onClick={this.openModal}>Legg til tiltak</Button>

        <MeasuresTable />

        <Modal
          show={this.state.modalOpen}
          onHide={this.closeModal}
          backdrop="static"
          centered
          keyboard={false}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Nytt tiltak</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="formName">
              <Form.Label>Navn</Form.Label>
              <Form.Control type="text" name="name" value={this.state.model.name} onChange={this.handleChange} />
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
            <Button variant="primary" onClick={this.save}>Lagre</Button>
          </Modal.Footer>
        </Modal>

      </Container>
    )
  }
}

const mapStateToProps = state => {
  return ({
    organizations: state.organizations,
  });
};

const mapDispatchToProps = {
  fetchOrganizations,
  createMeasure
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Measures));
