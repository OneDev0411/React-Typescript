import React from 'react'

import Flex from 'styled-flex-component'

import Spinner from 'components/Spinner'

import Folders from '../../../Folders'
import FactsheetsNav from '../../../FactsheetsNav'
import UploadManager from '../../../../UploadManager'

import { FactsheetContainer, MainContainer } from '../../styled'

export default function FoldersPane(props) {
  return (
    <UploadManager deal={props.deal} preventDropOnDocument={false} disableClick>
      <Flex>
        <FactsheetContainer>
          <FactsheetsNav
            deal={props.deal}
            isBackOffice={props.isBackOffice}
            isFetchingContexts={props.isFetchingContexts}
          />
        </FactsheetContainer>

        <MainContainer>
          {props.isFetchingChecklists ? (
            <Spinner />
          ) : (
            <Folders deal={props.deal} isBackOffice={props.isBackOffice} />
          )}
        </MainContainer>
      </Flex>
    </UploadManager>
  )
}
