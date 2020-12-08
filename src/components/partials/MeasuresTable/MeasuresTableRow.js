// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import style from 'components/partials/MeasuresTable/MeasuresTableRow.module.scss';
import StarIcon from 'gfx/icon-star.svg'

class MeasuresTableRow extends Component {

   getMeasureStatusLabel(planStatuses, measure) {
      return planStatuses && measure.status && planStatuses[measure.status] && planStatuses[measure.status].label ? planStatuses[measure.status].label : '';
   }

   renderStars(amount) {
      if (amount === 0) {
         return '';
      }

      return (
         <React.Fragment>
            {[...Array(amount).keys()].map(nr => <img key={`star-${nr}`} className={style.star} src={StarIcon} alt="Stjerne" />)}
         </React.Fragment>
      );
   }

   goToMeasure() {
      this.props.history.push(`/tiltak/${this.props.measure.id}`);
   }

   render() {
      const measure = this.props.measure;

      return (
         <tr onClick={this.goToMeasure.bind(this)}>
            <td>{measure.name}</td>
            <td>{this.getMeasureStatusLabel(this.props.planStatuses, measure)}</td>
            <td>{measure.owner.name}</td>
         </tr>
      )
   }
}

MeasuresTableRow.propTypes = {
   measure: PropTypes.object.isRequired
};

export default connect(null, null)(withRouter(MeasuresTableRow));
