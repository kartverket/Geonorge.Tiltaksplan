// Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// Stylesheets


class MeasuresListElement extends Component {

  render() {
    const measure = this.props.measure;
    console.log('fisk' + measure)
    return this.props.measure
      ? (<div>
        {measure.name}
        {measure.progress}
        {measure.volume}
        {measure.status}
        {measure.trafficLight}
        {measure.results}
        {measure.comment}
      </div>)
      : '';
  }
}

MeasuresListElement.propTypes = {
  measure: PropTypes.object.isRequired
};

export default connect(null, null)(MeasuresListElement);
