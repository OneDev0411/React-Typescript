export const getDashboardHeight = isTraining =>
  `calc(100vh - 56px ${isTraining ? ' - 48px' : ''})`
