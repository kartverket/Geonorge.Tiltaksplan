import React, { Component } from 'react';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import AddActivity from 'components/partials/AddActivity';
import Container from 'components/template/Container';

class NewActivity extends Component {
    constructor(props) {
        super(props);
  
        this.state = {
           dataFetched: false
        };
     }

     getMeasureId() {
        return this.props.match && this.props.match.params && this.props.match.params.measureId
           ? this.props.match.params.measureId
           : null;
     }

    render() {
        return (
           <Container>
               <AddActivity measureId={this.getMeasureId()} />
           </Container>
        )
        
    }

} 


export default connect(null, null)(NewActivity);