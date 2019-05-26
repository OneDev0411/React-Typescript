import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

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

import { isFilterValid } from 'components/Grid/Filters/helpers/is-filter-valid'

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
    const filters = this.props.createFiltersFromSegment(segment, activeFilters)

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

  createFilter = ({ id }) => {
    this.props.addActiveFilter(this.props.name, id)
  }

  toggleFilterActive = id => {
    this.props.toggleActiveFilter(this.props.name, id)
  }

  removeFilter = async filterId => {
    const { activeFilters } = this.props

    const nextFilters = {}

    Object.keys(activeFilters)
      .filter(id => id !== filterId)
      .forEach(id => (nextFilters[id] = activeFilters[id]))

    await this.props.removeActiveFilter(this.props.name, filterId)
    this.onChangeFilters(nextFilters)
  }

  onFilterChange = async (id, values, operator) => {
    const { activeFilters } = this.props
    const current = activeFilters[id]
    const isValid = isFilterValid({ values, operator })

    await this.props.updateActiveFilter(this.props.name, id, {
      values,
      operator
    })

    const nextFilters = {
      ...activeFilters,
      [id]: {
        ...activeFilters[id],
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

  findFilterById = id => this.props.config.find(filter => filter.id === id)

  onChangeFilters = filters => {
    this.props.onChange({
      conditionOperator: this.props.conditionOperator,
      filters: Object.values(filters).filter(isFilterValid)
    })
  }

  onConditionChange = async ({ value: conditionOperator }) => {
    const { props } = this

    await props.changeConditionOperator(props.name, conditionOperator)

    if (Object.keys(props.activeFilters).length <= 1) {
      return false
    }

    props.onChange({
      filters: props.activeFilters,
      conditionOperator
    })
  }

  render() {
    const { children, ...props } = this.props
    const { activeFilters } = props

    return (
      <Container>
        {this.props.disableConditionOperators || (
          <ConditionOperators
            selectedItem={this.props.conditionOperator}
            onChange={this.onConditionChange}
          />
        )}

        {Object.keys(activeFilters).map(id => {
          const filter = activeFilters[id]

          return (
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
          )
        })}

        <AddFilter
          config={props.config}
          disabled={!Object.values(activeFilters).every(isFilterValid)}
          onNewFilter={this.createFilter}
        />

        {/*
        TODO: don't pass all props to the child. Refactor SaveSegment component
        to read required stuff from redux state instead
        */}
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            filters: activeFilters,
            ...props
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
