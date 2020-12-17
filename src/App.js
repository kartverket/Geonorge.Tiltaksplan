// Dependecies
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import ReduxToastr from 'react-redux-toastr';

// Utils
import configureStore, { history } from 'utils/configureStore';
import userManagerPromise from 'utils/userManager';

// Routes
import OidcCallback from 'components/routes/OidcCallback';
import OidcSignoutCallback from 'components/routes/OidcSignoutCallback';
import Measures from 'components/routes/Measures';
import Measure from 'components/routes/Measure';
import Activity from 'components/routes/Activity';
import NotFound from 'components/routes/NotFound';

// Actions
import { updateConfig } from 'actions/ConfigActions';

// Partials
import NavigationBar from 'components/partials/NavigationBar';

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { OidcProvider } from 'redux-oidc';

library.add(fab, faCheckSquare, faTrashAlt, faEdit)

const initialState = {};
const storePromise = configureStore(initialState, userManagerPromise);
let store = null;
let userManager = null;

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         storeIsLoaded: false,
         userManagerIsLoaded: false
      };
   }

   componentDidMount() {
      storePromise.then((storeConfig) => {
         store = storeConfig;
         store.dispatch(updateConfig(this.props.config));

         if (!this.state.userManagerIsLoaded) {
            this.setState({
               userManagerIsLoaded: true
            });
         }
      });
      userManagerPromise.then(userManagerConfig => {
         userManager = userManagerConfig;
         this.setState({
            storeIsLoaded: true
         })
      })
   }
   render() {
      if (this.state && userManager && this.state.userManagerIsLoaded && this.state.storeIsLoaded) {
         return (
            <Provider store={store}>
               <OidcProvider userManager={userManager} store={store}>
                  <ConnectedRouter history={history}>
                     <NavigationBar userManager={userManager} />
                     <Switch>
                        <Route exact={true} path="/" render={(props) => (<Measures {...props} />)} />
                        <Route exact path="/signin-oidc" render={() => (<OidcCallback userManager={userManager}/>)} />
                        <Route exact path="/signout-callback-oidc" render={() => (<OidcSignoutCallback userManager={userManager}/>)} />
                        <Route exact={true} path="/tiltak/:measureId" render={(props) => (<Measure {...props} />)} />
                        <Route exact={true} path="/tiltak/:measureId/ny-aktivitet" render={(props) => (<Activity {...props} />)} />
                        <Route exact={true} path="/tiltak/:measureId/aktivitet" render={(props) => (<Activity {...props} />)} />
                        <Route exact={true} path="/tiltak/:measureId/aktivitet/:activityId" render={(props) => (<Activity {...props} />)} />
                        <Route render={() => (<NotFound />)} />
                     </Switch>
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
                  </ConnectedRouter>
               </OidcProvider>
            </Provider>
         );
      } else return ''
   }
}

export default App;
