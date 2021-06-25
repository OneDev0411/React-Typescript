import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import _ from 'underscore'

import { Box, Button, Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import { useDeepMemo } from 'hooks/use-deep-memo'

import { selectChecklistTasks } from 'reducers/deals/tasks'

import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import { ChecklistFolder } from './Checklist'

import { UploadFolder } from './Uploads'
import MarketingChecklist from './Marketing'

type Tasks = Record<UUID, IDealTask>
type Checklists = Record<UUID, IDealChecklist>

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export default function FoldersTab({ deal, isBackOffice }: Props) {
  const theme = useTheme<Theme>()

  const { tasks, checklists } = useSelector<
    IAppState,
    {
      tasks: Tasks
      checklists: Checklists
    }
  >(({ deals }) => ({
    tasks: deals.tasks,
    checklists: deals.checklists
  }))

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
    <Box display="flex" flexDirection="column" mb={10}>
      {filteredChecklists.map((checklist: IDealChecklist) => (
        <ChecklistFolder
          key={checklist.id}
          checklist={checklist}
          deal={deal}
          title={checklist.title}
          isBackOffice={isBackOffice}
          tasks={selectChecklistTasks(checklist, tasks).filter(
            (task: IDealTask) =>
              ['YardSign', 'OpenHouse', 'Media'].includes(task.task_type) ===
              false
          )}
        />
      ))}

      <MarketingChecklist deal={deal} isBackOffice={isBackOffice} />
      <UploadFolder deal={deal} />

      <Box display="flex">
        {terminatedChecklistsCount > 0 && (
          <Button
            onClick={toggleDisplayTerminatedChecklists}
            color="secondary"
            variant="outlined"
            style={{
              marginRight: theme.spacing(1)
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
      </Box>
    </Box>
  )
}
