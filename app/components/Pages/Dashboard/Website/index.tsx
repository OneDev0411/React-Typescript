import React from 'react'

import { useSelector } from 'react-redux'

import { IAppState } from '../../../../reducers'
import config from '../../../../../config/public'
import { getActiveBrand } from '../../../../utils/user-teams'

const API_URL = config.store.url

const Store = () => {
  const user = useSelector<IAppState, IUser>(store => store.user)
  const brand = getActiveBrand(user)

  return (
    <main>
      <iframe
        title="Store Builder"
        style={{
          position: 'absolute',
          height: '100%',
          width: 'calc(100% - 70px)'
        }}
        src={`${API_URL}/store?access_token=${user.access_token}${
          brand?.id ? `&brand=${brand.id}` : ''
        }`}
        frameBorder="0"
      />
    </main>
  )
}

export default Store
