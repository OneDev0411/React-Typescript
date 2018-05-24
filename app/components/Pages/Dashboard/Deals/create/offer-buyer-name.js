import React from 'react'
import cn from 'classnames'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'

export default ({ buyerName, hasError, onChangeBuyerName }) => (
  <div className="form-section buyer-name">
    <div className={cn('hero', { hasError })}>
      What is the buyer name? <span className="required">*</span>
      {hasError && <RequiredIcon />}
    </div>

    <input
      value={buyerName}
      placeholder="Type in a buyer name ..."
      onChange={e => onChangeBuyerName(e.target.value)}
    />
  </div>
)
