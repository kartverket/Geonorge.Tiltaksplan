// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import style from 'components/partials/MeasuresTable/MeasuresTableRow.module.scss';
import StarIcon from 'gfx/icon-star.svg'
import { translate } from 'actions/ConfigActions';

class MeasuresTableRow extends Component {

   getMeasureStatusLabel(planStatuses, measure) {
      return planStatuses.find(status => measure.status === status.value).label;
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
      this.props.history.push(`/tiltak/${this.props.measure.no}`);
   }

   render() {
      const measure = this.props.measure;

      return (
         
                    
         <tr onClick={this.goToMeasure.bind(this)}>
            <td data-label="Nr">{measure.no}</td>
            <td data-label={this.props.translate('Measure')}>{measure.name}</td>
            <td data-label="Status">{this.getMeasureStatusLabel(this.props.planStatuses, measure)}</td>
            <td data-label={this.props.translate('Owner')}>{measure.owner.name}</td>
         </tr>
      )
   }
}

MeasuresTableRow.propTypes = {
   measure: PropTypes.object.isRequired
};
const mapDispatchToProps = {
  
   translate
};
export default connect(null, mapDispatchToProps)(withRouter(MeasuresTableRow));
