export const hasAdminRole = authInfo => {
  return authInfo && authInfo.roles && authInfo.roles.includes('nd.metadata_admin');
}

export const hasEditorRole = authInfo => {
  return authInfo && authInfo.roles && authInfo.roles.includes('nd.tiltaksplan');
}

export const isResponsibleAgency = (authInfo = {}, responsibleAgency = {}) => {
  return parseInt(authInfo.organizationNumber) === responsibleAgency.orgNumber;
}

export const isOwner = (authInfo = {}, owner = {}) => {
  return parseInt(authInfo.organizationNumber) === owner.orgNumber;
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
export const canEditReport = (authInfo, owner) => {
  if (hasAdminRole(authInfo)) {
    return true;
  } else if (hasEditorRole(authInfo)) {
    return isOwner(authInfo, owner);
  } else {
    return false;
  }
}


// Measure Activity
export const canAddActivity = (authInfo, owner) => {
  if (hasAdminRole(authInfo)) {
    return true;
  } else if (hasEditorRole(authInfo)) {
    return isOwner(authInfo, owner);
  } else {
    return false;
  }
}

export const canDeleteActivity = (authInfo, responsibleAgency) => {
  if (hasAdminRole(authInfo)) {
    return true;
  } else if (hasEditorRole(authInfo)) {
    return isResponsibleAgency(authInfo, responsibleAgency);
  } else {
    return false;
  }
}

export const canEditActivity = (authInfo, responsibleAgency) => {
  if (hasAdminRole(authInfo)) {
    return true;
  } else if (hasEditorRole(authInfo)) {
    return isResponsibleAgency(authInfo, responsibleAgency);
  } else {
    return false;
  }
}
