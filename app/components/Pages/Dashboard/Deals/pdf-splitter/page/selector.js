import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import cn from 'classnames'
import Radio from '../../../../../../views/components/radio'
import { selectSplitterPage } from '../../../../../../store_actions/deals'

class PageSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: 'Custom',
      inputText: ''
    }
  }

  addPages() {
    const { selectedOption } = this.state
    const { pdfId, selectSplitterPage } = this.props

    if (selectedOption === 'All') {
      this.addAllPages()
    } else {
      this.getSelectedPages().forEach(number =>
        selectSplitterPage(pdfId, number)
      )
    }

    this.setState({
      inputText: ''
    })
  }

  addAllPages() {
    const { numPages, pdfId, selectSplitterPage } = this.props

    Array.apply(null, { length: numPages }).forEach((v, i) => {
      selectSplitterPage(pdfId, i + 1)
    })
  }

  getSelectedPages() {
    const { numPages } = this.props
    const { inputText } = this.state
    const list = inputText.trim().split(' ')

    const pages = list.map(selector => {
      if (selector.includes('-')) {
        return this.getPagesInRange(selector)
      } else if (selector.includes(',')) {
        return selector.split(',')
      } else if (this.isNumeric(selector)) {
        return [selector]
      }
    })

    return _.chain(pages)
      .flatten()
      .uniq()
      .filter(number => {
        if (!this.isNumeric(~~number) || ~~number <= 0 || ~~number > numPages) {
          return false
        }

        return true
      })
      .map(page => ~~page)
      .value()
  }

  getPagesInRange(range) {
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

  isNumeric(n) {
    /* eslint-disable no-restricted-globals */
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  render() {
    const { selectedOption, inputText } = this.state
    const buttonDisabled = selectedOption === 'Custom' && inputText.length === 0

    return (
      <div className="page-selector">
        <button
          className="btn-radio"
          onClick={() => this.setState({ selectedOption: 'All' })}
        >
          <Radio selected={selectedOption === 'All'} />
          <span>All Pages</span>
        </button>

        <button
          className="btn-radio"
          onClick={() => this.setState({ selectedOption: 'Custom' })}
        >
          <Radio selected={selectedOption === 'Custom'} />
          <span>Pages</span>
        </button>

        <input
          type="text"
          disabled={selectedOption === 'All'}
          value={inputText}
          placeholder="e.g. 1-5 or 8 11-13 or 1,2,3"
          onChange={e => this.setState({ inputText: e.target.value })}
        />
        <button
          disabled={buttonDisabled}
          className={cn('button', { disabled: buttonDisabled })}
          onClick={() => this.addPages()}
        >
          Add
        </button>
      </div>
    )
  }
}

export default connect(null, { selectSplitterPage })(PageSelector)
