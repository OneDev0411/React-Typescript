import React, { CSSProperties } from 'react'
import { Typography } from '@material-ui/core'
import { Variant } from '@material-ui/core/styles/createTypography'

import { Checkbox } from 'components/Checkbox'

interface Props {
  title: string
  selected: boolean
  onChange: () => void
  typographyVariant?: Variant
  style?: CSSProperties
}

export default function MemberRow({
  title,
  selected,
  onChange,
  typographyVariant = 'body2',
  style = {}
}: Props) {
  return (
    <Checkbox
      checked={selected}
      onChange={onChange}
      containerStyle={{
        marginBottom: '1rem',
        ...style
      }}
    >
      <Typography variant={typographyVariant}>{title}</Typography>
    </Checkbox>
  )
}
