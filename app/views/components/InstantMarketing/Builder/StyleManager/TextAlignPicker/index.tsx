import React, { useState } from 'react'
import { Tooltip, IconButton } from '@material-ui/core'

import IconAlignLeft from 'components/SvgIcons/AlignLeft/IconAlignLeft'
import IconAlignCenter from 'components/SvgIcons/AlignCenter/IconAlignCenter'
import IconAlignRight from 'components/SvgIcons/AlignRight/IconAlignRight'

import { useIconStyles } from '../../../../../../styles/use-icon-styles'

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
  const iconClasses = useIconStyles()
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
              size="small"
              aria-label="text-align-left"
              onClick={() => {
                handleChange('left')
              }}
            >
              <IconAlignLeft
                className={
                  innerValue.includes('left')
                    ? iconClasses.activeOnlyRootSvg
                    : ''
                }
              />
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
              <IconAlignCenter
                className={
                  innerValue.includes('center')
                    ? iconClasses.activeOnlyRootSvg
                    : ''
                }
              />
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
              <IconAlignRight
                className={
                  innerValue.includes('right')
                    ? iconClasses.activeOnlyRootSvg
                    : ''
                }
              />
            </IconButton>
          </Tooltip>
        </Column>
      </Row>
    </ItemContainer>
  )
}
