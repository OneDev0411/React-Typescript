import { useState, useMemo } from 'react'

import { Box, Divider, TextField, Theme, useTheme } from '@material-ui/core'
import sort from 'lodash/sortBy'

import { useMatchSorter } from '@app/hooks/use-match-sorter'

import { putUserSetting } from '../../../../../../../models/user/put-user-setting'
import { isFetchingSelectedTeam } from '../../../../../../../reducers/user'
import { viewAs, getActiveTeamId } from '../../../../../../../utils/user-teams'
import Loading from '../../../../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { TeamItem } from './TeamItem'

interface SwitcherStatus {
  isSwitching: boolean
  switchedTeamId: UUID
}
interface Props {
  user: IUser
}

export function TeamsList({ user }: Props) {
  const theme = useTheme<Theme>()
  const [searchValue, setSearchValue] = useState('')
  const [switcherStatus, setSwitcherStatus] = useState<SwitcherStatus>({
    isSwitching: false,
    switchedTeamId: ''
  })

  const activeTeamId = useMemo(() => getActiveTeamId(user), [user])

  const userTeams = useMemo(() => user?.teams || [], [user?.teams])
  const results = useMatchSorter(userTeams, searchValue, ['brand.name'])

  /**
   * sorting the teams based on the given search results.
   */
  const teams = useMemo(() => {
    return sort(userTeams, team => {
      const resultIndex = results.findIndex(({ id }) => id === team.id)

      return resultIndex > -1 ? resultIndex : Infinity
    })
  }, [results, userTeams])

  const onClickTeam = async (teamId: string) => {
    setSwitcherStatus({
      isSwitching: true,
      switchedTeamId: teamId
    })

    await putUserSetting('user_filter', viewAs(user, true), teamId)

    window.location.reload()
  }

  if (isFetchingSelectedTeam(user)) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Loading />
        </Box>
        <Divider role="separator" />
      </>
    )
  }

  if (userTeams.length > 0) {
    return (
      <>
        {userTeams.length > 5 && (
          <Box my={1}>
            <TextField
              fullWidth
              size="small"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search by team name"
              InputProps={{
                style: {
                  padding: theme.spacing(0.5, 3)
                }
              }}
            />
          </Box>
        )}

        {teams.map(team => {
          const teamId = team.brand.id

          return (
            <TeamItem
              key={team.id}
              disabled={switcherStatus.isSwitching}
              isSwitching={switcherStatus.switchedTeamId === teamId}
              onClick={() => onClickTeam(teamId)}
              selected={teamId === activeTeamId}
              team={team}
              style={{
                opacity: searchValue
                  ? results.some(({ id }) => id === team.id)
                    ? 1
                    : 0.5
                  : 1
              }}
            />
          )
        })}
        <Divider role="separator" />
      </>
    )
  }

  return null
}
