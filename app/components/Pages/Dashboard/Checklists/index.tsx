import React, { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { browserHistory, RouteComponentProps } from 'react-router'
import { Box } from '@material-ui/core'

import { Container, Content } from 'components/SlideMenu'
import { IAppState } from 'reducers'
import { getActiveTeamId } from 'utils/user-teams'

import Acl from 'components/Acl'

import { CheckListTable } from './components/ChecklistTable'
import { ChecklistHeader } from './components/ChecklistHeader'
import { buyingPropertyTypes, sellingPropertyTypes } from './constants'
import { useChecklistsPage } from './use-checklist-page'
import { ChecklistsSidenav } from './components/ChecklistsSidenav'
import { getChecklistPageLink } from './helpers/get-checklist-page-link'

interface Props extends RouteComponentProps<any, {}> {
  user: IUser
}

export function ChecklistsPage({ location }: Props) {
  const dealType = location.query.deal_type
  const propertyType = location.query.property_type

  const user = useSelector<IAppState, IUser>(({ user }) => user)

  // If dealType and propertyType are not specified or are invalid, redirect
  // to the first item
  useEffect(() => {
    const isValidSellingType =
      dealType === 'Selling' && sellingPropertyTypes.includes(propertyType)
    const isValidBuyingType =
      dealType === 'Buying' && buyingPropertyTypes.includes(propertyType)

    if (!(isValidSellingType || isValidBuyingType)) {
      browserHistory.replace(
        getChecklistPageLink(sellingPropertyTypes[0], 'Selling')
      )
    }
  }, [dealType, propertyType])

  const lastTaskNameEditorRef = useRef<any>(null)

  const activeTeamId = getActiveTeamId(user)

  const {
    checklists,
    forms,
    formsState,
    addGenericTask,
    updateTask,
    updateChecklist,
    addGeneralCommentTask,
    addFormTask,
    deleteTask,
    reorderTasks
  } = useChecklistsPage(activeTeamId)

  const filteredChecklists = (checklists || []).filter(
    checklist =>
      checklist.deal_type === dealType &&
      checklist.property_type === propertyType
  )

  return (
    <Acl.Admin fallbackUrl="/dashboard/mls">
      <Helmet>
        <title>Checklists</title>
      </Helmet>
      <Container isOpen>
        <ChecklistsSidenav />
        <Content isSideMenuOpen>
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
                  addGeneralCommentTask={async (...args) => {
                    await addGeneralCommentTask(...args)
                    lastTaskNameEditorRef.current!.edit()
                  }}
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
                    onReorderTasks={tasks => reorderTasks(checklist.id, tasks)}
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

export default ChecklistsPage
