// Dependencies
import { createUserManager } from 'redux-oidc';

// Config
import { oidcConfig } from 'components/config';

const userManagerConfig = oidcConfig.oidc;
const userManager = createUserManager(userManagerConfig);

export default userManager;
