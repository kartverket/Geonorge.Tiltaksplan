// Dependencies
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OidcCallback = ({ userManager }) => {
    const navigate = useNavigate();

    useEffect(() => {
        userManager.signinRedirectCallback()
            .then((user)  => {
                console.log("User logged in:", user);
                const autoRedirectPath = sessionStorage?.autoRedirectPath || "/";
                sessionStorage.removeItem("autoRedirectPath");
                navigate(autoRedirectPath);
            })
            .catch(() => {
                navigate("/");
            });
    }, [navigate, userManager]);

    return <div>Logger inn...</div>;
};

export default OidcCallback;
