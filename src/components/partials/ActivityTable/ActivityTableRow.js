import React, { Component } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import PropTypes from 'prop-types';
import DayJS from 'react-dayjs';
import style from 'components/partials/ActivityTable/ActivityTableRow.module.scss';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


class ActivityTableRow extends Component {  
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
        this.handleChange = this.handleChange.bind(this);

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
    getParticitants(participants) {
        
        return participants && participants.length ? participants.map((participant, index) => {
        
            return (
                
                participant.name + (participants.length - index > 1 ? ', ' : ' ')
                
            )
        }): null;
    }
    handleChange(event) {
       
        this.setState();
    }

    openModal() {
        this.setState({
            modalOpen: true
        });
    }
    closeModal() {
        this.setState({ modalOpen: false });
    }
    saveModal() {
            this.closeModal();
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
            <td><button onClick={this.openModal}>Slett</button></td>
            </React.Fragment>)
    }

    render() {
        
        return ( <React.Fragment>
            <tr>{this.renderActivity()}</tr>
           
            <Dialog open={this.state.modalOpen} onClose={this.closeModal} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Legg til aktivitet</DialogTitle>
                <DialogContent>
        <div>Er du sikker på at du vil slette {this.props.activity.name}?</div>
                </DialogContent>
                <DialogActions>
                    <button className="btn" onClick={this.closeModal}>Avbryt</button>
                    <button className="btn primary" onClick={this.saveModal}>Slett</button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

            )
    }
}
ActivityTableRow.propTypes = {
    activity: PropTypes.object.isRequired
 };

 

export default connect(null, null)(ActivityTableRow);