import React from 'react'
import styled from 'styled-components'
import _ from 'underscore'

import { AddFilter } from './Create'
import { SaveSegment } from '../Segments/Create'
import { FilterItem } from './Item'

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

  removeFilter = id =>
    this.setState({
      activeFilters: _.omit(
        this.state.activeFilters,
        filter => filter.id === id
      )
    })

  onFilterChange = (id, filters, operator) => {
    const activeFilters = {
      ...this.state.activeFilters,
      [id]: {
        ...this.state.activeFilters[id],
        currentFilters: filters,
        currentOperator: operator
      }
    }

    this.setState({
      activeFilters
    })
  }

  findFilterByName = name =>
    this.props.config.find(filter => filter.name === name)

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

        <AddFilter config={config} onNewFilter={this.createFilter} />

        {allowSaveSegment &&
          _.size(activeFilters) > 0 && (
            <SaveSegment currentFilter={currentFilter} />
          )}
      </Container>
    )
  }
}
