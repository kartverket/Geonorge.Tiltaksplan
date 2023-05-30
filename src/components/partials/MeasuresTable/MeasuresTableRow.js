// Dependencies
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { translate } from "actions/ConfigActions";

// Stylesheets
import style from "components/partials/MeasuresTable/MeasuresTableRow.module.scss";


const MeasuresTableRow = (props) => {
    const dispatch = useDispatch();

    const getMeasureStatusLabel = (planStatuses, measure) => {
        return planStatuses?.length ? planStatuses.find((status) => measure.status === status.value)?.label : '';
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
                <Tooltip anchorId={`measure-no-${props.measure.id}`}/>
                <span id={`measure-no-${props.measure.id}`} data-tooltip-content="Unikt nummer på tiltaket">{props.measure.no}</span>
            </td>
            <td data-label={dispatch(translate("Measure"))} style={{ paddingRight: 20 }}>
                {props.measure.infoUrl ? 
                    <Fragment>
                        <Tooltip anchorId={`measure-name-${props.measure.id}`} />
                        <a id={`measure-name-${props.measure.id}`} href={props.measure.infoUrl} rel="noreferrer" data-tooltip-content="Overordnet beskrivelse av tiltaket">
                            {props.measure.name}
                        </a>  
                    </Fragment>: props.measure.name
                }
            </td>
            <td data-label="Status" style={{ paddingRight: 20 }}>
                <Tooltip anchorId={`measure-status-${props.measure.id}`} />
                <span id={`measure-status-${props.measure.id}`} data-tooltip-content="Viser fremdrift på tiltaket">
                    {getMeasureStatusLabel(props.planStatuses, props.measure)}
                </span>
            </td>
            <td data-label={dispatch(translate("Owner"))}>
                <Tooltip anchorId={`measure-owner-${props.measure.id}`} />
                <span id={`measure-owner-${props.measure.id}`} data-tooltip-content="Hovedansvarlig for gjennomføring av tiltaket">{props.measure.owner.name}</span>
            </td>
            <td data-label="Sist oppdatert aktivitet">
                <Tooltip anchorId={`measure-lastUpdated-${props.measure.id}`} />
                <span id={`measure-lastUpdated-${props.measure.id}`} data-tooltip-content="Sist oppdatert aktivitet/rapport">
                    {formatDate(
                        props.measure.lastUpdatedActivity > props.measure.lastUpdated
                            ? props.measure.lastUpdatedActivity
                            : props.measure.lastUpdated
                    )}
                </span>
            </td>
            <td data-label="Link til aktivitet" style={{ textAlign: "center", cursor: "pointer" }}>
                <Tooltip anchorId={`measure-link-${props.measure.id}`} />
                <Link to={`/tiltak/${props.measure.no}`} title={props.measure.name}>
                    <FontAwesomeIcon
                        id={`measure-link-${props.measure.id}`}
                        data-tooltip-content="Detaljert beskrivelse - aktiviteter"
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

export default MeasuresTableRow;
