import React from 'react'
import PropTypes from 'prop-types'
import fecha from 'fecha'

import { grey } from '../../../utils/colors'
import { getUserTitle } from '../../../../models/user/helpers'

ItemChangelog.propTypes = {
  item: PropTypes.shape().isRequired,
  style: PropTypes.shape()
}

ItemChangelog.defaultProps = {
  style: {}
}

export function ItemChangelog(props) {
  const { item } = props

  if (!item || !item.created_by) {
    return null
  }

  return (
    <div style={{ color: grey.A550, ...props.style }}>
      {`Created by ${getUserTitle(item.created_by)}`}
      {item.updated_by &&
        `   .   Last edit by ${getUserTitle(item.updated_by)} in ${fecha.format(
          new Date(item.updated_at * 1000),
          'dd MMM YYYY'
        )}`}
    </div>
  )
}
