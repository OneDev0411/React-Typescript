import React, { useState } from 'react'
import { Tooltip, IconButton, useTheme } from '@material-ui/core'

import {
  imageAlignLeft,
  imageAlignRight,
  imageAlignCenter
} from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ItemTitle, ItemContainer } from '../styled'
import { Row, Column } from './styled'

type Alignment = 'center' | 'left' | 'right'

interface Props {
  title?: string
  value?: Alignment
  onChange: (value: Alignment) => void
}

export default function TextFormatting({
  title = 'Alignment',
  value = 'left',
  onChange
}: Props) {
  const theme = useTheme()
  const [innerValue, setInnerValue] = useState<Alignment>(value)

  function handleChange(value: Alignment) {
    setInnerValue(value)
    onChange(value)
  }

  function getIconColor(alignment: Alignment) {
    return innerValue.includes(alignment)
      ? theme.palette.primary.main
      : 'currentColor'
  }

  return (
    <ItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <Row>
        <Column>
          <Tooltip title="Left">
            <IconButton
              size="small"
              aria-label="text-align-left"
              onClick={() => {
                handleChange('left')
              }}
            >
              <SvgIcon path={imageAlignLeft} color={getIconColor('left')} />
            </IconButton>
          </Tooltip>
        </Column>
        <Column>
          <Tooltip title="Center">
            <IconButton
              size="small"
              aria-label="text-align-center"
              onClick={() => {
                handleChange('center')
              }}
            >
              <SvgIcon path={imageAlignCenter} color={getIconColor('center')} />
            </IconButton>
          </Tooltip>
        </Column>
        <Column>
          <Tooltip title="Right">
            <IconButton
              size="small"
              aria-label="text-align-right"
              onClick={() => {
                handleChange('right')
              }}
            >
              <SvgIcon path={imageAlignRight} color={getIconColor('right')} />
            </IconButton>
          </Tooltip>
        </Column>
      </Row>
    </ItemContainer>
  )
}
