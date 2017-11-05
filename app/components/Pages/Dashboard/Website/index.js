// Dashboard/Website/index.js
import React from 'react'
import config from '../../../../../config/public'
import { connect } from 'react-redux'

const API_URL = config.store.url
const Website = ({
  user,
  brand
}) => {
  let brand_id = brand || user.brand
  return (
    <main>
      <iframe
        title="Website builder"
        style={{
          position: 'absolute',
          height: '100%',
          width: 'calc(100% - 70px)'
        }}
        src={`${API_URL}/store?access_token=${user.access_token}${brand_id ? `&brand=${brand_id}` : ''}`}
        frameBorder="0"
      />
    </main>
  )
}

export default connect(({ data }) => ({
  user: data.user,
  brand: data.brand
})
)(Website)
