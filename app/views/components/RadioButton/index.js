import React from 'react'
import Flex from 'styled-flex-component'
import styled, { css } from 'styled-components'
import { mdiRadioboxBlank, mdiRadioboxMarked } from '@mdi/js'
import { useTheme } from '@material-ui/core/styles'

import { Tooltip } from '@material-ui/core'

import { grey } from 'views/utils/colors'

import { SvgIcon } from '../SvgIcons/SvgIcon'

const LabelContainer = styled.div`
  margin-left: 0.5rem;
`
const RadioLabel = styled.div`
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `};
`
const Caption = styled.div`
  color: ${grey.A900};
  font-size: 1rem;
`

export default ({
  selected,
  title,
  tooltip = '',
  disabled = false,
  onClick = () => {},
  style = {},
  caption = ''
}) => {
  const theme = useTheme()

  return (
    <Flex justifyStart style={style} onClick={onClick}>
      <Tooltip title={tooltip}>
        <Flex alignStart style={{ cursor: 'pointer' }}>
          {selected ? (
            <SvgIcon
              path={mdiRadioboxMarked}
              color={theme.palette.primary.main}
            />
          ) : (
            <SvgIcon path={mdiRadioboxBlank} />
          )}
          <LabelContainer>
            <RadioLabel disabled={disabled}>{title}</RadioLabel>

            {caption && <Caption>{caption}</Caption>}
          </LabelContainer>
        </Flex>
      </Tooltip>
    </Flex>
  )
}
