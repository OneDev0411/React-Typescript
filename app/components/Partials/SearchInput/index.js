import React from 'react'
import cn from 'classnames'
import SearchIcon from '../../Pages/Dashboard/Partials/Svgs/SearchIcon'

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      searchBoxFocus: false
    }
  }

  onChangeValue(value) {
    const { onChange } = this.props

    this.setState({ value })

    if (onChange) {
      onChange(value)
    }
  }

  render() {
    const { style, placeholder } = this.props
    const { value, searchBoxFocus } = this.state

    return (
      <div
        onClick={() => this.nameInput.focus()}
        className={cn('search-input', { focus: searchBoxFocus })}
        style={style}
      >
        <div className="search-icon">
          <SearchIcon />
        </div>

        <input
          onFocus={() => this.setState({ searchBoxFocus: true })}
          onBlur={() => this.setState({ searchBoxFocus: false })}
          ref={input => {
            this.nameInput = input
          }}
          className={cn('form-control filter', { active: value })}
          type="text"
          placeholder={placeholder || 'Search'}
          onChange={e => this.onChangeValue(e.target.value)}
          value={value}
        />

        {value && (
          <p onClick={() => this.onChangeValue('')} className="close-icon">
            &#215;
          </p>
        )}
      </div>
    )
  }
}
