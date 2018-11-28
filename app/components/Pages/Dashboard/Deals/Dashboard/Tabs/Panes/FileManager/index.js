import React, { Fragment } from 'react'

// import SideNav from './SideNav'
import FileManager from '../../../../FileManager'

import { MainContainer } from './styled'
import { Card } from '../../styled'

export default function FileManagerPane({ deal }) {
  return (
    <Fragment>
      {/* <SideNav deal={deal} /> */}

      <MainContainer>
        <Card style={{ padding: '2rem', minHeight: '80vh' }}>
          <FileManager deal={deal} />
        </Card>
      </MainContainer>
    </Fragment>
  )
}
