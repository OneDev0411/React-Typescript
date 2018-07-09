import React from 'react'
import _ from 'underscore'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Panel } from 'react-bootstrap'

export default class HeaderSearch extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onInputChange: PropTypes.func.isRequired,
    collapsible: PropTypes.bool,
    expanded: PropTypes.bool,
    debounceTime: PropTypes.number,
    inputValue: PropTypes.string
  }

  static defaultProps = {
    collapsible: true,
    disabled: false,
    expanded: true,
    debounceTime: 700,
    inputValue: ''
  }

  state = {
    inputValue: this.props.inputValue,
    isFocused: false
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !nextProps.isSearching &&
      !nextState.isFocused &&
      nextProps.inputValue !== nextState.inputValue
    ) {
      return { inputValue: nextProps.inputValue }
    }
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
    const { disabled } = this.props

    return (
      <Panel
        className="list--header no-box-shadow"
        collapsible={this.props.collapsible}
        expanded={this.props.expanded}
        onEntered={() => this.state.inputValue}
        style={{ opacity: disabled ? 0.7 : 1 }}
      >
        <div
          className={cn('list--header--searchBox', {
            active: this.state.isFocused
          })}
        >
          <i className="fa fa-search" aria-hidden="true" />
          <input
            disabled={disabled}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}
            placeholder={this.props.placeholder}
            type="text"
            value={this.state.inputValue}
            style={{ cursor: disabled ? 'not-allowed' : 'initial' }}
          />
          {this.props.isSearching && (
            <i className="fa fa-spin fa-spinner fa-2x" />
          )}
        </div>
      </Panel>
    )
  }
}
