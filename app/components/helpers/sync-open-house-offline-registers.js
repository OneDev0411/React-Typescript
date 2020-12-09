import { addNotification as notify } from 'components/notification'
import pluralize from 'pluralize'

import openHouseStorage from '../../../server/app/routes/openhouse/registration/storage'
import { onlineSubmitHandler as registerOpenHouse } from '../../../server/app/routes/openhouse/registration/handlers'

export default function syncOpenHouseOfflineRegisters(accessToken) {
  return async dispatch => {
    const allOpenHouseData = openHouseStorage.getAll()

    Object.keys(allOpenHouseData).forEach(async key => {
      const openHouseData = allOpenHouseData[key]

      await Promise.all(
        openHouseData
          .map(openHouse => ({
            ...openHouse,
            agentAccessToken: accessToken
          }))
          .map(registerOpenHouse)
      )
      dispatch(
        notify({
          message: `${pluralize(
            'offline register',
            openHouseData.length,
            true
          )} for "${openHouseData[0].title}" open house synced successfully`,
          status: 'info'
        })
      )
      openHouseStorage.remove(key)
    })
  }
}
