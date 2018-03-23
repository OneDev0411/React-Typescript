import React from 'react'
import { browserHistory } from 'react-router'

const Form = ({ deal, task }) => {
  if (!task || !task.form) {
    return false
  }

  return (
    <div className="file">
      <div className="title">Digital Form</div>
      <div className="item digital-form">
        <div className="image">
          <img src="/static/images/deals/digital-form.svg" alt="" />
        </div>

        <div
          className="name"
          onClick={() =>
            browserHistory.push(
              `/dashboard/deals/${deal.id}/form-viewer/${task.id}`
            )
          }
        >
          <span className="link">{task.title}</span>
        </div>
      </div>
    </div>
  )
}

export default Form
