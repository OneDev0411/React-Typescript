
export const createNamedWrapperReducer = (reducerFunction, reducerName) =>
  (state, action) => {
    const {name} = action;
    const isInitializationCall = state === undefined;
    if(name !== reducerName && !isInitializationCall) return state;

    return reducerFunction(state, action);
  }
