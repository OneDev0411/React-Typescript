import React, { FunctionComponent, useCallback } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { selectActiveFilters } from 'reducers/filter-segments'

import {
  updateActiveFilter,
  resetActiveFilters
} from 'actions/filter-segments/active-filters'

import { useGetBrandFlows } from 'hooks/use-get-brand-flows'

import { getActiveTeamId } from 'utils/user-teams'

import ToolTip from 'components/tooltip'
import {
  ListTitle,
  ListItem,
  ListItemName
} from 'components/Grid/SavedSegments/List/styled'
import { ShowMoreLess } from 'components/ShowMoreLess'
import Loader from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import IconCog from 'components/SvgIcons/Cog/IconCog'

const FILTER_DEFINITION_ID = 'flow'

interface Props {
  user: any
  onChange: () => Promise<void>
  activeFilters: StringMap<IActiveFilter>
  updateActiveFilter: (
    segmentName: string,
    filterId: string,
    filter: any
  ) => void
  resetActiveFilters: (segmentName: string) => void
}

function FlowsList(props: Props) {
  const brand = getActiveTeamId(props.user) || ''
  const { flows: brandFlows, isFetching } = useGetBrandFlows(brand)

  const isSelected = useCallback(
    (item: IBrandFlow) => {
      return (
        Object.keys(props.activeFilters).length === 1 &&
        Object.values(props.activeFilters).some(
          filter =>
            filter.id === FILTER_DEFINITION_ID &&
            filter.values &&
            filter.values.some(({ value }) => value === item.id)
        )
      )
    },
    [props.activeFilters]
  )

  const onSelect = (flow: IBrandFlow): void => {
    props.resetActiveFilters('contacts')

    props.updateActiveFilter('contacts', `flow-${flow.id}`, {
      id: 'flow',
      operator: {
        name: 'is'
      },
      values: [{ value: flow.id, label: flow.name }]
    })
    props.onChange()
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <ListTitle>
        <span>Flows</span>
        <Link to="/dashboard/account/flows">
          <ToolTip caption="Manage Flows">
            <IconCog />
          </ToolTip>
        </Link>
      </ListTitle>

      {isFetching ? (
        <ListItem>
          <Loader />
        </ListItem>
      ) : (
        <ShowMoreLess moreText="More Flows" lessText="Less Flows">
          {brandFlows.map(flow => {
            const { name, id } = flow

            return (
              <ToolTip key={id} caption={name} placement="right">
                <ListItem
                  data-test="flow-item"
                  className="item"
                  isSelected={isSelected(flow)}
                  onClick={() => onSelect(flow)}
                >
                  <ListItemName>{name}</ListItemName>
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
  { resetActiveFilters, updateActiveFilter }
)(FlowsList as FunctionComponent)
