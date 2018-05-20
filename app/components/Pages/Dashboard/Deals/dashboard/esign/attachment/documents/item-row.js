import React from 'react'
import moment from 'moment'

import Radio from '../../../../../../../../views/components/radio'

const DocumentRow = ({ isSelected, title, description, date, onToggle }) => (
  <div className="document-item" onClick={onToggle}>
    <div className="col-select">
      <Radio selected={isSelected} />
    </div>

    <div className="col-info">
      <div>
        <span className="title">{title}</span>
      </div>

      <div className="description">
        {description}&nbsp;
        {moment.unix(date).format('MMMM DD, YYYY')}
      </div>
    </div>
  </div>
)

export default DocumentRow
