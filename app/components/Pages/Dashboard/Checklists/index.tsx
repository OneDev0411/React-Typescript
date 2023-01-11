import { useEffect, useRef, useState } from 'react'

import { Box } from '@material-ui/core'
import { DropResult } from 'react-beautiful-dnd'
import { useTitle } from 'react-use'

import { DealRolesProvider } from '@app/contexts/deals-roles-definitions/provider'
import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { useNavigate } from '@app/hooks/use-navigate'
import { useSearchParams } from '@app/hooks/use-search-param'
import { RouteComponentProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { reorder } from '@app/utils/dnd-reorder'
import Acl from 'components/Acl'
import { PageTabs, TabLink } from 'components/PageTabs'
import { Container, Content } from 'components/SlideMenu'
import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'

import { ChecklistCreate } from './components/ChecklistCreate'
import { ChecklistHeader } from './components/ChecklistHeader'
import { ChecklistsSidenav } from './components/ChecklistsSidenav'
import { CheckListTable } from './components/ChecklistTable'
import { PropertyTypeForm } from './components/PropertyTypeForm'
import { TabNames } from './constants'
import { getChecklistPageLink } from './helpers/get-checklist-page-link'
import { useChecklistsPage } from './use-checklist-page'

interface Props extends RouteComponentProps<any, {}> {
  user: IUser
}

function ChecklistsPage({ location }: Props) {
  useTitle('Checklists')

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const propertyTypeId = searchParams.get('property') as UUID
  const checklistType = searchParams.get('checklist_type') as IDealChecklistType
  const [isFormOpen, setIsFormOpen] = useState(false)
  const activeBrandId = useActiveBrandId()
  const changedURL = window.location.pathname

  const lastTaskNameEditorRef = useRef<any>(null)

  const {
    forms,
    formsState,
    checklists,
    addGenericTask,
    updateTask,
    updateChecklist,
    addChecklists,
    addGeneralCommentTask,
    addSplitterTask,
    addFormTask,
    deleteTask,
    reorderTasks
  } = useChecklistsPage(activeBrandId)

  const {
    propertyTypes,
    addPropertyTypes,
    updatePropertyType,
    reorderPropertyTypes
  } = useBrandPropertyTypes(activeBrandId)

  const checklist = checklists?.find(
    checklist =>
      checklist.brand === activeBrandId &&
      checklist.property_type === propertyTypeId &&
      checklist.checklist_type === checklistType
  )

  useEffect(() => {
    if (!propertyTypeId && propertyTypes.length > 0) {
      navigate(getChecklistPageLink(propertyTypes[0].id, TabNames[0].type), {
        replace: true
      })
    }
  }, [propertyTypeId, propertyTypes, navigate])

  useEffect(() => {
    if (!propertyTypeId) {
      navigate(changedURL, { replace: true })
    }
  }, [propertyTypeId, navigate, changedURL])

  const handleCreatePropertyType = (propertyType: IDealPropertyType) => {
    addPropertyTypes(propertyType)
    addChecklists(propertyType.checklists || [])
    setIsFormOpen(false)
  }

  const onReorderPropertyTypes = (result: DropResult): void => {
    if (!result.destination) {
      return
    }

    const list = reorder<IDealPropertyType>(
      propertyTypes,
      result.source.index,
      result.destination.index
    )

    reorderPropertyTypes(list)
  }

  return (
    <Acl.Admin fallbackUrl="/dashboard/mls">
      <DealRolesProvider>
        <Container isOpen>
          <ChecklistsSidenav
            selectedPropertyType={propertyTypeId}
            propertyTypes={propertyTypes}
            checklistType={checklistType}
            onClickNewProperty={() => setIsFormOpen(true)}
            onReorder={onReorderPropertyTypes}
            onUpdate={updatePropertyType}
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

              {checklist ? (
                <Box mb={5}>
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
                    addSplitterTask={async (...args) => {
                      await addSplitterTask(...args)
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
                      onReorderTasks={tasks =>
                        reorderTasks(checklist.id, tasks)
                      }
                    />
                  </Box>
                </Box>
              ) : (
                <Box my={3}>
                  <ChecklistCreate
                    brandId={activeBrandId}
                    propertyTypeId={propertyTypeId}
                    checklistType={checklistType}
                    onCreateChecklist={checklist => addChecklists([checklist])}
                  />
                </Box>
              )}
            </Box>
          </Content>

          {isFormOpen && (
            <PropertyTypeForm
              isOpen
              onSave={handleCreatePropertyType}
              onClose={() => setIsFormOpen(false)}
            />
          )}
        </Container>
      </DealRolesProvider>
    </Acl.Admin>
  )
}

export default withRouter(ChecklistsPage)
