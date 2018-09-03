import React from 'react'
import cn from 'classnames'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'
import { H2 } from 'components/Typography/headings'

export default ({ buyerName, hasError, onChangeBuyerName }) => (
  <div className="form-section buyer-name">
    <H2 className={cn('hero', { hasError })}>
      What is the buyer name? <span className="required">*</span>
      {hasError && <RequiredIcon />}
    </H2>

    <input
      value={buyerName}
      placeholder="Type in a buyer name ..."
      onChange={e => onChangeBuyerName(e.target.value)}
    />
  </div>
)
