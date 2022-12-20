// Dependencies
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import style from "components/partials/MeasuresTable/MeasuresTableRow.module.scss";
import { translate } from "actions/ConfigActions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MeasuresTableRow = (props) => {
    const dispatch = useDispatch();

    const getMeasureStatusLabel = (planStatuses, measure) => {
        return planStatuses.find((status) => measure.status === status.value).label;
    };

    const formatDate = (date) => {
        if (date !== null) {
            const dateArray = date.split("-");
            const day = dateArray[2].substring(0, 4).split("T");
            return day[0] + "." + dateArray[1] + "." + dateArray[0];
        }
    };
  

    return (
        <tr>
            <td data-label="Nr">
                <span data-tip="Unikt nummer på tiltaket">{props.measure.no}</span>
            </td>
            <td data-label={dispatch(translate("Measure"))} style={{ paddingRight: 20 }}>
            {props.measure.infoUrl ?  
                <a href={props.measure.infoUrl} target="_blank" rel="noreferrer" data-tip="Overordnet beskrivelse av tiltaket">

                    {props.measure.name}
                     <FontAwesomeIcon

                        data-tip="Detaljert beskrivelse - aktiviteter"                                              
                        icon="external-link-alt"
                        className={style.icon}
                        color="#3767c7"
                        tabIndex="-1"                        
                    /> 
                    
                </a>  : `${props.measure.name}` }
            </td>
            <td data-label="Status" style={{ paddingRight: 20 }}>
                <span data-tip="Viser fremdrift på tiltaket">
                    {getMeasureStatusLabel(props.planStatuses, props.measure)}
                </span>
            </td>
            <td data-label={dispatch(translate("Owner"))}>
                <span data-tip="Hovedansvarlig for gjennomføring av tiltaket">{props.measure.owner.name}</span>
            </td>
            <td data-label="Sist oppdatert aktivitet">
                <span data-tip="Sist oppdatert aktivitet/rapport">
                    {formatDate(
                        props.measure.lastUpdatedActivity > props.measure.lastUpdated
                            ? props.measure.lastUpdatedActivity
                            : props.measure.lastUpdated
                    )}
                </span>
            </td>
            <td data-label="Link til aktivitet" style={{ textAlign: "center", cursor: "pointer" }}>


                <Link to={`/tiltak/${props.measure.no}`} alt={props.measure.name}>
                    <FontAwesomeIcon
                        data-tip="Detaljert beskrivelse - aktiviteter"
                        className={style.icon}
                        icon="info-circle"
                        color="#3767c7"
                        tabIndex="-1"
                    />
                </Link>
            </td>
        </tr>
    );
};
/* From DEV-branch
      return (
         
                    
         <tr>
            <td data-label="Nr"><span data-tip="Unikt nummer på tiltaket">{measure.no}</span></td>
            <td data-label={this.props.translate('Measure')} style={{paddingRight : 20}}><a href={measure.infoUrl} data-tip="Overordnet beskrivelse av tiltaket">{measure.name}</a></td>
            <td data-label="Status" style={{paddingRight : 20}}><span data-tip="Viser fremdrift på tiltaket">{this.getMeasureStatusLabel(this.props.planStatuses, measure)}</span></td>
            <td data-label={this.props.translate('Owner')}><span data-tip="Hovedansvarlig for gjennomføring av tiltaket">{measure.owner.name}</span></td>
            <td data-label="Sist oppdatert aktivitet"><span data-tip="Sist oppdatert aktivitet/rapport">{this.formatDate(measure.lastUpdatedActivity > measure.lastUpdated ? measure.lastUpdatedActivity : measure.lastUpdated)}</span></td>
            <td data-label="Link til aktivitet" style={{textAlign: 'center', cursor: 'pointer'}}><FontAwesomeIcon data-tip="Detaljert beskrivelse - aktiviteter" className={style.icon} icon="info-circle" color="#007bff" onClick={this.goToMeasure.bind(this)}/></td>
         </tr>
      )
   */

export default MeasuresTableRow;
