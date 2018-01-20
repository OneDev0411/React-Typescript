import React from 'react'
import PropTypes from 'prop-types'
import WentWrong from '../UserMessages/WentWrong'

const Alert = ({
  children, code, message, style, supportHandler, type
}) => {
  let content = message

  if (code === 500) {
    content = <WentWrong onClickSupport={supportHandler} />
  }

  return (
    <div className={`c-alert c-alert--${type}`} style={style}>
      {children || content}
    </div>
  )
}

Alert.propTypes = {
  code: PropTypes.number,
  message: PropTypes.string,
  supportHandler: PropTypes.func,
  style: PropTypes.object,
  type: PropTypes.string.isRequired
}

export default Alert
