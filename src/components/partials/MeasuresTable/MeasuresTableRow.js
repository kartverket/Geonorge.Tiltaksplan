// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import style from 'components/partials/MeasuresTable/MeasuresTableRow.module.scss';
import StarIcon from 'gfx/icon-star.svg'
import { translate } from 'actions/ConfigActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignRight } from '@fortawesome/free-solid-svg-icons';

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


   formatDate (date) {
      if (date !== null) {
      const dateArray = date.split("-");
      const day = dateArray[2].substring(0, 4).split("T");
          return day[0] + "." + dateArray[1] + "." + dateArray[0];
      }
  }

   render() {
      const measure = this.props.measure;

      return (
         
                    
         <tr>
            <td data-label="Nr">{measure.no}</td>
            <td data-label={this.props.translate('Measure')}><a href={measure.infoUrl} target="_blank">{measure.name}</a></td>
            <td data-label="Status">{this.getMeasureStatusLabel(this.props.planStatuses, measure)}</td>
            <td data-label={this.props.translate('Owner')}>{measure.owner.name}</td>
            <td data-label="Sist oppdatert aktivitet">{this.formatDate(measure.lastUpdatedActivity)}</td>
            <td data-label="Link til aktivitet" style={{textAlign: 'center', cursor: 'pointer'}}><FontAwesomeIcon className={style.icon} icon="info-circle" color="#007bff" onClick={this.goToMeasure.bind(this)}/></td>
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
