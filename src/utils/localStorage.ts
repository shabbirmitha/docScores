export const LOCAL_STORAGE_KEY = "docStoreStates";

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading localStorage", err);
    return undefined;
  }
};
export const saveState = (state: unknown) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Error saving localStorage", err);
  }
};
