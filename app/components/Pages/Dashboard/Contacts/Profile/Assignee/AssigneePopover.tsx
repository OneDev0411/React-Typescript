import { useState } from 'react'

import { Popover, Box, CircularProgress, makeStyles } from '@material-ui/core'
import { useDebouncedCallback } from 'use-debounce/lib'

import TeamAgents from '@app/views/components/TeamAgents'
import { AgentsList } from '@app/views/components/TeamAgentsDrawer/List'

interface Props {
  id?: string
  open: boolean
  anchorEl: Nullable<HTMLElement>
  handleClose: () => void
  handleSelect: (user: BrandedUser) => void
}

const useStyles = makeStyles(
  theme => ({
    popoverContainer: {
      width: '400px',
      height: '400px',
      padding: theme.spacing(1),
      overflow: 'hidden'
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
  const [selectedAgent] = useState<BrandedUser[]>([])
  const [searchCriteria, setSearchCriteria] = useState('')
  const [debouncedSetSearchCriteria] = useDebouncedCallback(
    setSearchCriteria,
    500
  )

  const closePopover = () => {
    handleClose()
    setSearchCriteria('')
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={closePopover}
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
          isPrimaryAgent
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
                  onSelectAgent={user => {
                    setSearchCriteria('')
                    handleSelect(user)
                  }}
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
