export const parseJson = <T = any>(content: string, defaultValue: T | undefined = undefined): T => {
  try {
    return JSON.parse(content);
  } catch (ex) {
    if (defaultValue == undefined) throw ex;
    return defaultValue;
  }
};
