import React, { Component } from 'react';
import App from 'App';
import { createRoot } from 'react-dom/client'
import ConfigLoader from 'components/ConfigLoader';
import * as serviceWorker from './serviceWorker';
import 'extensions';
import 'index.scss';
import 'dayjs/locale/nb';
import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";
import "style/react-datepicker-override.scss";
import 'easymde/dist/easymde.min.css';
import 'easymde-override.css';

dayjs.locale('nb');

class Main extends Component {
    render() {
        return <ConfigLoader ready={(config) =>
            <App config={config} />
        } />;
    }
}

createRoot(<Main />, document.getElementById('root'));

serviceWorker.unregister();
