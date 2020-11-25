// Dependecies
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import ReduxToastr from 'react-redux-toastr';

// Utils
import configureStore, { history } from 'utils/configureStore';

// Routes
import Measures from 'components/routes/Measures';
import Measure from 'components/routes/Measure';
import NewActivity from 'components/routes/NewActivity';
import Activity from 'components/routes/Activity';
import NotFound from 'components/routes/NotFound';

// Partials
import NavigationBar from 'components/partials/NavigationBar';

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faCheckSquare, faTrashAlt, faEdit)

const initialState = {};
const store = configureStore(initialState);

class App extends Component {
   render() {
      return (
         <Provider store={store}>
            <ConnectedRouter history={history}>
               <NavigationBar />
               <Switch>
                  <Route exact={true} path="/" render={(props) => (<Measures {...props} />)} />
                  <Route exact={true} path="/tiltak/:measureId" render={(props) => (<Measure {...props} />)} />
                  <Route exact={true} path="/tiltak/:measureId/ny-aktivitet" render={(props) => (<NewActivity {...props} />)} />
                  <Route exact={true} path="/tiltak/:measureId/aktivitet" render={(props) => (<Activity {...props} />)} />
                  <Route exact={true} path="/tiltak/:measureId/aktivitet/:activityId" render={(props) => (<Activity {...props} />)} />
                  <Route render={() => (<NotFound />)} />
               </Switch>
            </ConnectedRouter>
            <ReduxToastr
               timeOut={2000}
               newestOnTop={false}
               preventDuplicates
               position="top-right"
               getState={(state) => state.toastr}
               transitionIn="fadeIn"
               transitionOut="fadeOut"
               progressBar
               closeOnToastrClick 
            />
         </Provider>
      );
   }
}

export default App;
