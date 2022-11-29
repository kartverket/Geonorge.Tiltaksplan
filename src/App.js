// Dependecies
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import ReduxToastr from "react-redux-toastr";
import { OidcProvider } from "redux-oidc";

// Utils
import configureStore, { history } from "utils/configureStore";
import userManagerPromise from "utils/userManager";

// Routes
import OidcCallback from "components/routes/OidcCallback";
import OidcSignoutCallback from "components/routes/OidcSignoutCallback";
import Measures from "components/routes/Measures";
import Measure from "components/routes/Measure";
import Activity from "components/routes/Activity";
import NotFound from "components/routes/NotFound";

// Actions
import { updateConfig } from "actions/ConfigActions";

// Partials
import NavigationBar from "components/partials/NavigationBar";
import Footer from "components/partials/Footer";

// font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
    faCheckSquare,
    faTrashAlt,
    faEdit,
    faPlusCircle,
    faMinusCircle,
    faInfoCircle,
    faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";

library.add(fab, faCheckSquare, faTrashAlt, faEdit, faPlusCircle, faMinusCircle, faInfoCircle, faExternalLinkAlt);

const initialState = {};
const storePromise = configureStore(initialState, userManagerPromise);
let store = null;
let userManager = null;

const App = (props) => {
    const [storeIsLoaded, setStoreIsLoaded] = useState(false);
    const [userManagerIsLoaded, setUserManagerIsLoaded] = useState(false);

    useEffect(() => {
        storePromise.then((storeConfig) => {
            store = storeConfig;
            store.dispatch(updateConfig(props.config));

            if (!userManagerIsLoaded) {
                setUserManagerIsLoaded(true);
            }
        });
        userManagerPromise.then((userManagerConfig) => {
            userManager = userManagerConfig;
            setStoreIsLoaded(true);
        });
    }, [props.config, userManagerIsLoaded]);

    if (userManager && userManagerIsLoaded && storeIsLoaded) {
        return (
            <Provider store={store}>
                <OidcProvider userManager={userManager} store={store}>
                    <Router history={history}>
                        <NavigationBar userManager={userManager} />
                        <Routes>
                            <Route exact path="/" element={<Measures />} />
                            <Route exact path="/signin-oidc" element={<OidcCallback userManager={userManager} />} />
                            <Route
                                exact
                                path="/signout-callback-oidc"
                                element={<OidcSignoutCallback userManager={userManager} />}
                            />
                            <Route exact path="/tiltak/:measureNumber" element={<Measure />} />
                            <Route exact path="/tiltak/:measureNumber/ny-aktivitet" element={<Activity />} />
                            <Route exact path="/tiltak/:measureNumber/aktivitet" element={<Activity />} />
                            <Route
                                exact
                                path="/tiltak/:measureNumber/aktivitet/:activityNumber"
                                element={<Activity />}
                            />
                            <Route element={<NotFound />} />
                        </Routes>
                        <Footer />
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
                    </Router>
                </OidcProvider>
            </Provider>
        );
    } else return null;
};

export default App;
