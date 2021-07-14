import React from 'react'

import Flex from 'styled-flex-component'

import Spinner from 'components/Spinner'

import UploadManager from '../../../../UploadManager'
import FactsheetsNav from '../../../FactsheetsNav'
import Folders from '../../../Folders'
import { FactsheetContainer, MainContainer } from '../../styled'

interface Props {
  deal: IDeal
  isBackOffice: boolean
  isFetchingContexts: boolean
  isFetchingChecklists: boolean
}

export default function FoldersPane(props: Props) {
  return (
    <UploadManager deal={props.deal} preventDropOnDocument={false} disableClick>
      <div>
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
      </div>
    </UploadManager>
  )
}
