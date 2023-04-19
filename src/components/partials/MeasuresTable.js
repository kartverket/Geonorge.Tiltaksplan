// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
// eslint-disable-next-line no-unused-vars
import { GnTable, GnSelect } from "@kartverket/geonorge-web-components/GnTable";

// Components
import MeasuresTableRow from "components/partials/MeasuresTable/MeasuresTableRow";

// Actions
import { fetchOptions } from "actions/OptionsActions";
import { translate } from "actions/ConfigActions";

// Stylesheets
import style from "components/partials/MeasuresTable.module.scss";
import "react-tooltip/dist/react-tooltip.css";

const MeasuresTable = (props) => {
    const dispatch = useDispatch();

    const [dataFetched, setDataFetched] = useState(false);
    const [statusSelected, setStatusSelected] = useState(0);
    const [statuses, setStatuses] = useState();
    const [sortedMeasures, setSortedMesaures] = useState(props.measures);
    const [sort, setSort] = useState({ column: null, direction: "desc" });

    // Redux store
    const planStatuses = useSelector((state) => state.options.planStatuses);

    const handleChange = (statusValueString) => {
        const statusValue = parseInt(statusValueString);
        setStatusSelected(statusValue);
    };

    const getMeasureStatusLabel = (planStatuses, measure) => {
        return planStatuses?.length ? planStatuses.find((status) => measure.status === status.value)?.label : "";
    };

    const statusExists = (status, arr) => {
        return arr?.length
            ? arr.some(function (el) {
                  return el.value === status;
              })
            : null;
    };

    const setArrow = (column) => {
        let className = "sort-direction";
        if (sort.column === column) {
            className += sort.direction === "asc" ? ` ${style.asc}` : ` ${style.desc}`;
        }
        return className;
    };

    const onSort = (column) => {
        return (e) => {
            const direction = sort.column ? (sort.direction === "asc" ? "desc" : "asc") : "asc";
            const sortedMeasures = props.measures.sort((a, b) => {
                if (column === "owner") {
                    const nameA = a.owner.name;
                    const nameB = b.owner.name;

                    if (nameA < nameB) return -1;
                    if (nameA < nameB) return 1;
                    else return 0;
                } else if (column === "status") {
                    const nameA = getMeasureStatusLabel(planStatuses, a);
                    const nameB = getMeasureStatusLabel(planStatuses, b);

                    var preferredOrder = [
                        "Oppstartsfase",
                        "Utredningsfase",
                        "Gjennomføringsfase",
                        "Avsluttende fase",
                        "Avsluttet",
                        "Inngår i annet tiltak",
                        "Utgår"
                    ];
                    return preferredOrder.indexOf(nameA) - preferredOrder.indexOf(nameB);
                } else if (column === "name") {
                    const nameA = a.name;
                    const nameB = b.name;

                    if (nameA < nameB) return -1;
                    if (nameA < nameB) return 1;
                    else return 0;
                } else if (column === "lastupdated") {
                    const nameA = a.lastUpdatedActivity;
                    const nameB = b.lastUpdatedActivity;

                    return new Date(nameA) - new Date(nameB);
                } else if (column === "no") {
                    const nameA = a.no;
                    const nameB = b.no;

                    if (nameA < nameB) return -1;
                    if (nameA < nameB) return 1;
                    else return 0;
                } else {
                    return a.first - b.first;
                }
            });

            if (direction === "desc") {
                sortedMeasures.reverse();
            }
            setSortedMesaures(sortedMeasures);
            setSort({ column, direction });
        };
    };

    useEffect(() => {
        if (!dataFetched) {
            dispatch(fetchOptions()).then(() => {
                setDataFetched(true);
                let newPlanStatuses = planStatuses;
                let allStatus = { value: 0, label: "Alle aktive" };
                if (!statusExists(0, newPlanStatuses) && !!newPlanStatuses?.length) newPlanStatuses.unshift(allStatus);
                setStatuses(newPlanStatuses);
            });
        }
    }, [dataFetched, dispatch, planStatuses]);
    
    useEffect(() => {
        setSortedMesaures(props.measures);
    }, [props.measures]);

    return (
        <React.Fragment>
            <p>{dispatch(translate("MeasureActivitiesDescription"))}</p>
            <div>Status </div>
            <gn-select>
                <select onChange={(event) => handleChange(event.target.value)}>
                    {statuses?.length
                        ? statuses.map((status) => {
                              return (
                                  <option key={status.value} value={status.value}>
                                      {status.label}
                                  </option>
                              );
                          })
                        : ""}
                </select>
            </gn-select>
            <gn-table hoverable>
                <table>
                    <caption>Liste over handlingsplanens tiltak </caption>
                    <thead>
                        <tr>
                            <th style={{ cursor: "pointer" }} onClick={onSort("no")}>
                                <Tooltip anchorId="measure-no-title" />
                                <span id="measure-no-title" data-tooltip-content="Unikt nummer på tiltaket">
                                    Nr
                                </span>
                                <span className={setArrow("no")}></span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={onSort("name")}>
                                <Tooltip anchorId="measure-name-title" />
                                <span id="measure-name-title" data-tooltip-content="Overordnet beskrivelse av tiltaket">
                                    {dispatch(translate("Measure"))}
                                </span>
                                <span className={setArrow("name")}></span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={onSort("status")}>
                                <Tooltip anchorId="measure-status-title" />
                                <span id="measure-status-title" data-tooltip-content="Viser fremdrift på tiltaket">
                                    Status
                                </span>
                                <span className={setArrow("status")}></span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={onSort("owner")}>
                                <Tooltip anchorId="measure-owner-title" />
                                <span
                                    id="measure-owner-title"
                                    data-tooltip-content="Hovedansvarlig for gjennomføring av tiltaket"
                                >
                                    {dispatch(translate("Owner"))}
                                </span>
                                <span className={setArrow("owner")}></span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={onSort("lastupdated")}>
                                <Tooltip anchorId="measure-lastUpated-title" />
                                <span
                                    id="measure-lastUpated-title"
                                    data-tooltip-content="Sist oppdatert aktivitet/rapport"
                                >
                                    Sist&nbsp;oppdatert
                                </span>
                                <span className={setArrow("lastupdated")}></span>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!!sortedMeasures?.length &&
                            sortedMeasures
                                .filter((measure) => {
                                    if (statusSelected !== 0) {
                                        return measure.status === statusSelected;
                                    } else return (measure.status != 5 && measure.status != 7) ;
                                })
                                .map((measure) => {
                                    return (
                                        <MeasuresTableRow
                                            key={measure.id}
                                            measure={measure}
                                            planStatuses={planStatuses}
                                        />
                                    );
                                })}
                    </tbody>
                </table>
            </gn-table>
        </React.Fragment>
    );
};

export default MeasuresTable;
