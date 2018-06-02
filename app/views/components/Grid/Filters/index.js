import React from 'react'
import styled from 'styled-components'
import _ from 'underscore'

import { AddFilter } from './Create'
import { SaveSegment } from '../Segments/Create'
import { FilterItem } from './Item'

import createFilterCriteria from './helpers/create-filter-criteria'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 15px;
`

export class Filters extends React.Component {
  state = {
    activeFilters: []
  }

  /**
   *
   */
  createFilter = ({ name }) => {
    const uniqueId = _.uniqueId(`${name}-`)

    const activeFilters = {
      ...this.state.activeFilters,
      [uniqueId]: { id: uniqueId, name, isActive: true }
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
  removeFilter = id => {
    const { config } = this.props
    const { activeFilters } = this.state

    const isIncompleteFilter = activeFilters[id].isIncomplete === true
    const nextFilters = _.omit(activeFilters, filter => filter.id === id)

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
  findFilterByName = name =>
    this.props.config.find(filter => filter.name === name)

  /**
   *
   */
  onFilterChange = (id, conditions, operator) => {
    const { config } = this.props

    const isIncomplete = !operator || conditions.length === 0

    const activeFilters = {
      ...this.state.activeFilters,
      [id]: {
        ...this.state.activeFilters[id],
        isIncomplete,
        conditions,
        operator
      }
    }

    this.setState({
      activeFilters
    })

    if (!isIncomplete) {
      this.props.onChange(createFilterCriteria(activeFilters, config))
    }
  }

  hasMissingValue = () =>
    _.some(this.state.activeFilters, filter => filter.isIncomplete)

  render() {
    const { config, allowSaveSegment, currentFilter } = this.props
    const { activeFilters } = this.state

    return (
      <Container>
        {_.map(activeFilters, (filter, id) => (
          <FilterItem
            key={id}
            {...filter}
            filterConfig={this.findFilterByName(filter.name)}
            onToggleFilterActive={() => this.toggleFilterActive(id)}
            onRemove={() => this.removeFilter(id)}
            onFilterChange={(filters, operator) =>
              this.onFilterChange(id, filters, operator)
            }
          />
        ))}

        <AddFilter
          hasMissingValue={this.hasMissingValue()}
          config={config}
          onNewFilter={this.createFilter}
        />

        {allowSaveSegment &&
          _.size(activeFilters) > 0 && (
            <SaveSegment currentFilter={currentFilter} />
          )}
      </Container>
    )
  }
}
