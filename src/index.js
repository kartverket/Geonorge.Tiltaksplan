import React from "react";
import App from "App";
import { createRoot } from "react-dom/client";
import ConfigLoader from "components/ConfigLoader";
import * as serviceWorker from "./serviceWorker";
import "extensions";
import "index.scss";
import "dayjs/locale/nb";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import "style/react-datepicker-override.scss";
import "easymde/dist/easymde.min.css";
import "easymde-override.css";

dayjs.locale("nb");

const Main = () => {
    return <ConfigLoader ready={(config) => <App config={config} />} />;
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main />);

serviceWorker.unregister();
