import React, { Fragment } from 'react'

import Spinner from 'components/Spinner'

import Checklists from '../../../Checklists'
import FactsheetSideNav from '../../components/FactsheetSideNav'

import { FactsheetContainer, MainContainer } from '../../styled'

export default function ChecklistPane(props) {
  return (
    <Fragment>
      <FactsheetContainer>
        <FactsheetSideNav deal={props.deal} isBackOffice={props.isBackOffice} />
      </FactsheetContainer>

      <MainContainer>
        {props.isFetchingChecklists ? (
          <Spinner />
        ) : (
          <Checklists deal={props.deal} isBackOffice={props.isBackOffice} />
        )}
      </MainContainer>
    </Fragment>
  )
}
