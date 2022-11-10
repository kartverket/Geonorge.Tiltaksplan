// Dependencies
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import style from 'components/partials/MeasuresTable/MeasuresTableRow.module.scss';
import { translate } from 'actions/ConfigActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const MeasuresTableRow = (props) => {
   
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const getMeasureStatusLabel = (planStatuses, measure) => {
      return planStatuses.find(status => measure.status === status.value).label;
   }


   const goToMeasure = () => {
      navigate(`/tiltak/${this.props.measure.no}`);
   }


   const formatDate =  (date) => {
      if (date !== null) {
      const dateArray = date.split("-");
      const day = dateArray[2].substring(0, 4).split("T");
          return day[0] + "." + dateArray[1] + "." + dateArray[0];
      }
  }
    
      return (                             
         <tr>
            <td data-label="Nr"><span data-tip="Unikt nummer på tiltaket">{props.measure.no}</span></td>
            <td data-label={dispatch(translate('Measure'))} style={{paddingRight : 20}}><a href={props.measure.infoUrl} target="_blank" data-tip="Overordnet beskrivelse av tiltaket">{props.measure.name}</a></td>
            <td data-label="Status" style={{paddingRight : 20}}><span data-tip="Viser fremdrift på tiltaket">{getMeasureStatusLabel(this.props.planStatuses, props.measure)}</span></td>
            <td data-label={dispatch(translate('Owner'))}><span data-tip="Hovedansvarlig for gjennomføring av tiltaket">{props.measure.owner.name}</span></td>
            <td data-label="Sist oppdatert aktivitet"><span data-tip="Sist oppdatert aktivitet/rapport">{formatDate(props.measure.lastUpdatedActivity > props.measure.lastUpdated ? props.measure.lastUpdatedActivity : props.measure.lastUpdated)}</span></td>
            <td data-label="Link til aktivitet" style={{textAlign: 'center', cursor: 'pointer'}}><FontAwesomeIcon data-tip="Detaljert beskrivelse - aktiviteter" className={style.icon} icon="info-circle" color="#007bff" onClick={goToMeasure.bind(this)}/></td>
         </tr>
      )
   }


export default MeasuresTableRow;
