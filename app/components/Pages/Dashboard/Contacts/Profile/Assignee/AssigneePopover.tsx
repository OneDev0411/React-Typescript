import { useState } from 'react'

import { Popover, Box, CircularProgress, makeStyles } from '@material-ui/core'
import { useDebouncedCallback } from 'use-debounce/lib'

import TeamAgents from '@app/views/components/TeamAgents'
import { BrandedUser } from '@app/views/components/TeamAgents/types'
import { AgentsList } from '@app/views/components/TeamAgentsDrawer/List'

interface Props {
  id: string | undefined
  open: boolean
  anchorEl: HTMLElement | null
  handleClose: () => void
  handleSelect: (user: BrandedUser) => void
}

const useStyles = makeStyles(
  theme => ({
    popoverContainer: {
      width: '400px',
      height: '400px',
      padding: theme.spacing(1)
    }
  }),
  { name: 'ContactAssigneePopover' }
)

const AssigneePopover = ({
  id,
  open,
  anchorEl,
  handleClose,
  handleSelect
}: Props) => {
  const classes = useStyles()
  const [selectedAgent] = useState<BrandedUser[]>([] as BrandedUser[])
  const [searchCriteria, setSearchCriteria] = useState<string>('')
  const [debouncedSetSearchCriteria] = useDebouncedCallback(
    setSearchCriteria,
    500
  )

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <div className={classes.popoverContainer}>
        <TeamAgents
          flattenTeams={false}
          isPrimaryAgent={false}
          criteria={searchCriteria}
        >
          {({ isLoading, isEmptyState, teams }) => (
            <>
              {isLoading && (
                <Box
                  display="flex"
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CircularProgress />
                </Box>
              )}
              {isEmptyState && (
                <Box my={2} textAlign="center">
                  We could not find any agent in your brand
                </Box>
              )}
              {!isEmptyState && !isLoading && (
                <AgentsList
                  teams={teams}
                  searchCriteria={searchCriteria}
                  selectedAgents={selectedAgent}
                  multiSelection={false}
                  onSelectAgent={handleSelect}
                  onChangeCriteria={debouncedSetSearchCriteria}
                />
              )}
            </>
          )}
        </TeamAgents>
      </div>
    </Popover>
  )
}

export default AssigneePopover
