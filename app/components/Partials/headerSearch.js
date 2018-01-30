import React from 'react'
import { Panel } from 'react-bootstrap'
import cn from 'classnames'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'

export default class HeaderSearch extends React.Component {
  constructor(props) {
    super(props)
    this.debouncedOnInputChange = debounce(props.onInputChange, 700)
    this.state = {
      inputFocused: false
    }
  }

  render() {
    const { inputFocused } = this.state
    const { placeholder } = this.props

    return (
      <Panel
        className="list--header agent"
        collapsible
        expanded={true}
        onEntered={() => this.searchInput.focus()}
      >
        <div
          className={cn('list--header--searchBox', {
            active: inputFocused
          })}
        >
          <i className="fa fa-search" aria-hidden="true" />
          <input
            onChange={event => this.debouncedOnInputChange(event.target.value)}
            onFocus={() => this.setState({ inputFocused: true })}
            onBlur={() => this.setState({ inputFocused: false })}
            ref={ref => (this.searchInput = ref)}
            type="text"
            placeholder={placeholder}
          />
        </div>
      </Panel>
    )
  }
}

HeaderSearch.propTypes = {
  onInputChange: PropTypes.func.isRequired
}

HeaderSearch.defaultProps = {
  onInputChange: () => {}
}
