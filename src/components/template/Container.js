// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';

// Stylesheets
import style from 'components/template/Container.module.scss';

class ContentContainer extends Component {

  render() {
    return (<div className={style.container}>
      {this.props.children}
    </div>)
  }
}

export default connect(null, null)(ContentContainer);
