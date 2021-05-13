import { ComponentProps, useMemo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { Box } from '@material-ui/core'

import VirtualList from 'components/VirtualList'

import Search from 'components/Grid/Search'

import { NormalizedBrand, BrandedUser } from 'components/TeamAgents/types'

import { ListRow } from '../ListRow'

import { RowType } from '../types'

interface Props {
  teams: NormalizedBrand[]
  multiSelection: boolean
  selectedAgents: BrandedUser[]
  searchCriteria: string
  onChangeCriteria: (value: string) => void
  onSelectAgent: (agent: BrandedUser) => void
}

export function AgentsList({
  teams,
  multiSelection,
  searchCriteria,
  selectedAgents = [],
  onSelectAgent,
  onChangeCriteria
}: Props) {
  const rows = useMemo(() => {
    return teams
      .filter(office => office.users.length > 0)
      .flatMap(office => {
        const agents = office.users.map((user: IUser) => {
          const isSelected =
            multiSelection && selectedAgents.some(agent => agent.id === user.id)

          return {
            type: RowType.Agent,
            user,
            office,
            isSelected,
            multiSelection
          }
        })

        const header = office.name
          ? [
              {
                type: RowType.Header,
                name: office.name,
                subtitle: office.subtitle
              }
            ]
          : []

        return [
          ...header,
          ...agents,
          {
            type: RowType.Spacer
          }
        ]
      })
  }, [teams, multiSelection, selectedAgents])

  const getRowLength = (index: number): number => {
    switch (rows[index].type) {
      case RowType.Agent:
        return 70

      case RowType.Header:
        return 60

      case RowType.Spacer:
        return 15

      default:
        return 0
    }
  }

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Search
        style={{ margin: '1rem 0' }}
        placeholder="Search for teams or agents"
        onChange={onChangeCriteria}
      />

      <Box flexGrow={1}>
        <AutoSizer>
          {({ width, height }) => (
            <VirtualList
              key={searchCriteria}
              width={width}
              height={height}
              itemCount={rows.length}
              itemData={
                {
                  rows,
                  searchCriteria,
                  onSelectAgent
                } as ComponentProps<typeof ListRow>['data']
              }
              threshold={5}
              isLoading={false}
              itemSize={getRowLength}
              overscanCount={15}
            >
              {ListRow}
            </VirtualList>
          )}
        </AutoSizer>
      </Box>
    </Box>
  )
}
