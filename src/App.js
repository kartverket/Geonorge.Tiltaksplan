// Dependecies
import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
import {ConnectedRouter} from 'connected-react-router';
import WebFont from 'webfontloader';

// Utils
import configureStore, {history} from 'utils/configureStore';

// Routes
import Home from 'components/routes/Home';
import Measures from 'components/routes/Measures';
import Measure from 'components/routes/Measure';
import NotFound from 'components/routes/NotFound';

// Partials
import NavigationBar from 'components/partials/NavigationBar';

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
            <Route exact={true} path="/tiltak/:measureId" render={(props) => (<Measure {...props}/>)}/>
            <Route exact={true} path="/tiltak" render={(props) => (<Measures {...props} />)}/>
            <Route exact={true} path="/" render={(props) => (<Measures {...props} />)}/>
            <Route render={() => (<NotFound/>)}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
