import React, { useState } from 'react'
import { Tooltip, IconButton } from '@material-ui/core'

import TextAlignCenterIcon from 'components/SvgIcons/TextAlignCenter/IconTextAlignCenter'
import TextAlignRightIcon from 'components/SvgIcons/TextAlignRight/IconTextAlignRight'
import TextAlignLeftIcon from 'components/SvgIcons/TextAlignLeft/IconTextAlignLeft'

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
  const [innerValue, setInnerValue] = useState<Alignment>(value)

  function handleChange(value: Alignment) {
    setInnerValue(value)
    onChange(value)
  }

  return (
    <ItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <Row>
        <Column>
          <Tooltip title="Left">
            <IconButton
              aria-label="text-align-left"
              color={innerValue.includes('left') ? 'primary' : undefined}
              onClick={() => {
                handleChange('left')
              }}
            >
              <TextAlignLeftIcon fill="#000" size="16" />
            </IconButton>
          </Tooltip>
        </Column>
        <Column>
          <Tooltip title="Center">
            <IconButton
              aria-label="text-align-center"
              color={innerValue.includes('center') ? 'primary' : undefined}
              onClick={() => {
                handleChange('center')
              }}
            >
              <TextAlignCenterIcon fill="#000" size="16" />
            </IconButton>
          </Tooltip>
        </Column>
        <Column>
          <Tooltip title="Right">
            <IconButton
              aria-label="text-align-right"
              color={innerValue.includes('right') ? 'primary' : undefined}
              onClick={() => {
                handleChange('right')
              }}
            >
              <TextAlignRightIcon fill="#000" size="16" />
            </IconButton>
          </Tooltip>
        </Column>
      </Row>
    </ItemContainer>
  )
}
