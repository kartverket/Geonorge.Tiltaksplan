// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import style from 'components/partials/MeasuresTable/MeasuresTableRow.module.scss';
import { withRouter } from 'react-router-dom'   

class MeasuresTableRow extends Component {
   render() {
      const measure = this.props.measure;

      return (
         <tr onClick={this.goToMeasure.bind(this)}>
            <td>{measure.name}</td>
            <td>{measure.progress}</td>
            <td>{measure.volume}</td>
            <td>{measure.status}</td>
            <td>
               <span className={`${style.trafficLight} ${style['light-' + measure.trafficLight]}`}></span>
            </td>
            <td>{measure.results}</td>
            <td>{measure.comment}</td>
         </tr>
      )
   }

   goToMeasure() {
      this.props.history.push(`/tiltak/${this.props.measure.id}`);
   }
}

MeasuresTableRow.propTypes = {
   measure: PropTypes.object.isRequired
};

export default connect(null, null)(withRouter(MeasuresTableRow));
