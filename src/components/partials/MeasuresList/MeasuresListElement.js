// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Stylesheets
import style from 'components/partials/MeasuresList/MeasuresListElement.module.scss';


class MeasuresListElement extends Component {

  renderTrafficClassName(measure) {
    switch(measure) {
      case 1:
      return 'greencolor';
      case 2:
      return 'yellowcolor';
      case 3:
        return 'redcolor';
      default:
      return '';
    }
  }

  render() {
    
    const measure = this.props.measure;
    console.log(this.renderTrafficClassName(measure.trafficLight))
    return this.props.measure
    
      ? (<div className={style.row}>
        <div>{measure.name}</div>
        <div>{measure.progress}</div>
        <div>{measure.volume}</div>
        <div>{measure.status}</div>
        <div className={`${style.trafficlight} ${style[this.renderTrafficClassName(measure.trafficLight)]}`}> {measure.trafficLight}</div>
        <div>{measure.results}</div>
        <div>{measure.comment}</div>
      </div>)
      : '';
      
  }
}

MeasuresListElement.propTypes = {
  measure: PropTypes.object.isRequired
};

export default connect(null, null)(MeasuresListElement);
