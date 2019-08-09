import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'

import { selectActiveFilters } from 'reducers/filter-segments'

import {
  removeActiveFilter,
  updateActiveFilter
} from 'actions/filter-segments/active-filters'

import { useGetBrandFlows } from 'hooks/use-get-brand-flows'

import { getActiveTeamId } from 'utils/user-teams'

import ToolTip from 'components/tooltip'
import { Checkbox } from 'components/Checkbox'
import {
  ListTitle,
  ListItem,
  ListItemName
} from 'components/Grid/SavedSegments/List/styled'
import { ShowMoreLess } from 'components/ShowMoreLess'
import Loader from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { getFilteredFlows } from './get-filtered-flows'

interface Props {
  user: any
  onChange: () => Promise<void>
  activeFilters: StringMap<IActiveFilter>
  removeActiveFilter: (segmentName: string, filterId: string) => void
  updateActiveFilter: (
    segmentName: string,
    filterId: string,
    filter: any
  ) => void
}

function FlowsList(props: Props) {
  const brand = getActiveTeamId(props.user) || ''
  const { flows: brandFlows, isFetching } = useGetBrandFlows(brand)

  const filteredFlows = getFilteredFlows(props.activeFilters)

  const onSelect = (flow: IBrandFlow, selected: boolean, key: string): void => {
    if (selected) {
      props.removeActiveFilter('contacts', key)
    } else {
      props.updateActiveFilter('contacts', `flow-${flow.id}`, {
        id: 'flow',
        operator: {
          name: 'is'
        },
        values: [{ value: flow.id, label: flow.name }]
      })
    }

    props.onChange()
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <ListTitle>Flows</ListTitle>

      {isFetching ? (
        <ListItem>
          <Loader />
        </ListItem>
      ) : (
        <ShowMoreLess moreText="More tags" lessText="Less tags">
          {brandFlows.map(flow => {
            let selectedFlow
            const { name, id } = flow

            if (filteredFlows.length > 0) {
              selectedFlow = filteredFlows.find(f => f.values[0].value === id)
            }

            return (
              <ToolTip key={id} caption={name} placement="right">
                <ListItem data-test="flow-item" className="item">
                  <Checkbox
                    id={id}
                    checked={!!selectedFlow}
                    onChange={() =>
                      onSelect(
                        flow,
                        !!selectedFlow,
                        (selectedFlow && selectedFlow.key) || ''
                      )
                    }
                  >
                    <ListItemName>{name}</ListItemName>
                  </Checkbox>
                </ListItem>
              </ToolTip>
            )
          })}
        </ShowMoreLess>
      )}
    </div>
  )
}

function mapStateToProps(state: {
  user: any
  contacts: {
    filterSegments: IContactReduxFilterSegmentState
  }
}) {
  return {
    user: state.user,
    activeFilters: selectActiveFilters(state.contacts.filterSegments)
  }
}

export default connect(
  mapStateToProps,
  { removeActiveFilter, updateActiveFilter }
)(FlowsList as FunctionComponent)
