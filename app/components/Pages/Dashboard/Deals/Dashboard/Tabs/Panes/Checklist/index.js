import React, { Fragment } from 'react'

import Checklists from '../../../Checklists'
import FactsheetSideNav from '../../components/FactsheetSideNav'

import { FactsheetContainer, MainContainer } from './styled'

export default function ChecklistPane({ deal }) {
  return (
    <Fragment>
      <FactsheetContainer>
        <FactsheetSideNav deal={deal} />
      </FactsheetContainer>

      <MainContainer>
        <Checklists deal={deal} />
      </MainContainer>
    </Fragment>
  )
}
