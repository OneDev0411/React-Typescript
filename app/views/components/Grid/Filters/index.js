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
  changeConditionOperator,
  createActiveFilters,
  createActiveFiltersWithConditionOperator,
  removeActiveFilter,
  toggleActiveFilter,
  updateActiveFilter
} from 'actions/filter-segments/active-filters'

import { ConditionOperators } from './ConditionOperators'
import { AddFilter } from './Create'
import { FilterItem } from './Item'
import { isFilterValid } from 'components/Grid/Filters/helpers/is-filter-valid'

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
      this.createFiltersFromSegment(segment, this.props.activeFilters)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.shouldReCreateFilters(nextProps)
  }

  shouldReCreateFilters = ({ segment: nextSegment, activeFilters }) => {
    const { segment } = this.props

    if (
      (!segment && nextSegment) ||
      (segment && nextSegment && segment.id !== nextSegment.id)
    ) {
      return this.createFiltersFromSegment(nextSegment, activeFilters)
    }
  }

  createFiltersFromSegment = async (segment, activeFilters) => {
    const filters = this.props.createFiltersFromSegment(
      segment.filters,
      activeFilters
    )

    let conditionOperator = 'and'

    if (segment.args && segment.args.filter_type) {
      conditionOperator = segment.args.filter_type
    }

    await this.props.createActiveFiltersWithConditionOperator(
      this.props.name,
      filters,
      conditionOperator
    )
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

    const isInvalid = !isFilterValid(activeFilters[filterId])
    const nextFilters = _.omit(activeFilters, (filter, id) => id === filterId)

    this.props.removeActiveFilter(this.props.name, filterId)

    if (!isInvalid) {
      this.onChangeFilters(nextFilters)
    }
  }

  /**
   *
   */
  onFilterChange = (id, values, operator) => {
    const current = this.props.activeFilters[id]
    const isValid = isFilterValid({ values, operator })

    this.props.updateActiveFilter(this.props.name, id, {
      values,
      operator
    })

    const nextFilters = {
      ...this.props.activeFilters,
      [id]: {
        ...this.props.activeFilters[id],
        values,
        operator
      }
    }

    if (isValid && this.isFilterChanged(current, { values, operator })) {
      this.onChangeFilters(nextFilters)
    }
  }

  isFilterChanged = (current, next) =>
    (current.values && current.values.map(({ value }) => value).join('')) !==
      (next.values && next.values.map(({ value }) => value).join('')) ||
    current.operator.name !== next.operator.name

  hasMissingValue = () =>
    _.some(this.props.activeFilters, filter => !isFilterValid(filter))

  /**
   *
   */
  findFilterById = id => this.props.config.find(filter => filter.id === id)

  /**
   *
   */
  onChangeFilters = filterItems => {
    const validFilters = _.filter(filterItems, item => isFilterValid(item))

    this.props.onChange({
      filters: this.props.createSegmentFromFilters(validFilters).filters,
      conditionOperator: this.props.conditionOperator
    })
  }

  onConditionChange = ({ value: conditionOperator }) => {
    this.props.changeConditionOperator(this.props.name, conditionOperator)

    if (_.size(this.props.activeFilters) <= 1) {
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
            isIncomplete={!isFilterValid(filter)}
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
    changeConditionOperator,
    createActiveFiltersWithConditionOperator
  }
)(Filters)

