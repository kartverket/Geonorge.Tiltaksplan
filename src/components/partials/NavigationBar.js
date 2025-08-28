// Dependencies
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainNavigation } from "@kartverket/geonorge-web-components/MainNavigation";
import { useNavigate } from "react-router-dom";

// Actions
import { updateOidcCookie } from "actions/AuthenticationActions";
import { updateAuthInfo } from "actions/AuthorizationActions";
import { updateSelectedLanguage } from "actions/SelectedLanguageActions";
import { userLoaded } from "reducers/authActions";

// Helpers
import { getEnvironmentVariable } from "helpers/environmentVariableHelpers.js";

import Cookies from 'js-cookie';

const NavigationBar = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // State
    const [mainNavigationIsInitialized, setMainNavigationIsInitialized] = useState(false);

    // Redux store
    const auth = useSelector((state) => state.auth);
    const authInfo = useSelector((state) => state.authInfo);
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    const initMainNavigation = useCallback(() => {
        const userManager = props.userManager;

        // Listen for silent renew and update Redux state when user is loaded
        userManager.events.addUserLoaded(function(user) {
            dispatch(userLoaded(user)); // <-- update Redux state
        });

        userManager.events.addAccessTokenExpiring(function(){
            console.log("token expiring...");
            userManager.startSilentRenew(); 
        });
        MainNavigation.setup("main-navigation", {
            onSignInClick: () => {
                userManager.signinRedirect();
            },
            onSignOutClick: () => {
                if(auth != null && auth.user != null && auth.user.id_token != null){
                userManager.signoutRedirect({ id_token_hint: auth.user.id_token });
                Cookies.set('_loggedIn', 'false');
                userManager.signoutRedirect({ id_token_hint: auth.id_token });
                userManager.removeUser();
                }
            },
            onNorwegianLanguageSelect: () => {
                dispatch(updateSelectedLanguage("nb-NO"));
            },
            onEnglishLanguageSelect: () => {
                dispatch(updateSelectedLanguage("en-US"));
            }
        });
        setMainNavigationIsInitialized(true);
    }, [dispatch, auth?.user?.id_token, props.userManager]);

    useEffect(() => {
        console.log("auth: " + auth);
        if (!auth?.isLoadingUser) {
            initMainNavigation();
        }
    }, [initMainNavigation, auth?.isLoadingUser]);

    useEffect(() => {
        if (!mainNavigationIsInitialized) {
            initMainNavigation();
        }
        const isLoggedIn = !!auth?.user;
        const hasAuthInfo = !!authInfo?.organizationNumber?.length;
        var loggedInCookie = Cookies.get('_loggedInOtherApp');
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
            dispatch(updateOidcCookie(auth.user));
            dispatch(updateAuthInfo());
        }

        if(autoRedirectPath !== null){
            console.log("autoRedirectPath: " + autoRedirectPath);
            navigate(autoRedirectPath);
        }

    }, [authInfo?.organizationNumber?.length, dispatch, initMainNavigation, mainNavigationIsInitialized, auth?.user]);

    const environment = getEnvironmentVariable("environment");
    const language = selectedLanguage === "en-US" ? "en" : "no";

    const userinfo = {
        name: auth?.user?.profile?.name,
        email: auth?.user?.profile?.email,
    };

    const orginfo = {
        organizationNumber: authInfo?.organizationNumber,
        organizationName: authInfo?.organizationName

    }

    return (
        <Fragment>
            <main-navigation
                userinfo={JSON.stringify(userinfo)}
                orginfo={JSON.stringify(orginfo)}
                language={language}
                isLoggedIn={auth?.user ? true : false}
                environment={environment}
                maincontentid="main-content"
            ></main-navigation>
        </Fragment>
    );
};

export default NavigationBar;
