import React, { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory, RouteComponentProps } from 'react-router'
import { Box } from '@material-ui/core'

import { Container, Content } from 'components/SlideMenu'
import { IAppState } from 'reducers/index'
import { getRootBrand } from 'utils/user-teams'
import PageSideNav from 'components/PageSideNav'

import Acl from 'components/Acl'

import { CheckListTable } from './components/ChecklistTable'
import { ChecklistHeader } from './components/ChecklistHeader'
import {
  buyingPropertyTypes,
  SECTIONS,
  sellingPropertyTypes
} from './constants'
import { useChecklistsPage } from './use-checklist-page'

interface Props extends RouteComponentProps<any, {}> {
  user: IUser
}

export function ChecklistsPage({ user, location }: Props) {
  const dealType = location.query.deal_type
  const propertyType = location.query.property_type

  // If dealType and propertyType are not specified or are invalid, redirect
  // to the first item
  useEffect(() => {
    const isValidSellingType =
      dealType === 'Selling' && sellingPropertyTypes.includes(propertyType)
    const isValidBuyingType =
      dealType === 'Buying' && buyingPropertyTypes.includes(propertyType)

    if (!(isValidSellingType || isValidBuyingType)) {
      browserHistory.replace(SECTIONS[0].items[0].link)
    }
  }, [dealType, propertyType])

  const lastTaskNameEditorRef = useRef<any>(null)

  const rootBrand = getRootBrand(user)

  const {
    checklists,
    forms,
    formsState,
    addGenericTask,
    updateTask,
    updateChecklist,
    addGeneralCommentTask,
    addFormTask,
    deleteTask
  } = useChecklistsPage(rootBrand && rootBrand.id)

  const filteredChecklists = (checklists || []).filter(
    checklist =>
      checklist.deal_type === dealType &&
      checklist.property_type === propertyType
  )

  return (
    <Acl.Admin fallbackUrl="/dashboard/mls" accessControlPolicy="Root">
      <Helmet>
        <title>Checklists</title>
      </Helmet>
      <Container isOpen>
        <PageSideNav isOpen sections={SECTIONS} />

        <Content>
          <Box m={3}>
            {filteredChecklists.map(checklist => (
              <Box mb={5} key={checklist.id}>
                <ChecklistHeader
                  checklist={checklist}
                  forms={forms}
                  formsState={formsState}
                  setTerminable={value =>
                    updateChecklist({
                      ...checklist,
                      is_terminatable: value
                    })
                  }
                  setDeactivatable={value =>
                    updateChecklist({
                      ...checklist,
                      is_deactivatable: value
                    })
                  }
                  addGenericTask={async (...args) => {
                    await addGenericTask(...args)
                    lastTaskNameEditorRef.current!.edit()
                  }}
                  addGeneralCommentTask={addGeneralCommentTask}
                  addFormTask={addFormTask}
                  renameChecklist={title =>
                    updateChecklist({
                      ...checklist,
                      title
                    })
                  }
                />
                <Box mt={1}>
                  <CheckListTable
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    checklist={checklist}
                    lastTaskNameEditorRef={lastTaskNameEditorRef}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Content>
      </Container>
    </Acl.Admin>
  )
}

export default connect(({ user }: IAppState) => ({ user }))(ChecklistsPage)
