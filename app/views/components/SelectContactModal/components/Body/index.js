import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import _ from 'underscore'

import SearchInput from '../SearchInput'
import ContactItem from '../ContactItem'
import Loading from '../../../../../components/Partials/Loading'
import { getContacts } from '../../../../../models/contacts/get-contacts'
import { searchContacts } from '../../../../../models/contacts/search-contacts'
import { normalizeContactAttribute } from '../../../../../store_actions/contacts/helpers/normalize-contacts'

const ContactsListContainer = styled.div`
  position: relative;
  height: calc(100vh - 172px);
  padding: 2rem 0;
  overflow-x: hidden;
  overflow-y: scroll;

  @media screen and (min-width: 48em) {
    height: 240px;
  }
`

const ContactsList = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`

const propTypes = {
  defaultSearchFilter: PropTypes.string,
  handleSelectedItem: PropTypes.func.isRequired
}

const defaultProps = {
  defaultSearchFilter: ''
}

class Body extends Component {
  state = {
    isLoading: false,
    list: []
  }

  componentDidMount() {
    this.initializingList()
  }

  initializingList = () => {
    if (this.props.defaultSearchFilter) {
      this.search(this.props.defaultSearchFilter)
    } else {
      this.fetchInitialList()
    }
  }

  fetchInitialList = async () => {
    try {
      this.setState({ isLoading: true })

      const response = await getContacts(0, 15)

      this.setState({
        isLoading: false,
        list: normalizeContactAttribute(response)
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  search = _.debounce(async value => {
    if (!value) {
      return this.fetchInitialList()
    }

    try {
      this.setState({ isLoading: true })

      const response = await searchContacts(value)

      this.setState({
        isLoading: false,
        list: normalizeContactAttribute(response)
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }, 300)

  handleOnChange = async event => {
    // call the debounce function
    this.search(event.target.value)
  }

  handleItemToString = item => {
    if (!item) {
      return ''
    }

    const { display_name } = item

    return display_name || 'unknown'
  }

  render() {
    const { list, isLoading } = this.state
    const { defaultSearchFilter } = this.props
    const defaultInputValue =
      typeof defaultSearchFilter !== 'string' ? '' : defaultSearchFilter

    return (
      <Downshift
        itemToString={this.handleItemToString}
        defaultInputValue={defaultInputValue}
        render={({ getInputProps, getItemProps, highlightedIndex }) => (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{ padding: '0 2rem' }}>
              <SearchInput
                style={{ marginBottom: '12px' }}
                inputProps={{
                  ...getInputProps({
                    onChange: this.handleOnChange,
                    placeholder: 'Search for a contact...'
                  })
                }}
              />
            </div>
            <ContactsListContainer>
              {isLoading && <Loading />}
              {!isLoading &&
                list.length > 0 && (
                  <ContactsList className="u-scrollbar--thinner">
                    {list.map((item, index) => (
                      <ContactItem
                        item={item}
                        key={item.id || `downshift_search_result_item_${index}`}
                        {...getItemProps({ item })}
                        onClickHandler={this.props.handleSelectedItem}
                        isHighlighted={highlightedIndex === index}
                      />
                    ))}
                  </ContactsList>
                )}
            </ContactsListContainer>
          </div>
        )}
      />
    )
  }
}

Body.propTypes = propTypes
Body.defaultProps = defaultProps

export default Body
