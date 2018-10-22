export const getDashboardHeight = isTraining =>
  `calc(100vh - 113px ${isTraining ? ' - 48px' : ''})`
