import { useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

import { useLoadFullDeal } from 'hooks/use-load-deal'

import { isBackOffice as isBackOfficeUser } from 'utils/user-teams'
import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'

import { ActionContextProvider } from '../contexts/actions-context/provider'

import { getDealTitle } from '../utils/get-deal-title'

import { PageHeader } from './Header'

import TabSections from './Tabs'
import TaskView from './TaskView'

import UploadPrompt from '../UploadManager/prompt'
import { TaskActions } from '../components/TaskActions'

import { DealContainer, PageWrapper, PageBody } from './styled'

function DealDetails(props) {
  const [activeTab, setActiveTab] = useState(props.params.tab || 'checklists')
  const { isFetchingDeal, isFetchingContexts } = useLoadFullDeal(
    props.params.id
  )

  const { user, deal, isBackOffice, selectedTask } = useSelector(
    ({ deals, user }) => {
      const { selectedTask } = deals.properties

      return {
        user,
        deal: selectDealById(deals.list, props.params.id),
        selectedTask: selectTaskById(
          deals.tasks,
          selectedTask && selectedTask.id
        ),
        isBackOffice: isBackOfficeUser(user)
      }
    },
    shallowEqual
  )

  if (!deal) {
    return false
  }

  console.log(`[ x ] Rerender deal "${deal.title}" `)

  const getPageTitle = () => {
    const pageTitle = getDealTitle(deal)

    return pageTitle
      ? `${pageTitle} | Deals | Rechat`
      : 'Show Deal | Deals | Rechat'
  }

  return (
    <DealContainer>
      <Helmet>
        <title>{getPageTitle()}</title>
      </Helmet>

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
              isFetchingContexts={isFetchingContexts}
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
