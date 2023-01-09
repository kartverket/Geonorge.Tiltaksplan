// Dependencies
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainNavigation } from "@kartverket/geonorge-web-components/MainNavigation";
import { Helmet } from "react-helmet";

// Actions
import { updateOidcCookie } from "actions/AuthenticationActions";
import { updateAuthInfo } from "actions/AuthorizationActions";
import { updateSelectedLanguage } from "actions/SelectedLanguageActions";

// Helpers
import { getEnvironmentVariable } from "helpers/environmentVariableHelpers.js";

const NavigationBar = (props) => {
    const dispatch = useDispatch();
    // State
    const [mainNavigationIsInitialized, setMainNavigationIsInitialized] = useState(false);

    // Redux store
    const oidc = useSelector((state) => state.oidc);
    const authInfo = useSelector((state) => state.authInfo);
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    const initMainNavigation = useCallback(() => {
        const userManager = props.userManager;
        MainNavigation.setup("main-navigation", {
            onSignInClick: () => {
                userManager.signinRedirect();
            },
            onSignOutClick: () => {
                userManager.signoutRedirect({ id_token_hint: oidc.user.id_token });
                userManager.removeUser();
            },
            onNorwegianLanguageSelect: () => {
                dispatch(updateSelectedLanguage("nb-NO"));
            },
            onEnglishLanguageSelect: () => {
                dispatch(updateSelectedLanguage("en-US"));
            }
        });
        setMainNavigationIsInitialized(true);
    }, [dispatch, oidc?.user?.id_token, props.userManager]);

    useEffect(() => {
        if (!oidc.isLoadingUser) {
            initMainNavigation();
        }
    }, [initMainNavigation, oidc.isLoadingUser]);

    useEffect(() => {
        if (!mainNavigationIsInitialized) {
            initMainNavigation();
        }
        const isLoggedIn = !!oidc?.user;
        const hasAuthInfo = !!authInfo?.organizationNumber?.length;
        if (isLoggedIn || hasAuthInfo) {
            dispatch(updateOidcCookie(oidc.user));
            dispatch(updateAuthInfo());
        }
    }, [authInfo?.organizationNumber?.length, dispatch, initMainNavigation, mainNavigationIsInitialized, oidc.user]);

    const environment = getEnvironmentVariable("environment");
    const language = selectedLanguage === "en-US" ? "en" : "no";
    return (
        <Fragment>
            <Helmet htmlAttributes={{ lang: language }} />
            <a href="#main-content" class="visually-hidden jump-to-main">
                <span>Hopp til hovedinnhold</span>
            </a>
            <main-navigation
                language={language}
                isLoggedIn={oidc.user ? true : false}
                environment={environment}
            ></main-navigation>
        </Fragment>
    );
};

export default NavigationBar;
