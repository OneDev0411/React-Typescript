import React, { Fragment } from 'react'
import { string } from 'prop-types'

ColumnHeader.propTypes = {
  title: string.isRequired
}

export function ColumnHeader({ title }) {
  return (
    <Fragment>
      {title}
      <i className="fa fa-caret-down" />
      <i className="fa fa-caret-up" />
    </Fragment>
  )
}
