import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'

export default ({
  deal,
  tags,
  activeTag,
  onChangeTag
}) => (
  <div className="deal-control-panel">

    <div className="deal-title">
      <i className="fa fa-angle-left" />
      <span>{ Deal.get.address(deal).substr(0, 15) }</span>
    </div>

    <ul className="deal-tags">
      {
        tags && tags
        .filter(item => item.is_tab)
        .map(item => (
          <li
            key={`TAG_${item.id}`}
            className={item.id === activeTag ? 'active' : 'inactive'}
            onClick={() => onChangeTag(item.id)}
          >
            { item.tag }
          </li>
        ))
      }
    </ul>
  </div>
)
