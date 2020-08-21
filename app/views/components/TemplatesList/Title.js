import React from 'react'
import pluralize from 'pluralize'

function Title(props) {
  return (
    <div className="templates-title">
      {pluralize('Design', props.count, true)}
    </div>
  )
}

export default Title
