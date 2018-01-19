import React from 'react'
import WentWrong from '../UserMessages/WentWrong'

const Alert = ({
  type, code, message, supportHandler, children
}) => {
  let content = message

  if (code === 500) {
    content = <WentWrong onClickSupport={supportHandler} />
  }

  return (
    <div
      className={`c-alert c-alert--${type}`}
      style={{
        margin: '1rem 2rem'
      }}
    >
      {children || content}
    </div>
  )
}

export default Alert
