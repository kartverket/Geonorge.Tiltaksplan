import React, { Component } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import PropTypes from 'prop-types';
import DayJS from 'react-dayjs';
import style from 'components/partials/ActivityTable/ActivityTableRow.module.scss';


class ActivityTableRow extends Component {  
    
    getStatustext(status) {
        switch(status){
            case 1:
            return 'Oppstart';
            case 2:
            return 'Utredning';
            case 3:
            return 'Utarbeidende';
            case 4:
            return 'Avsluttende fase';
            case 5:
            return 'Gjennomført';
            default:
			return '';
        };
    }
    getParticitants(participants) {
        
        return participants && participants.length ? participants.map((participant, index) => {
        
            return (
                
                participant.name + (participants.length - index > 1 ? ', ' : ' ')
                
            )
        }): null;
    }

    renderActivity() {
        const activity = this.props.activity;
        const statusStyle = { width: `${activity.status * 20}%` }
        return (<React.Fragment>
            <td>{activity.name}</td>
            <td>{activity.description}</td>
            <td>{this.getParticitants(activity.participants)}</td>
            <td><div className={style.statusbar}><div className={style.block} style={statusStyle}></div></div>{this.getStatustext(activity.status)}</td>
            <td><DayJS format="DD.MM.YYYY">{activity.implementationStart}</DayJS></td>
            <td><DayJS format="DD.MM.YYYY">{activity.implementationEnd}</DayJS></td>
            </React.Fragment>)
    }

    render() {
        
        return (
            <tr>{this.renderActivity()}</tr>)
    }
}
ActivityTableRow.propTypes = {
    activity: PropTypes.object.isRequired
 };

 

export default connect(null, null)(ActivityTableRow);