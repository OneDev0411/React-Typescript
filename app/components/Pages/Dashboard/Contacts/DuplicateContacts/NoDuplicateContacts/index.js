import React from 'react'
import styled from 'styled-components'

import { grey } from 'views/utils/colors'
import IconBuildingDaylight from 'components/SvgIcons/BuildingDaylight/IconBuildingDaylight'

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

export function NoDuplicateContacts() {
  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 105px)' }}>
      <Container center column>
        <IconBuildingDaylight />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1em' }}>
          Houston, all clear.
        </h3>
        <p style={{ color: grey.A900 }}>
          Looking good! We’ll let you know when we detect <br /> duplicate
          contacts for you to review.
        </p>
      </Container>
    </div>
  )
}
