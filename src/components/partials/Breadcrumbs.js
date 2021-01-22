import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { NavLink } from 'react-router-dom'
import { useSelector } from "react-redux";
import style from 'components/partials/Breadcrumbs.module.scss'

const SelectedMeasureBreadcrumb = () => {
   const selectedMeasure = useSelector(state => state.measures.selectedMeasure);

   return selectedMeasure ? (
      <span>{selectedMeasure.no} - {selectedMeasure.name}</span>
   ) : '';
};

const SelectedActivityBreadcrumb = () => {
  const selectedActivity = useSelector(state => state.activities.selectedActivity);

  return selectedActivity ? (
     <span>{selectedActivity.no} - {selectedActivity.name}</span>
  ) : '';
};

const routes = [
   { path: '/', breadcrumb: 'Tiltaksplan' },
   { path: '/tiltak/:measureId', breadcrumb: SelectedMeasureBreadcrumb },
   { path: '/tiltak/:measureId/ny-aktivitet', breadcrumb: 'Ny aktivitet' },
   { path: '/tiltak/:measureId/aktivitet/:activityId', breadcrumb: SelectedActivityBreadcrumb }
];

const options = {
  excludePaths: [
    '/tiltak',
    '/tiltak/:measureId/aktivitet'
  ]
};


const Breadcrumbs = ({ breadcrumbs }) => {
   return (
      <div className={style.breadcrumbs}>
         <span>Du er her: </span>

         <div>
            {breadcrumbs.map(({ match, breadcrumb }, index) => {
               return (
                  <span key={match.url}>
                    { 
                      index < breadcrumbs.length - 1 ? 
                      <NavLink to={match.url}>{breadcrumb}</NavLink> :
                      <span>{breadcrumb}</span>
                    }
                  </span>
               );
            })}
         </div>
      </div>
   );
};

export default withBreadcrumbs(routes, options)(Breadcrumbs);