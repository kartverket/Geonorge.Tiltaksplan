// Dependencies
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const processSigninResponse = async (userManager, navigate) => {
  try {
    const user = await userManager.signinRedirectCallback();
    // Handle user object (e.g., dispatch to Redux)
    const autoRedirectPath = sessionStorage?.autoRedirectPath || "/";
    sessionStorage.removeItem("autoRedirectPath");
    navigate(autoRedirectPath);
  } catch (error) {
    console.error("Sign-in response error:", error);
    navigate("/");
  }
};

const OidcCallback = ({ userManager }) => {
  const navigate = useNavigate();

  useEffect(() => {
    processSigninResponse(userManager, navigate);
  }, [navigate, userManager]);

  return <div>Logger inn...</div>;
};

export default OidcCallback;
