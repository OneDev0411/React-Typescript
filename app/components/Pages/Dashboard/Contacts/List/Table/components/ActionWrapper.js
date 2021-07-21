export const ActionWrapper = ({ children, disabled }) => {
  if (disabled) {
    return null
  }

  return children
}
