import React, { Fragment } from 'react'

import SideNav from './SideNav'

import { MainContainer } from './styled'
import { Card } from '../../styled'

export default function FileManagerPane({ deal }) {
  return (
    <Fragment>
      <SideNav deal={deal} />

      <MainContainer>
        <Card style={{ padding: '2rem' }}>++----+++</Card>
      </MainContainer>
    </Fragment>
  )
}
