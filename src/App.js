// Dependecies
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

// Utils
import configureStore, { history } from 'utils/configureStore';

// Routes
import Measures from 'components/routes/Measures';
import Measure from 'components/routes/Measure';
import EditMeasure from 'components/routes/EditMeasure';
import NotFound from 'components/routes/NotFound';

// Partials
import NavigationBar from 'components/partials/NavigationBar';

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faCheckSquare, faTrashAlt, faEdit)


WebFont.load({
  google: {
    families: ['Roboto:400,700&display=swap']
  }
});

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
            <Route exact={true} path="/tiltak/nytt" render={(props) => (<EditMeasure {...props} />)} />
            <Route exact={true} path="/tiltak/:measureId" render={(props) => (<Measure {...props} />)} />
            <Route exact={true} path="/tiltak/:measureId/rediger" render={(props) => (<EditMeasure {...props} />)} />
            <Route render={() => (<NotFound />)} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
