import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'index.scss';
import App from 'App';
import * as serviceWorker from './serviceWorker';
import ConfigLoader from 'components/ConfigLoader';

class Main extends Component {
    render() {
        return <ConfigLoader ready={() => <App />} />;
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
