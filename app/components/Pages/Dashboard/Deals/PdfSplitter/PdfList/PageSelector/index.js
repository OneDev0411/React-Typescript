import React from 'react'
import _ from 'underscore'

import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

import RadioButton from 'components/RadioButton'

export class PageSelector extends React.Component {
  state = {
    selectAll: false,
    inputText: ''
  }

  handleInputChange = e => this.setState({ inputText: e.target.value })

  handleDeselectAll = () => this.setState({ selectAll: false })

  handleSelectAll = () => this.setState({ selectAll: true })

  handleAddPages = () => {
    let list = {}

    if (this.state.selectAll) {
      list = this.AllPages
    } else {
      this.getSelectedPages().forEach(
        pageNumber =>
          (list[`${this.props.documentId}-${pageNumber}`] = {
            docId: this.props.documentId,
            pageNumber
          })
      )
    }

    this.props.onChange(list)

    this.setState({
      inputText: ''
    })
  }

  get AllPages() {
    const list = {}

    Array.apply(null, { length: this.props.pagesCount }).forEach((v, i) => {
      list[`${this.props.documentId}-${i + 1}`] = {
        docId: this.props.documentId,
        pageNumber: i + 1
      }
    })

    return list
  }

  getSelectedPages = () => {
    const { pagesCount } = this.props
    const { inputText } = this.state
    const list = inputText.trim().split(' ')

    const pages = list.map(selector => {
      if (selector.includes('-')) {
        return this.getPagesInRange(selector)
      }

      if (selector.includes(',')) {
        return selector.split(',')
      }

      if (this.isNumeric(selector)) {
        return [selector]
      }
    })

    return _.chain(pages)
      .flatten()
      .uniq()
      .filter(number => {
        if (
          !this.isNumeric(~~number) ||
          ~~number <= 0 ||
          ~~number > pagesCount
        ) {
          return false
        }

        return true
      })
      .map(page => ~~page)
      .value()
  }

  getPagesInRange = range => {
    const list = []
    const splitted = range.split('-')
    const start = ~~splitted[0]
    const end = ~~splitted[1]

    if (splitted.length !== 2 || start > end) {
      return []
    }

    for (let i = start; i <= end; i++) {
      list.push(i)
    }

    return list
  }

  /* eslint-disable no-restricted-globals */
  isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n)

  render() {
    const isButtonDisabled =
      !this.state.selectAll && this.state.inputText.length === 0

    return (
      <Flex alignCenter style={{ margin: '1rem 2rem' }}>
        <RadioButton
          onClick={this.handleSelectAll}
          caption="All Pages"
          selected={this.state.selectAll}
          style={{ marginRight: '1.5rem' }}
        />

        <RadioButton
          onClick={this.handleDeselectAll}
          caption="Pages"
          selected={!this.state.selectAll}
          style={{ marginRight: '1rem' }}
        />

        <input
          type="text"
          disabled={this.state.selectAll}
          value={this.state.inputText}
          placeholder="e.g. 1-5 or 8 11-13 or 1,2,3"
          onChange={this.handleInputChange}
          style={{
            marginRight: '0.5rem',
            height: '2rem',
            borderRadius: '3px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #d4d4d4',
            padding: '0 0.5rem'
          }}
        />

        <Button
          size="small"
          variant="outlined"
          color="secondary"
          disabled={isButtonDisabled}
          onClick={this.handleAddPages}
        >
          Add
        </Button>
      </Flex>
    )
  }
}
