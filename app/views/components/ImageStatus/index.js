import React from 'react'
import styled from 'styled-components'

const StatusComponent = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: ${({ statusColor }) => statusColor};
  border-radius: 50%;
  bottom: 0;
  right: 0;
`

const ImageStatus = ({ statusColor }) => {
  if (!statusColor) {
    return null
  }

  return <StatusComponent statusColor={statusColor} />
}

export default ImageStatus
