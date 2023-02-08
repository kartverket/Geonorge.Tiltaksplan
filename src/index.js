import React from "react";
import App from "App";
import { createRoot } from "react-dom/client";
import ConfigLoader from "components/ConfigLoader";
import * as serviceWorker from "./serviceWorker";
import "extensions";
import "index.scss";
import "dayjs/locale/nb";
import dayjs from "dayjs";

dayjs.locale("nb");

const Main = () => {
    return <ConfigLoader ready={(config) => <App config={config} />} />;
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main />);

serviceWorker.unregister();
