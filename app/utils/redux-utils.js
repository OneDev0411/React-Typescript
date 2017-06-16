export const createNamedWrapperReducer = (reducerFunction, reducerName) => (
  state,
  action
) => {
  const { tabName } = action
  const isInitializationCall = state === undefined
  if (tabName !== reducerName && !isInitializationCall) return state

  return reducerFunction(state, action)
}
