import React from 'react'

export default ({
  goBackHandler
}) => (
  <div className="header">
    <div>
      <h4
        onClick={goBackHandler}
        style={{ cursor: 'pointer' }}
      >
        <i className="fa fa-angle-left" />
        All Contacts
      </h4>
    </div>
  </div>
)
