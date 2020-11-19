import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { NavLink } from 'react-router-dom'
import { useSelector } from "react-redux";
import style from 'components/partials/Breadcrumbs.module.scss'

const SelectedMeasureBreadcrumb = () => {
   const selectedMeasure = useSelector(state => state.selectedMeasure);

   return selectedMeasure ? (
      <span>{selectedMeasure.name}</span>
   ) : '';
};

const routes = [
   { path: '/', breadcrumb: 'Tiltaksplaner' },
   { path: '/tiltak/:measureId', breadcrumb: SelectedMeasureBreadcrumb },
];

const ignores = [
   '/tiltak'
]

const shouldIgnore = (match, breadcrumb) => ignores.some(url => url === match.url) || breadcrumb.props.location;

const Breadcrumbs = ({ breadcrumbs }) => {
   return (
      <div className={style.breadcrumbs}>
         <span>Du er her: </span>

         <div>
            {breadcrumbs.map(({ match, breadcrumb }) => {
               if (shouldIgnore(match, breadcrumb)) {
                  return <span key={match.url}>{breadcrumb}</span>
               }

               return (
                  <span key={match.url}>
                     <NavLink to={match.url}>{breadcrumb}</NavLink>
                  </span>
               );
            })}
         </div>
      </div>
   );
};

export default withBreadcrumbs(routes)(Breadcrumbs);