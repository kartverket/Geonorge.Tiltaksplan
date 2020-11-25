import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createActivity } from 'actions/ActivityActions';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Activity} from 'models/activity';
import DatePicker from "react-datepicker";


class AddActivity extends Component {
    constructor(props) {
        super(props);
  
        this.state = { activity: new Activity({measureId: this.props.measureId}) };
        this.saveActivity = this.saveActivity.bind(this);
        this.handleChange = this.handleChange.bind(this);
     }

     handleChange(data) {
        const { name, value } = data.target ? data.target : data;
        const activity = this.state.activity;
        activity[name] = value;
  
        this.setState({ activity });
     }

     saveActivity() {
        this.props.createActivity(this.state.activity);
     }

    render() { 
        return this.state.activity ? (
            
            <Container>
                <Form.Group controlId="formName">
                    <Form.Label>Aktivitet</Form.Label>
                    <Form.Control type="text" name="name" value={this.state.activity.name} onChange={this.handleChange} />
                    <Form.Label>Tittel</Form.Label>
                    <Form.Control type="text" name="title" value={this.state.activity.title} onChange={this.handleChange}/>
                    
                    <Form.Label>Start</Form.Label>
                    <DatePicker placeholderText="Sett startdato" selected={this.state.activity.implementationStart} onChange={this.handleChange} />
                    <Form.Label>Slutt</Form.Label>
                    <DatePicker placeholderText="Sett sluttdato" selected={this.state.activity.implementationEnd} onChange={this.handleChange} />
                    <Form.Label>Deltakere</Form.Label>
                    <Form.Control type="text" name="participants" value={this.state.activity.participants} onChange={this.handleChange}/>
                </Form.Group>
                    <Button variant="secondary" onClick={this.closeModal}>Avbryt</Button>
                    <Button variant="primary" onClick={this.saveActivity}>Lagre</Button>
            </Container>
        ) : ''
       
    }
}

const mapDispatchToProps = {
    createActivity
 };

export default connect(null, mapDispatchToProps)(AddActivity);
