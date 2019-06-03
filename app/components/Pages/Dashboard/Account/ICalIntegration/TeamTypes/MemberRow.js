import React from 'react'

import { Checkbox } from 'components/Checkbox'

const MemberRow = ({ title, selected, onChange, style = {} }) => (
  <Checkbox
    checked={selected}
    onChange={onChange}
    containerStyle={{
      margin‌Bottom: '1rem',
      ...style
    }}
  >
    {title}
  </Checkbox>
)

export default MemberRow
