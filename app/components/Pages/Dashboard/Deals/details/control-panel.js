import React from 'react'
import Deal from '../../../../../models/Deal'

export default ({
  deal
}) => (
  <div className="deal-control-panel">

    <div className="deal-title">
      <i className="fa fa-angle-left" />
      <span>{ Deal.get.address(deal).substr(0, 15) }</span>
    </div>

    <ul className="deal-tags">
      <li>Listing</li>
      <li>Marketing</li>
      <li>Contact</li>
      <li>Upload</li>
    </ul>
  </div>
)
