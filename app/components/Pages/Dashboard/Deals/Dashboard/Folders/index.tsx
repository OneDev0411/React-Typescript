import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

import { useDeepMemo } from 'hooks/use-deep-memo'

import { selectChecklistTasks } from 'reducers/deals/tasks'

import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import { Container } from './styled'
import { ChecklistFolder } from './Checklist'

import { UploadFolder } from './Uploads'
import MarketingChecklist from './Marketing'

type Tasks = Record<UUID, IDealTask>
type Checklists = Record<UUID, IDealChecklist>

interface Props {
  deal: IDeal
  checklists: Checklists
  tasks: Tasks
  isBackOffice: boolean
}

function FoldersTab({ deal, checklists, tasks, isBackOffice }: Props) {
  const [showTerminatedFolders, setShowTerminatedFolders] = useState<boolean>(
    false
  )

  const [showDeactivatedFolders, setShowDeactivatedFolders] = useState<boolean>(
    false
  )

  useEffect(() => {
    const hasNotifications = (checklist: IDealChecklist, tasks: Tasks) => {
      return (checklist.tasks || []).some(
        id => tasks[id].room.new_notifications > 0
      )
    }

    if (showTerminatedFolders) {
      return
    }

    const showTerminatedLists = getDealChecklists(deal, checklists).some(
      (checklist: IDealChecklist) => {
        if (checklist.is_terminated && hasNotifications(checklist, tasks)) {
          return true
        }

        return false
      }
    )

    setShowTerminatedFolders(showTerminatedLists)
  }, [deal, checklists, tasks, showTerminatedFolders])

  const toggleDisplayTerminatedChecklists = () =>
    setShowTerminatedFolders(!showTerminatedFolders)

  const toggleDisplayDeactivatedChecklists = () =>
    setShowDeactivatedFolders(!showDeactivatedFolders)

  const {
    filteredChecklists,
    terminatedChecklistsCount,
    deactivatedChecklistsCount
  } = useDeepMemo(() => {
    let terminatedChecklistsCount = 0
    let deactivatedChecklistsCount = 0

    const filteredChecklists = _.chain(getDealChecklists(deal, checklists))
      .sortBy((checklist: IDealChecklist) => {
        if (checklist.is_terminated) {
          terminatedChecklistsCount += 1

          return 1000
        }

        if (checklist.is_deactivated) {
          deactivatedChecklistsCount += 1

          return 2000
        }

        return checklist.order
      })
      .filter((checklist: IDealChecklist) => {
        if (checklist.is_terminated) {
          return showTerminatedFolders
        }

        if (checklist.is_deactivated && !checklist.is_terminated) {
          return showDeactivatedFolders
        }

        return true
      })
      .value()

    return {
      filteredChecklists,
      terminatedChecklistsCount,
      deactivatedChecklistsCount
    }
  }, [checklists, deal, showDeactivatedFolders, showTerminatedFolders])

  return (
    <Container>
      {filteredChecklists.map((checklist: IDealChecklist) => (
        <ChecklistFolder
          key={checklist.id}
          checklist={checklist}
          deal={deal}
          title={checklist.title}
          isBackOffice={isBackOffice}
          tasks={selectChecklistTasks(checklist, tasks).filter(
            (task: IDealTask) =>
              ['GeneralComments', 'YardSign', 'OpenHouse', 'Media'].includes(
                task.task_type
              ) === false
          )}
        />
      ))}

      <MarketingChecklist deal={deal} isBackOffice={isBackOffice} />
      <UploadFolder deal={deal} isBackOffice={isBackOffice} />

      <Flex>
        {terminatedChecklistsCount > 0 && (
          <Button
            onClick={toggleDisplayTerminatedChecklists}
            color="secondary"
            variant="outlined"
            style={{
              marginRight: '0.5rem'
            }}
          >
            {showTerminatedFolders ? 'Hide' : 'Show'} Terminated
          </Button>
        )}

        {deactivatedChecklistsCount > 0 && (
          <Button
            onClick={toggleDisplayDeactivatedChecklists}
            color="secondary"
            variant="outlined"
          >
            {showDeactivatedFolders ? 'Hide' : 'Show'} Backed up
          </Button>
        )}
      </Flex>
    </Container>
  )
}

export default connect(({ deals }: IAppState) => ({
  checklists: deals.checklists,
  tasks: deals.tasks
}))(FoldersTab)
