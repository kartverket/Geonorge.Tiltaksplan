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
import Commits from 'components/routes/Commits';
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
    return (<Provider store={store}>
      <ConnectedRouter history={history}>
        <NavigationBar />
        <Switch>
          <Route exact={true} path="/commits/:commitId" render={(props) => (<Commits {...props}/>)}/>
          <Route exact={true} path="/commits" render={(props) => (<Commits {...props}/>)}/>
          <Route exact={true} path="/" render={(props) => (<Home {...props}/>)}/>
          <Route render={() => (<NotFound/>)}/>
        </Switch>
      </ConnectedRouter>
    </Provider>);
  }
}

export default App;
