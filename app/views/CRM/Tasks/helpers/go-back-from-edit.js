import { browserHistory } from 'react-router'

export function goBackFromEditTask() {
  const currentLocation = browserHistory.getCurrentLocation()

  console.log(currentLocation)

  if (currentLocation.key) {
    browserHistory.goBack({ state: null })
  } else {
    browserHistory.push({ pathname: '/crm/tasks', state: null })
  }
}
