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
      <div>{`Created by ${getUserTitle(item.created_by)} in ${fecha.format(
        new Date(item.created_at * 1000),
        'MMM DD, YYYY hh:mm A'
      )}.`}</div>
      {item.updated_by && (
        <div>
          {`Last edit by ${getUserTitle(item.updated_by)} in ${fecha.format(
            new Date(item.updated_at * 1000),
            'MMM DD, YYYY hh:mm A'
          )}.`}
        </div>
      )}
    </div>
  )
}
