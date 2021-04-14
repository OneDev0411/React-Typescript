import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { browserHistory, RouteComponentProps } from 'react-router'
import { Box } from '@material-ui/core'

import { PageTabs, TabLink } from 'components/PageTabs'
import { Container, Content } from 'components/SlideMenu'
import { getActiveTeamId } from 'utils/user-teams'

import Acl from 'components/Acl'

import { selectUser } from 'selectors/user'
import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'

import { CheckListTable } from './components/ChecklistTable'
import { ChecklistHeader } from './components/ChecklistHeader'
import { useChecklistsPage } from './use-checklist-page'
import { ChecklistsSidenav } from './components/ChecklistsSidenav'

import { getChecklistPageLink } from './helpers/get-checklist-page-link'

import { TabNames } from './constants'
import { PropertyTypeForm } from './components/PropertyTypeForm'

interface Props extends RouteComponentProps<any, {}> {
  user: IUser
}

export function ChecklistsPage({ location }: Props) {
  const propertyTypeId = location.query.property
  const checklistType = location.query.checklist_type

  const [isFormOpen, setIsFormOpen] = useState(false)

  const user = useSelector(selectUser)

  const lastTaskNameEditorRef = useRef<any>(null)

  const activeTeamId = getActiveTeamId(user)

  const {
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

  const { propertyTypes, reload: reloadPropertyTypes } = useBrandPropertyTypes(
    activeTeamId!
  )
  const propertyType = propertyTypes.find(item => item.id === propertyTypeId)

  const filteredChecklists = propertyType?.checklists?.filter(
    checklist =>
      checklist.brand === activeTeamId &&
      checklist.checklist_type === checklistType
  )

  useEffect(() => {
    if (!propertyTypeId && propertyTypes.length > 0) {
      browserHistory.replace(
        getChecklistPageLink(propertyTypes[0].id, TabNames[0].type)
      )
    }
  }, [propertyTypeId, propertyTypes])

  return (
    <Acl.Admin fallbackUrl="/dashboard/mls">
      <Helmet>
        <title>Checklists</title>
      </Helmet>
      <Container isOpen>
        <ChecklistsSidenav
          propertyTypes={propertyTypes}
          checklistType={checklistType}
          onClickNewProperty={() => setIsFormOpen(true)}
        />

        <Content isSideMenuOpen>
          <Box m={3}>
            <PageTabs
              defaultValue={checklistType || TabNames[0].type}
              tabs={TabNames.map((tab, index) => (
                <TabLink
                  key={index}
                  label={tab.title}
                  value={tab.type}
                  to={getChecklistPageLink(propertyTypeId, tab.type)}
                />
              ))}
            />

            {filteredChecklists?.map(checklist => (
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

        <PropertyTypeForm
          isOpen={isFormOpen}
          onCreate={() => {
            reloadPropertyTypes()
            setIsFormOpen(false)
          }}
          onClose={() => setIsFormOpen(false)}
        />
      </Container>
    </Acl.Admin>
  )
}

export default ChecklistsPage
