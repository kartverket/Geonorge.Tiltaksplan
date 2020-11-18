import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import ConfigLoader from 'components/ConfigLoader';
import * as serviceWorker from './serviceWorker';
import 'extensions';
import 'index.scss';

class Main extends Component {
    render() {
        return <ConfigLoader ready={() =>
            <App />
        } />;
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));

serviceWorker.unregister();
