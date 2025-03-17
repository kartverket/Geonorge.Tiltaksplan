// Dependencies
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainNavigation } from "@kartverket/geonorge-web-components/MainNavigation";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

// Actions
import { updateOidcCookie } from "actions/AuthenticationActions";
import { updateAuthInfo } from "actions/AuthorizationActions";
import { updateSelectedLanguage } from "actions/SelectedLanguageActions";

// Helpers
import { getEnvironmentVariable } from "helpers/environmentVariableHelpers.js";

import Cookies from 'js-cookie';

const NavigationBar = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // State
    const [mainNavigationIsInitialized, setMainNavigationIsInitialized] = useState(false);

    // Redux store
    const oidc = useSelector((state) => state.oidc);
    const authInfo = useSelector((state) => state.authInfo);
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    const initMainNavigation = useCallback(() => {
        const userManager = props.userManager;
        userManager.events.addAccessTokenExpiring(function(){
            console.log("token expiring...");
            userManager.startSilentRenew(); 
        });
        MainNavigation.setup("main-navigation", {
            onSignInClick: () => {
                userManager.signinRedirect();
            },
            onSignOutClick: () => {
                Cookies.set('_loggedIn', 'false', { domain: 'geonorge.no' });
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
        var loggedInCookie = Cookies.get('_loggedIn');
        let autoRedirectPath = null;

        if(loggedInCookie === "true" && !isLoggedIn){
            sessionStorage.autoRedirectPath = window.location.pathname;
            console.log("redirecting to login");
            props.userManager.signinRedirect(); 
        }
        else if(sessionStorage?.autoRedirectPath){
                autoRedirectPath = sessionStorage.autoRedirectPath; 
        }
        if (isLoggedIn || hasAuthInfo) {
            dispatch(updateOidcCookie(oidc.user));
            dispatch(updateAuthInfo());
        }

        if(autoRedirectPath !== null){
            console.log("autoRedirectPath: " + autoRedirectPath);
            navigate(autoRedirectPath);
        }

    }, [authInfo?.organizationNumber?.length, dispatch, initMainNavigation, mainNavigationIsInitialized, oidc.user]);

    const environment = getEnvironmentVariable("environment");
    const language = selectedLanguage === "en-US" ? "en" : "no";

    const userinfo = {
        name: oidc?.user?.profile?.name,
        email: oidc?.user?.profile?.email,
    };

    const orginfo = {
        organizationNumber: authInfo?.organizationNumber,
        organizationName: authInfo?.organizationName

    }

    return (
        <Fragment>
            <Helmet htmlAttributes={{ lang: language }} />
            <main-navigation
                userinfo={JSON.stringify(userinfo)}
                orginfo={JSON.stringify(orginfo)}
                language={language}
                isLoggedIn={oidc.user ? true : false}
                environment={environment}
                maincontentid="main-content"
            ></main-navigation>
        </Fragment>
    );
};

export default NavigationBar;
