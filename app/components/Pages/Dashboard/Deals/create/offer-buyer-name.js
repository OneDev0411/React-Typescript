import React from 'react'

export default ({ buyerName, onChangeBuyerName }) => (
  <div className="form-section buyer-name">
    <div className="hero">
      What is the buyer name? <span className="required">*</span>
    </div>

    <input
      value={buyerName}
      placeholder="Type in a buyer name ..."
      onChange={e => onChangeBuyerName(e.target.value)}
    />
  </div>
)
