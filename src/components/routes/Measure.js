// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'components/template/Container';
import { fetchSelectedMeasure } from 'actions/MeasureActions';
import DayJS from 'react-dayjs';
import style from 'components/routes/Measure.module.scss'


class Measure extends Component {
    componentDidMount() {
        this.props.fetchSelectedMeasure(this.getSelectedMeasureId())
    }

    getSelectedMeasureId(){
        return this.props.match && this.props.match.params && this.props.match.params.measureId
        ? this.props.match.params.measureId
        : null;
    }

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

    renderActivities(activities){
        return activities && activities.length ?activities.map(activity => {
            return ( 
                <tr>
                    <td>{activity.name}</td>                   
                    <td>{activity.description}</td>
                    <td>{this.getStatustext(activity.status)}</td>
                    <td><DayJS format="DD.MM.YYYY">{activity.implementationStart}</DayJS></td>
                    <td><DayJS format="DD.MM.YYYY">{activity.implementationEnd}</DayJS></td>
                    <td>{activity.participants.length}</td>
                </tr> )
        }) : null;
    }

    render() {
        const selectedMeasure = this.props.selectedMeasure;
        return selectedMeasure ? (<Container>
            <h1>{selectedMeasure.name}</h1>
            <table className={style.activitiesTable}>
                <thead>
                    <tr><th>Navn</th><th>Beskrivelse</th><th>Status</th><th>Start</th><th>Slutt</th><th>Deltakere</th></tr>
                </thead>
                <tbody>
                {this.renderActivities(selectedMeasure.activities)}
                </tbody>
                </table>
        </Container>) : ''
    }
}

const mapStateToProps = state => ({
    selectedMeasure: state.selectedMeasure
});

const mapDispatchToProps = {
    fetchSelectedMeasure
};


export default connect(mapStateToProps, mapDispatchToProps)(Measure);
