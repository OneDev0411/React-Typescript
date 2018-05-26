import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Panel } from 'react-bootstrap'

export default class HeaderSearch extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func.isRequired,
    collapsible: PropTypes.bool,
    expanded: PropTypes.bool,
    debounceTime: PropTypes.number,
    inputValue: PropTypes.string
  }

  static defaultProps = {
    collapsible: true,
    expanded: true,
    debounceTime: 700,
    inputValue: ''
  }

  state = {
    inputValue: this.props.inputValue,
    isFocused: false
  }

  debouncedOnInputChange = _.debounce(
    this.props.onInputChange,
    this.props.debounceTime
  )

  onChange = event => {
    const inputValue = event.target.value

    this.setState({ inputValue }, () => this.debouncedOnInputChange(inputValue))
  }

  onBlur = () => this.setState({ isFocused: false })
  onFocus = () => this.setState({ isFocused: true })

  render() {
    return (
      <Panel
        className="list--header no-box-shadow"
        collapsible={this.props.collapsible}
        expanded={this.props.expanded}
        onEntered={() => this.state.inputValue}
      >
        <div
          className={cn('list--header--searchBox', {
            active: this.state.isFocused
          })}
        >
          <i className="fa fa-search" aria-hidden="true" />
          <input
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}
            placeholder={this.props.placeholder}
            type="text"
            value={this.state.inputValue}
          />
          {this.props.isSearching && (
            <i className="fa fa-spin fa-spinner fa-2x" />
          )}
        </div>
      </Panel>
    )
  }
}
