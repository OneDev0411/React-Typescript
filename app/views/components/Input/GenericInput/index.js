import React from 'react'
import _ from 'underscore'

export default props => (
  <input {..._.omit(props, 'ErrorMessageHandler', 'data-type')} />
)
