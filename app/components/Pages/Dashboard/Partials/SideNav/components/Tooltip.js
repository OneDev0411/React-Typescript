import React from 'react'
import styled from 'styled-components'

import ToolTip from '../../../../../../views/components/tooltip'

const Box = styled.div`
  position: relative;
  padding: 4px 8px;
  border-radius: 3px;
  backdrop-filter: blur(15px);
  background-color: #ffffff;
  opacity: 1;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);

  &:after {
    height: 0;
    width: 0;
    position: absolute;
    right: 100%;
    top: 50%;
    content: '';
    pointer-events: none;
    border: solid transparent;
    border-color: rgba(70, 90, 113, 0);
    border-right-color: #fff;
    border-width: 8px;
    margin-top: -8px;
  }
`

const Title = styled.div`
  font-size: 16px;
  line-height: 24px;
  font-family: 'Barlow', sans-serif;
  font-weight: 600;
  color: #000;
`

export const SideNavTooltip = ({ label, children }) => (
  <ToolTip
    caption={
      <Box>
        <Title>{label}</Title>
      </Box>
    }
    captionIsHTML
    placement="right"
  >
    {children}
  </ToolTip>
)
