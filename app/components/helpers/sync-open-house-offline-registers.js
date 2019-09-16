import { addNotification as notify } from 'reapop'

import openHouseStorage from '../../../server/util/pages/openhouse/registration/storage'
import { onlineSubmitHandler as registerOpenHouse } from '../../../server/util/pages/openhouse/registration/handlers'

export default function(accessToken) {
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
          message: `${openHouseData.length} offline register${
            openHouseData.length > 1 ? 's' : ''
          } for "${openHouseData[0].title}" open house synced successfully`,
          status: 'info'
        })
      )
      openHouseStorage.remove(key)
    })
  }
}
