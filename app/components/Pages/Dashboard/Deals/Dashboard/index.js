import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { useLoadFullDeal } from 'hooks/use-load-deal'

import { isBackOffice } from 'utils/user-teams'
import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'

import { ActionContextProvider } from '../contexts/actions-context/provider'

import { getDealTitle } from '../utils/get-deal-title'

import { PageHeader } from './Header'

import TabSections from './Tabs'
import TaskView from './TaskView'

import UploadPrompt from '../UploadManager/prompt'
import { TaskActions } from '../components/TaskActions'

import { DealContainer, PageWrapper } from './styled'

function DealDetails(props) {
  const [activeTab, setActiveTab] = useState(props.params.tab || 'checklists')
  const { isFetchingDeal, isFetchingContexts } = useLoadFullDeal(
    props.params.id
  )

  if (!props.deal) {
    return false
  }

  const getPageTitle = () => {
    const pageTitle = getDealTitle(props.deal)

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
          <PageHeader deal={props.deal} isBackOffice={props.isBackOffice} />

          <TabSections
            deal={props.deal}
            user={props.user}
            activeTab={activeTab}
            onChangeTab={tab => setActiveTab(tab.id)}
            isBackOffice={props.isBackOffice}
            isFetchingChecklists={isFetchingDeal}
            isFetchingContexts={isFetchingContexts}
          />

          <TaskActions deal={props.deal} />
        </ActionContextProvider>

        <TaskView
          deal={props.deal}
          task={props.selectedTask}
          isOpen={props.selectedTask !== null}
          isBackOffice={props.isBackOffice}
        />
      </PageWrapper>

      <UploadPrompt deal={props.deal} />
    </DealContainer>
  )
}

function mapStateToProps({ deals, user }, { params }) {
  const { selectedTask } = deals.properties

  return {
    user,
    deal: selectDealById(deals.list, params.id),
    selectedTask: selectTaskById(deals.tasks, selectedTask && selectedTask.id),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps)(DealDetails)
