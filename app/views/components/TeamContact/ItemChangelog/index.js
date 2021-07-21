import React from 'react'

import fecha from 'fecha'
import PropTypes from 'prop-types'
import timeago from 'timeago.js'

import { getUserTitle } from '../../../../models/user/helpers'
import { grey } from '../../../utils/colors'

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

  const createdAt = item.created_at * 1000
  const updatedAt = item.updated_at * 1000

  return (
    <div
      style={{
        color: grey.A600,
        fontSize: '0.75rem',
        fontWeight: 400,
        ...props.style
      }}
    >
      <div
        title={fecha.format(new Date(createdAt), 'MMM DD, YYYY hh:mm:ss A')}
      >{`Created by ${getUserTitle(item.created_by)}, ${timeago().format(
        createdAt
      )}.`}</div>
      {item.updated_by &&
        Math.floor(createdAt / 1000) !== Math.floor(updatedAt / 1000) && (
          <div
            title={fecha.format(new Date(updatedAt), 'MMM DD, YYYY hh:mm:ss A')}
          >
            {`Last edit by ${getUserTitle(item.updated_by)}, ${timeago().format(
              updatedAt
            )}.`}
          </div>
        )}
    </div>
  )
}
