import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import _ from 'underscore'

import { selectActiveSavedSegment } from '../../../../reducers/filter-segments'

import { AddFilter } from './Create'
import { FilterItem } from './Item'

import createFilterCriteria from './helpers/create-filter-criteria'
import createSegmentFilters from './helpers/create-segment-filters'
import { selectDefinition } from '../../../../reducers/contacts/attributeDefs'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 2rem;
`

class Filters extends React.Component {
  state = {
    activeFilters: []
  }

  componentDidMount() {
    const { segment } = this.props

    if (segment) {
      this.createFiltersFromSegment(segment)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.shouldReCreateFilters(nextProps)
  }

  shouldReCreateFilters = ({ segment: nextSegment }) => {
    const { segment } = this.props

    if (segment && nextSegment && segment.id !== nextSegment.id) {
      return this.createFiltersFromSegment(nextSegment)
    }
  }

  createFiltersFromSegment = segment =>
    this.setState({
      activeFilters: createSegmentFilters(segment.filters)
    })

  /**
   *
   */
  createFilter = ({ id }) => {
    const uniqueId = _.uniqueId(`${id}-`)

    const activeFilters = {
      ...this.state.activeFilters,
      [uniqueId]: { id, isActive: true }
    }

    this.setState({
      activeFilters
    })
  }

  /**
   *
   */
  toggleFilterActive = id => {
    const filter = this.state.activeFilters[id]

    const activeFilters = {
      ...this.state.activeFilters,
      [id]: {
        ...filter,
        isActive: !filter.isActive
      }
    }

    this.setState({
      activeFilters
    })
  }

  /**
   *
   */
  removeFilter = filterId => {
    const { config } = this.props
    const { activeFilters } = this.state

    const isIncompleteFilter = activeFilters[filterId].isIncomplete === true
    const nextFilters = _.omit(activeFilters, (filter, id) => id === filterId)

    this.setState({
      activeFilters: nextFilters
    })

    if (!isIncompleteFilter) {
      this.props.onChange(createFilterCriteria(nextFilters, config))
    }
  }

  /**
   *
   */
  onFilterChange = (id, values, operator) => {
    const { config } = this.props

    const current = this.state.activeFilters[id]
    const isCompleted = this.isFilterCompleted({ values, operator })

    const nextFilters = {
      ...this.state.activeFilters,
      [id]: {
        ...this.state.activeFilters[id],
        isIncomplete: !isCompleted,
        values,
        operator
      }
    }

    if (isCompleted && this.isFilterChanged(current, { values, operator })) {
      this.props.onChange(createFilterCriteria(nextFilters, config))
    }

    this.setState({
      activeFilters: nextFilters
    })
  }

  isFilterChanged = (current, next) =>
    (current.values && current.values.join('')) !==
      (next.values && next.values.join('')) ||
    current.operator.name !== next.operator.name

  hasMissingValue = () =>
    _.some(this.state.activeFilters, filter => filter.isIncomplete)

  isFilterCompleted = filter =>
    filter.operator && filter.values && filter.values.length > 0

  /**
   *
   */
  findFilterById = filter => {
    const { attributeDefs } = this.props
    const filterConfig = this.props.config.find(
      tempFilter => tempFilter.id === filter.id
    )

    if (attributeDefs && filter.attribute_def) {
      const attribute = selectDefinition(attributeDefs, filter.attribute_def)

      filterConfig.serverLabel = attribute.label
    }

    return filterConfig
  }
  render() {
    const { children, attributeDefs, ...rest } = this.props
    const { config } = rest
    const { activeFilters } = this.state

    return (
      <Container>
        {_.map(activeFilters, (filter, id) => (
          <FilterItem
            key={id}
            {...filter}
            filterConfig={this.findFilterById(filter)}
            onToggleFilterActive={() => this.toggleFilterActive(id)}
            onRemove={() => this.removeFilter(id)}
            onFilterChange={(values, operator) =>
              this.onFilterChange(id, values, operator)
            }
          />
        ))}

        <AddFilter
          hasMissingValue={this.hasMissingValue()}
          config={config}
          onNewFilter={this.createFilter}
        />

        {React.Children.map(children, child =>
          React.cloneElement(child, {
            filters: activeFilters,
            ...rest
          })
        )}
      </Container>
    )
  }
}

function mapStateToProps(state, { name, plugins }) {
  const states = {}

  if (plugins.includes('segments')) {
    states.segment = selectActiveSavedSegment(state[name].filterSegments, name)
  }

  return states
}

export default connect(mapStateToProps)(Filters)
