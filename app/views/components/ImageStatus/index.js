import React from 'react'
import styled from 'styled-components'

const StatusComponent = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: ${({ statusColor }) => statusColor};
  border-radius: 50%;
  border: solid 3px #ffffff;
  bottom: -3px;
  right: -3px;
`

const ImageStatus = ({ statusColor }) => {
  if (!statusColor) {
    return null
  }

  return <StatusComponent statusColor={statusColor} />
}

export default ImageStatus
