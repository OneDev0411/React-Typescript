import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import Fuse from 'fuse.js'

import _ from 'underscore'

import { TextInput } from 'components/Forms/TextInput'

import { List, ListItem } from './styled'

const propTypes = {
  useCache: PropTypes.bool,
  inputStyle: PropTypes.object,
  listStyle: PropTypes.object,
  input: PropTypes.object,
  meta: PropTypes.object,
  isRequired: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  defaultSelectedItem: PropTypes.string,
  resultsCount: PropTypes.number,
  debounce: PropTypes.number,
  searchConfiguration: PropTypes.object,
  inputProps: PropTypes.object,
  inputRenderer: PropTypes.func,
  itemRenderer: PropTypes.func,
  options: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      }).isRequired
    )
  ]).isRequired
}

const defaultProps = {
  useCache: true,
  inputStyle: {},
  listStyle: {},
  input: null,
  meta: null,
  isRequired: false,
  placeholder: '',
  label: '',
  defaultSelectedItem: null,
  resultsCount: 10,
  debounce: 500,
  searchConfiguration: {},
  inputProps: {},
  inputRenderer: null,
  itemRenderer: null
}

export class AutoComplete extends React.Component {
  state = {
    selectedItem: this.props.defaultSelectedItem,
    options: [],
    cache: {}
  }

  onChangeItem = item => {
    this.setState({ selectedItem: item.value })

    this.props.onSelect(item)
    this.props.input.onChange(item.value)
  }

  onInputValueChange = async value => {
    if (typeof this.props.options === 'function') {
      this.fetchOptions(value)
    }

    this.setState({ selectedItem: value })

    if (value) {
      this.props.input.onChange(value)
    }
  }

  fetchOptions = _.debounce(
    async value => {
      if (this.state.cache[value] || !value) {
        return false
      }

      try {
        const list = await this.props.options(value)

        if (!Array.isArray(list)) {
          return false
        }

        let newState = {
          options: list
        }

        if (this.props.useCache) {
          newState = {
            ...newState,
            cache: {
              ...this.state.cache,
              [value]: list
            }
          }
        }

        this.setState(newState)
      } catch (e) {
        // todo: better handling
        console.log(e)
      }
    },
    typeof this.props.options === 'function' ? this.props.debounce : 0
  )

  handleItemToString = item => (typeof item !== 'string' ? '' : item)

  getOptions = value => {
    const options =
      typeof this.props.options !== 'function' &&
      Array.isArray(this.props.options)
        ? this.props.options
        : this.state.options

    return new Fuse(options, {
      keys: ['label'],
      threshold: 0.3,
      ...this.props.searchConfiguration
    })
      .search(value)
      .slice(0, this.props.resultsCount)
  }

  render() {
    const { props, state } = this

    return (
      <Downshift
        selectedItem={state.selectedItem}
        onChange={this.onChangeItem}
        itemToString={this.handleItemToString}
        defaultSelectedItem={
          props.defaultSelectedItem || (props.input && props.input.value)
        }
        onInputValueChange={this.onInputValueChange}
        render={({
          isOpen,
          getInputProps,
          getItemProps,
          selectedItem,
          highlightedIndex,
          inputValue
        }) => (
          <div style={{ position: 'relative', ...props.style }}>
            {this.props.input ? (
              <TextInput
                meta={props.meta}
                isRequired={props.isRequired}
                placeholder={props.placeholder}
                label={props.label}
                autoComplete="dummy"
                style={this.props.inputStyle}
                {...getInputProps({ ...props.input, ...props.inputProps })}
              />
            ) : (
              <Fragment>
                {this.props.inputRenderer ? (
                  this.props.inputRenderer({
                    getInputProps,
                    inputValue,
                    placeholder: props.placeholder
                  })
                ) : (
                  <input
                    style={this.props.inputStyle}
                    placeholder={props.placeholder}
                    {...getInputProps({ ...props.inputProps })}
                  />
                )}
              </Fragment>
            )}

            {isOpen && inputValue && (
              <List style={props.listStyle}>
                {this.getOptions(inputValue).map((item, index) => {
                  const itemProps = getItemProps({
                    item,
                    isSelected: selectedItem === item,
                    isActive: highlightedIndex === index
                  })

                  return (
                    <Fragment key={index}>
                      {props.itemRenderer ? (
                        props.itemRenderer({ index, itemProps, item })
                      ) : (
                        <ListItem {...itemProps}>{item.label}</ListItem>
                      )}
                    </Fragment>
                  )
                })}
              </List>
            )}
          </div>
        )}
      />
    )
  }
}

AutoComplete.propTypes = propTypes
AutoComplete.defaultProps = defaultProps
