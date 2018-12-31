import React from 'react'

import Flex from 'styled-flex-component'

import Spinner from 'components/Spinner'

import Checklists from '../../../Checklists'
import FactsheetsNav from '../../../FactsheetsNav'
import UploadManager from '../../../../UploadManager'

import { FactsheetContainer, MainContainer } from '../../styled'

export default function ChecklistPane(props) {
  return (
    <UploadManager deal={props.deal} preventDropOnDocument={false} disableClick>
      <Flex>
        <FactsheetContainer>
          <FactsheetsNav deal={props.deal} isBackOffice={props.isBackOffice} />
        </FactsheetContainer>

        <MainContainer>
          {props.isFetchingChecklists ? (
            <Spinner />
          ) : (
            <Checklists deal={props.deal} isBackOffice={props.isBackOffice} />
          )}
        </MainContainer>
      </Flex>
    </UploadManager>
  )
}
