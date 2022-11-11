// Dependencies
import React from 'react';
import { useDispatch } from 'react-redux';
import DayJS from 'react-dayjs';
import { useNavigate, useParams } from 'react-router-dom'
import showdown from 'showdown';
import { translate } from 'actions/ConfigActions';

// Stylesheets
import style from 'components/partials/ActivityTable/ActivityTableRow.module.scss';

const ActivityTableRow = (props) => {

   const dispatch = useDispatch();
   const navigate = useNavigate();


   // Params
   const { measureNumber } = useParams();


   const converter = new showdown.Converter();


   const markdownToHtml = (value) => {
      return {
         __html: converter.makeHtml(value)
      };
   }

   const getStatustext = (status) => {
      const foundStatus = props.planStatuses
         .find(planStatus => planStatus.value === status);
      return foundStatus ? foundStatus.label : '';
   }

   const getParticitants = (participants) => {
      return participants && participants.length ? participants.map((participant, index) => {
         return (
            participant.name + (participants.length - index > 1 ? ', ' : ' ')
         )
      }) : null;
   }

   const goToActivity = () => {
      navigate(`/tiltak/${measureNumber}/aktivitet/${props.activity?.no}`);
   }

   const renderActivity = () => {
      const statusStyle = { width: `${props.activity.status * 20}%` }
      return (<React.Fragment>
         <td data-label="Nr">{props.activity?.no}</td>
         <td data-label={dispatch(translate('Name'))}>{props.activity.name}</td>
         <td data-label={dispatch(translate('Description'))} className={style.htmlCell} dangerouslySetInnerHTML={markdownToHtml(props.activity.description)}></td>
         <td data-label={dispatch(translate('Participants'))}>{getParticitants(props.activity.participants)}</td>
         <td data-label="Status"><div className={style.statusbar}><div className={style.block} style={statusStyle}></div></div>{getStatustext(props.activity.status)}</td>
         <td data-label={dispatch(translate('Start'))}><DayJS format="DD.MM.YYYY">{props.activity.implementationStart}</DayJS></td>
         <td data-label={dispatch(translate('End'))}><DayJS format="DD.MM.YYYY">{props.activity.implementationEnd}</DayJS></td>
      </React.Fragment>)
   }

   return (
      <React.Fragment>
         <tr onClick={() => goToActivity()}>{renderActivity()}</tr>
      </React.Fragment>
   );
}


export default ActivityTableRow;
