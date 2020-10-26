// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';


// Template
import Container from 'components/template/Container';


class Actions extends Component {
  render() {
    return (<Container>    
        <h1>potet</h1>
    </Container>)
  }
}

export default connect(null, null)(Actions);
