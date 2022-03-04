import { useState } from 'react'

import { shallowEqual, useSelector } from 'react-redux'
import { useTitle } from 'react-use'

import { useLoadFullDeal } from 'hooks/use-load-deal'
import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'
import { isBackOffice as isBackOfficeUser } from 'utils/acl'

import { TaskActions } from '../components/TaskActions'
import { ActionContextProvider } from '../contexts/actions-context/provider'
import UploadPrompt from '../UploadManager/prompt'
import { getDealTitle } from '../utils/get-deal-title'

import { PageHeader } from './Header'
import { DealContainer, PageWrapper, PageBody } from './styled'
import TabSections from './Tabs'
import TaskView from './TaskView'

function DealDetails(props) {
  const [activeTab, setActiveTab] = useState(props.params.tab || 'checklists')
  const { isFetchingDeal, isFetchingBrandChecklists } = useLoadFullDeal(
    props.params.id
  )

  const { user, deal, isBackOffice, selectedTask } = useSelector(
    ({ deals, user, activeTeam = null }) => {
      const { selectedTask } = deals.properties

      return {
        user,
        deal: selectDealById(deals.list, props.params.id),
        selectedTask: selectTaskById(
          deals.tasks,
          selectedTask && selectedTask.id
        ),
        isBackOffice: isBackOfficeUser(activeTeam)
      }
    },
    shallowEqual
  )

  const getPageTitle = () => {
    const pageTitle = getDealTitle(deal)

    return pageTitle
      ? `${pageTitle} | Deals | Rechat`
      : 'Show Deal | Deals | Rechat'
  }

  useTitle(getPageTitle())

  if (!deal) {
    return null
  }

  return (
    <DealContainer>
      <PageWrapper>
        <ActionContextProvider>
          <PageHeader deal={deal} isBackOffice={isBackOffice} />

          <PageBody>
            <TabSections
              deal={deal}
              user={user}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              isBackOffice={isBackOffice}
              isFetchingChecklists={isFetchingDeal}
              isFetchingContexts={isFetchingBrandChecklists}
            />

            <TaskActions deal={deal} />
          </PageBody>
        </ActionContextProvider>

        <TaskView
          deal={deal}
          task={selectedTask}
          isOpen={selectedTask !== null}
          isBackOffice={isBackOffice}
        />
      </PageWrapper>

      <UploadPrompt deal={deal} />
    </DealContainer>
  )
}

export default DealDetails
