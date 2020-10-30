// Config
import config from 'components/config';

const insertEnvironmentVariableParameters = (environmentVariable, environmentVariableParameters) => {
  const environmentVariableRegex = /{[0-9a-z]*}/ig;
  let m;
  const environmentVariableCopy = environmentVariable;
  while ((m = environmentVariableRegex.exec(environmentVariableCopy)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === environmentVariableRegex.lastIndex) {
      environmentVariableRegex.lastIndex++;
    }
    const match = m[0];
    const index = match.substring(match.lastIndexOf("{") + 1, match.lastIndexOf("}"));
    environmentVariable = environmentVariable.replace(match, environmentVariableParameters[index])
  };
  return environmentVariable;
}

export const getEnvironmentVariable = (environmentVariableKey, environmentVariableParameters = {}) => {
  const environmentVariables = config;
  if (environmentVariables && environmentVariables[environmentVariableKey]) {
    const environmentVariable = environmentVariables[environmentVariableKey];
    return insertEnvironmentVariableParameters(environmentVariable, environmentVariableParameters);
  } else {
    console.warn(`Environment variable for ${environmentVariableKey} is missing`);
    return null;
  }
}
