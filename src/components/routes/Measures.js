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
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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
      newMeasure[event.target.name] = event.target.value;

      this.setState({ newMeasure }, () => console.log(this.state.newMeasure));
   }

   closeModal() {
      this.setState({ modalOpen: false });
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

                  <TextField label="Navn" variant="outlined" name="name" value={this.state.newMeasure.name} onChange={this.handleChange} />

                  <label>
                     Fremdrift:
                     <input type="text" name="progress" value={this.state.newMeasure.progress} onChange={this.handleChange} />
                  </label>
               </DialogContent>
               <DialogActions>
                  <button className="btn" onClick={this.closeModal}>Lukk</button>
                  <button className="btn primary" onClick={this.closeModal}>Lagre</button>
               </DialogActions>
            </Dialog>
         </Container>
      )
   }
}

export default connect(null, null)(Measures);
