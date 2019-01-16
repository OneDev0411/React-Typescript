import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import _ from 'underscore'

import {
  selectActiveFilters,
  selectActiveSavedSegment
} from 'reducers/filter-segments'

import {
  addActiveFilter,
  createActiveFilters,
  removeActiveFilter,
  toggleActiveFilter,
  updateActiveFilter,
  changeConditionOperator
} from 'actions/filter-segments/active-filters'

import { ConditionOperators } from './ConditionOperators'
import { AddFilter } from './Create'
import { FilterItem } from './Item'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1.5em;
  padding: 0 1.5em;
`

class Filters extends React.Component {
  componentDidMount() {
    const { segment } = this.props

    if (segment) {
      this.createFiltersFromSegment(segment)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.shouldReCreateFilters(nextProps)
  }

  shouldReCreateFilters = ({ segment: nextSegment }) => {
    const { segment } = this.props

    if (segment && nextSegment && segment.id !== nextSegment.id) {
      return this.createFiltersFromSegment(nextSegment)
    }
  }

  createFiltersFromSegment = segment => {
    const activeFilters = this.props.createFiltersFromSegment(segment.filters)

    this.props.createActiveFilters(this.props.name, activeFilters)
  }

  /**
   *
   */
  createFilter = ({ id }) => {
    this.props.addActiveFilter(this.props.name, id)
  }

  /**
   *
   */
  toggleFilterActive = id => {
    this.props.toggleActiveFilter(this.props.name, id)
  }

  /**
   *
   */
  removeFilter = filterId => {
    const { activeFilters } = this.props

    const isIncompleteFilter = activeFilters[filterId].isIncomplete === true
    const nextFilters = _.omit(activeFilters, (filter, id) => id === filterId)

    this.props.removeActiveFilter(this.props.name, filterId)

    if (!isIncompleteFilter) {
      this.onChangeFilters(nextFilters)
    }
  }

  /**
   *
   */
  onFilterChange = (id, values, operator) => {
    const current = this.props.activeFilters[id]
    const isCompleted = this.isFilterCompleted({ values, operator })

    this.props.updateActiveFilter(this.props.name, id, {
      isIncomplete: !isCompleted,
      values,
      operator
    })

    const nextFilters = {
      ...this.props.activeFilters,
      [id]: {
        ...this.props.activeFilters[id],
        isIncomplete: !isCompleted,
        values,
        operator
      }
    }

    if (isCompleted && this.isFilterChanged(current, { values, operator })) {
      this.onChangeFilters(nextFilters)
    }
  }

  isFilterChanged = (current, next) =>
    (current.values && current.values.join('')) !==
      (next.values && next.values.join('')) ||
    current.operator.name !== next.operator.name

  hasMissingValue = () =>
    _.some(this.props.activeFilters, filter => filter.isIncomplete)

  isFilterCompleted = filter =>
    filter.operator && filter.values && filter.values.length > 0

  /**
   *
   */
  findFilterById = id => this.props.config.find(filter => filter.id === id)

  /**
   *
   */
  onChangeFilters = filterItems => {
    const completedFilters = _.filter(
      filterItems,
      item => item.isIncomplete === false
    )

    this.props.onChange({
      filters: this.props.createSegmentFromFilters(completedFilters).filters,
      conditionOperator: this.props.conditionOperator
    })
  }

  onConditionChange = ({ value: conditionOperator }) => {
    this.props.changeConditionOperator(this.props.name, conditionOperator)

    if (_.size(this.props.activeFilters) === 0) {
      return false
    }

    this.props.onChange({
      filters: this.props.createSegmentFromFilters(this.props.activeFilters)
        .filters,
      conditionOperator
    })
  }

  render() {
    const { children, ...rest } = this.props
    const { config } = rest
    const { activeFilters } = this.props

    return (
      <Container>
        {this.props.disableConditionOperators || (
          <ConditionOperators
            selectedItem={this.props.conditionOperator}
            onChange={this.onConditionChange}
          />
        )}

        {_.map(activeFilters, (filter, id) => (
          <FilterItem
            key={id}
            {...filter}
            filterConfig={this.findFilterById(filter.id)}
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
  let states = {
    name,
    conditionOperator: state[name].filterSegments.conditionOperator,
    activeFilters: selectActiveFilters(state[name].filterSegments)
  }

  if (plugins.includes('segments')) {
    states = {
      ...states,
      segment: selectActiveSavedSegment(state[name].filterSegments, name)
    }
  }

  return states
}

export default connect(
  mapStateToProps,
  {
    addActiveFilter,
    createActiveFilters,
    removeActiveFilter,
    toggleActiveFilter,
    updateActiveFilter,
    changeConditionOperator
  }
)(Filters)
