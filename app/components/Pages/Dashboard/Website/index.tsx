import React from 'react'

import { useSelector } from 'react-redux'

import { ACL } from 'constants/acl'
import Acl from 'components/Acl'

import { selectUser } from 'selectors/user'

import config from '../../../../../config/public'
import { getActiveBrand } from '../../../../utils/user-teams'

const API_URL = config.store.url

const Store = () => {
  const user = useSelector(selectUser)
  const brand = getActiveBrand(user)

  return (
    <Acl access={ACL.STORE} fallbackUrl="/dashboard">
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
    </Acl>
  )
}

export default Store
