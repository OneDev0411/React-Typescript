import React from 'react'
import _ from 'underscore'
import DealCreate from '../create'

export default ({
  isBackOffice
}) => {
  if (isBackOffice) {
    return (
      <div className="list-empty backoffice">
        <img src="/static/images/deals/coffee-icon.svg" />
        <div className="title">You’ve done it. Inbox zero.</div>
        <div className="descr">
          Sit back and relax. Get a coffee. We’ll notify you when a deal needs your attention.
        </div>
      </div>
    )
  }

  return (
    <div className="list-empty">
      <div className="title">You don’t have any deals yet</div>
      <div className="descr">Get started by creating a new listing or making an offer.</div>

      <div className="inline">
        <DealCreate type="listing" />
        <DealCreate type="offer" />
      </div>
    </div>
  )
}
