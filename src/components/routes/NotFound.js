// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';

// Template
import Container from 'components/template/Container';

class NotFound extends Component {

  render() {
    return (<Container>
      <h1>404</h1>
      <p>Siden finnes ikke</p>
    </Container>)
  }
}

export default connect(null, null)(NotFound);
