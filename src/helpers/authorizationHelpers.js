export const hasAdminRole = authInfo => {
  return authInfo && authInfo.roles && authInfo.roles.includes('nd.metadata_admin');
}

export const hasEditorRole = authInfo => {
  return authInfo && authInfo.roles && authInfo.roles.includes('nd.metadata_editor');
}

// Measure
export const canAddMeasure = authInfo => {
  return hasAdminRole(authInfo);
}

export const canDeleteMeasure = authInfo => {
  return hasAdminRole(authInfo);
}

export const canEditMeasure = authInfo => {
  return hasAdminRole(authInfo);
}


// Measure Report
export const canEditReport = () => {
  return true;
}


// Measure Activity
export const canAddActivity = () => {
  return true;
}

export const canDeleteActivity = () => {
  return true;
}

export const canEditActivity = () => {
  return true;
}
