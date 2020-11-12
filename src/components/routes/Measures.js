// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Template
import MeasuresTable from 'components/partials/MeasuresTable';
import Container from 'components/template/Container';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Measure } from 'models/measure';
import style from 'components/routes/Measures.module.scss';
import {createMeasure} from 'actions/MeasureActions';

class Measures extends Component {
   constructor(props) {
      super(props);

      this.state = {
         modalOpen: false,
         newMeasure: new Measure()
      };

      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.saveModal = this.saveModal.bind(this);

      /*this.useStyles = makeStyles((theme) => ({
         root: {
            '& > *': {
               margin: theme.spacing(1),
               width: '25ch',
            },
         },
      }));*/
   }

   /*const */

   

   openModal() {
      this.setState({
         modalOpen: true,
         newMeasure: new Measure()
      });
   }

   handleChange(event) {
      const newMeasure = this.state.newMeasure;
      const targetvalue = event.target.dataset && event.target.dataset.type && event.target.dataset.type === 'number' ? parseInt(event.target.value) : event.target.value;
      newMeasure[event.target.name] = targetvalue;

      this.setState({ newMeasure }, () => console.log(this.state.newMeasure));
   }

   closeModal() {
      this.setState({ modalOpen: false });
   }
   saveModal() {
      this.props.createMeasure(this.state.newMeasure).then(() => {
          this.closeModal();
      });
  }
 

   render() {
      return (
         <Container>
            <h1>Tiltaksplaner</h1>

            <button className="btn" onClick={this.openModal}>Legg til tiltak</button>

            <MeasuresTable />

            <Dialog open={this.state.modalOpen} onClose={this.closeModal} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title">Legg til tiltak</DialogTitle>
               <DialogContent>                 
                  <div className={style.block}>
                     <label>
                        Navn: 
                        <input type="text" name="name" value={this.state.newMeasure.name} onChange={this.handleChange} />
                     </label>                  
                  </div>
                  <div className={style.block}>
                     <label>
                        Fremdrift:
                        <input type="text" name="progress" value={this.state.newMeasure.progress} onChange={this.handleChange} />
                     </label>
                  </div>
                  <div className={style.block}>
                     <label>
                        Volum:
                        <input type="radio" data-type='number' name="volume" checked={this.state.newMeasure.volume === 1} value={1} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="volume" checked={this.state.newMeasure.volume === 2} value={2} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="volume" checked={this.state.newMeasure.volume === 3} value={3} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="volume" checked={this.state.newMeasure.volume === 4} value={4} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="volume" checked={this.state.newMeasure.volume === 5} value={5} onChange={this.handleChange} />
                     </label>
                  </div>
                  <div className={style.block}>
                     <label>
                        Status:
                        <input type="radio" data-type='number' name="status" checked={this.state.newMeasure.status === 1} value={1} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="status" checked={this.state.newMeasure.status === 2} value={2} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="status" checked={this.state.newMeasure.status === 3} value={3} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="status" checked={this.state.newMeasure.status === 4} value={4} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="status" checked={this.state.newMeasure.status === 5} value={5} onChange={this.handleChange} />
                     </label>
                  </div>
                  <div className={style.block}>
                     <label>
                        Trafikklys:
                        <input type="radio" data-type='number' name="trafficLight" checked={this.state.newMeasure.trafficLight === 1} value={1} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="trafficLight" checked={this.state.newMeasure.trafficLight === 2} value={2} onChange={this.handleChange} />
                        <input type="radio" data-type='number' name="trafficLight" checked={this.state.newMeasure.trafficLight === 3} value={3} onChange={this.handleChange} />
                     </label>
                  </div>
                  <div className={style.block}>
                     <label>
                        Resultater:
                        <input type="text" name="results" value={this.state.newMeasure.results} onChange={this.handleChange} />
                     </label>
                  </div>
                  <div className={style.block}>
                     <label>
                        Kommentar:
                        <input type="text" name="comment" value={this.state.newMeasure.comment} onChange={this.handleChange} />
                     </label>
                  </div>
               </DialogContent>
               <DialogActions>
                  <button className="btn" onClick={this.closeModal}>Lukk</button>
                  <button className="btn primary" onClick={this.saveModal}>Lagre</button>
               </DialogActions>
            </Dialog>
         </Container>
      )
   }
}
const mapDispatchToProps = {
   createMeasure
};
export default connect(null, mapDispatchToProps)(Measures);
