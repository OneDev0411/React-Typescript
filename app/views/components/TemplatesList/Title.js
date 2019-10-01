import React from 'react'

import { plural } from 'utils/plural'

function Title(props) {
  const isPlural = props.count > 1

  return (
    <div className="templates-title">
      {plural(`${props.count} Design`, isPlural)}
    </div>
  )
}

export default Title
