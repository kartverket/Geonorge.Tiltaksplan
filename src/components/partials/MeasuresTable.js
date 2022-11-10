// Dependencies
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { GnTable } from '@kartverket/geonorge-web-components/GnTable';

// Components
import MeasuresTableRow from 'components/partials/MeasuresTable/MeasuresTableRow';
import { SelectDropdown } from 'components/custom-elements';
import Form from 'react-bootstrap/Form';

// Actions
import { fetchMeasures } from 'actions/MeasuresActions';
import { fetchOptions } from 'actions/OptionsActions';
import { translate } from 'actions/ConfigActions';

// Stylesheets
import style from 'components/partials/MeasuresTable.module.scss';
import formsStyle from 'components/partials/forms.module.scss';


const MeasuresTable = (props) => {
   const dispatch = useDispatch();


const [dataFetched, setDataFetched] = useState(false);
const [statusSelected, setStatusSelected] = useState(0);
const [statuses, setStatuses] = useState();
const [measures, setMesaures] = useState()
const [sort, setSort] = useState({column: null, direction: 'desc'});
const [measuresAll, setMesauresAll] = useState();


// Redux store
const planStatuses = useSelector((state) => state.options.planStatuses);


  const handleChange = (data) => {

      let statusMeasures = measuresAll;
      let status = data.value;

      if(status !== 0)
      {
      statusMeasures = statusMeasures.filter(function (el) {
         return el.status === status ;
       });
      }

      setStatusSelected(status);
      setMesaures(statusMeasures);      
    }
   
   
   const getMeasureStatusLabel = (planStatuses, measure) => {
      return planStatuses.find(status => measure.status === status.value).label;
   }

   const statusExists = (status, arr) => {
      return arr.some(function(el) {
        return el.value === status;
      }); 
    }


    useEffect(() => {
      Promise.all([
         dispatch(fetchMeasures()),
         dispatch(fetchOptions())
      ])
      .then(() => {
         setDataFetched(true);
         setMesaures(props.measures);
         setMesauresAll(props.measures);
         setStatuses(planStatuses)
                  
         let newPlanStatuses =statuses;         
         let allStatus = {value:0, label: "Alle"};
         if(!statusExists(0, newPlanStatuses))
         newPlanStatuses.unshift(allStatus);
         setStatuses(newPlanStatuses);         
      },[]);
   })

   const setArrow = (column) => {
      let className = 'sort-direction';
      
      if (sort.column === column) {
        className += sort.direction === 'asc' ? ` ${style.asc}` : ` ${style.desc}`;
      }
      
      return className;
      };

   const onSort = column => {
      return e => {
          const direction = sort.column ? (sort.direction === 'asc' ? 'desc' : 'asc') : 'asc'
          const sortedMeasures = measures.sort((a, b) => {
              if (column === 'owner') {
                  const nameA = a.owner.name;
                  const nameB = b.owner.name;
  
                  if (nameA < nameB)
                      return -1
                  if (nameA < nameB)
                      return 1
                  else return 0
              }
              else if (column === 'status') {

               const nameA = getMeasureStatusLabel(planStatuses, a)
               const nameB = getMeasureStatusLabel(planStatuses, b)

               var preferredOrder = ['Oppstartsfase', 'Utredningsfase','Gjennomføringsfase', 'Avsluttende fase', 'Avsluttet','Inngår i annet tiltak','Utgår'];
                  return preferredOrder.indexOf(nameA) - preferredOrder.indexOf(nameB);
               }
               else if (column === 'name') {

                  const nameA = a.name
                  const nameB = b.name
   
                  if (nameA < nameB)
                      return -1
                  if (nameA < nameB)
                      return 1
                  else return 0
               }
               else if (column === 'lastupdated') {

                  const nameA = a.lastUpdatedActivity
                  const nameB = b.lastUpdatedActivity

                  return new Date(nameA) - new Date(nameB)
               }
               else if (column === 'no') {

                  const nameA = a.no
                  const nameB = b.no
   
                  if (nameA < nameB)
                        return -1
                  if (nameA < nameB)
                        return 1
                  else return 0
               }
              else {
                  return a.first - b.first
              }
          })

          if (direction === 'desc') {
            sortedMeasures.reverse()
          }          
          setMesaures(sortedMeasures);
          setSort({column, direction});          
      }
  }

  
   if (!dataFetched) {
      return '';
   }

      return (
         <React.Fragment>

            <p>{dispatch(translate('MeasureActivitiesDescription'))}</p>
            <div>Status </div>
            <div className={formsStyle.comboInput}>
                  <SelectDropdown
                    name="status"
                    value={statusSelected}
                    options={statuses}
                    onSelect={handleChange}
                    className={formsStyle.statusSelect}
                  />

            </div>
            <ReactTooltip />
            <gn-table hoverable>
            <table>
               <thead>
                  <tr>
                     <th style={{cursor : 'pointer'}} onClick={onSort('no')}><span data-tip="Unikt nummer på tiltaket">Nr</span><span className={setArrow('no')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={onSort('name')}><span data-tip="Overordnet beskrivelse av tiltaket">{dispatch(translate('Measure'))}</span><span className={setArrow('name')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={onSort('status')}><span data-tip="Viser fremdrift på tiltaket">Status</span><span className={setArrow('status')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={onSort('owner')}><span data-tip="Hovedansvarlig for gjennomføring av tiltaket">{dispatch(translate('Owner'))}</span><span className={setArrow('owner')}></span></th>
                     <th style={{cursor : 'pointer'}} onClick={onSort('lastupdated')}><span data-tip="Sist oppdatert aktivitet/rapport">Sist&nbsp;oppdatert</span><span className={setArrow('lastupdated')}></span></th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  {measures.map(measure => <MeasuresTableRow key={measure.id} measure={measure} planStatuses={planStatuses} />)}
               </tbody>
            </table>
            </gn-table>
         </React.Fragment>
      );
   }



export default MeasuresTable;
