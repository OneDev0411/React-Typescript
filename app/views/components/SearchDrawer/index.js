import React from 'react'
import Downshift from 'downshift'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import PropTypes from 'prop-types'

import { CheckBoxButton } from 'components/Button/CheckboxButton'

import Drawer from '../OverlayDrawer'
import Search from '../Grid/Search'
import Loading from '../../../components/Partials/Loading'
import Alert from '../../../components/Pages/Dashboard/Partials/Alert'

import { ResultsContainer } from './styled'

const initialState = {
  isSearching: false,
  list: [],
  error: null
}

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)

  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'red',

  // styles we need to apply on draggables
  ...draggableStyle
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'grey',
  padding: grid,
  width: 250
})

class SearchDrawer extends React.Component {
  state = initialState

  onDragEnd(result) {
    console.log(result)
  }

  handleSearch = async value => {
    if (value.length === 0) {
      return this.setState(initialState)
    }

    try {
      this.setState({
        isSearching: true,
        error: null,
        list: []
      })

      const list = await this.props.searchFunction(value)

      this.setState({
        list,
        error: list.length === 0 && {
          type: 'warning',
          message: 'No MLS Listing Found'
        }
      })
    } catch (e) {
      this.setState({
        error: {
          type: 'error',
          message: e.response ? e.response.body.message : e.message
        }
      })
    } finally {
      this.setState({
        isSearching: false
      })
    }
  }

  handleClose = () => {
    this.setState(initialState)
    this.searchInputRef.clear()

    this.props.onClose()
  }

  handleSelectItem = item => {
    this.setState(initialState)
    this.searchInputRef.clear()

    this.props.onSelectItem(item)
  }

  get List() {
    const { list } = this.state

    return this.state.isSearching || this.state.error || list.length > 0
      ? list
      : this.props.initialList
  }

  render() {
    const { isSearching, error } = this.state
    const { showLoadingIndicator, ItemRow } = this.props

    return (
      <Drawer
        isOpen={this.props.isOpen}
        showFooter={false}
        onClose={this.handleClose}
      >
        <Drawer.Header title={this.props.title} />
        <Drawer.Body style={{ overflow: 'hidden' }}>
          <Downshift
            render={({ getItemProps, highlightedIndex }) => (
              <div>
                <Search
                  {...this.props.searchInputOptions}
                  onChange={this.handleSearch}
                  isSearching={isSearching || showLoadingIndicator}
                  inputRef={ref => (this.searchInputRef = ref)}
                  style={{
                    ...this.props.searchInputOptions.style,
                    margin: '1.5rem 0'
                  }}
                />

                {(isSearching || showLoadingIndicator) && <Loading />}

                <ResultsContainer>
                  {error && (
                    <Alert
                      type={error.type === 'error' ? error.type : 'warning'}
                      message={error.message}
                    />
                  )}

                  {!showLoadingIndicator && (
                    <DragDropContext onDragEnd={this.onDragEnd}>
                      {/* <Droppable droppableId="listings-droppable">
                      </Droppable> */}

                      {this.List.map((item, index) => (
                        <ItemRow
                          key={index}
                          item={item}
                          isHighlighted={highlightedIndex === index}
                          renderCheckBox={item =>
                            this.props.multipleSelection && (
                              <CheckBoxButton
                                style={{ marginRight: '1rem' }}
                                isSelected={this.state.selectedRows[item.id]}
                                onClick={() => this.handleClickCheckbox(item)}
                              />
                            )
                          }
                          {...getItemProps({
                            item,
                            onClick: () => this.handleSelectItem(item)
                          })}
                        />
                      ))}
                    </DragDropContext>
                  )}
                </ResultsContainer>
              </div>
            )}
          />
        </Drawer.Body>
      </Drawer>
    )
  }
}

SearchDrawer.defaultProps = {
  showLoadingIndicator: false,
  searchInputOptions: {},
  initialList: []
}

SearchDrawer.propTypes = {
  showLoadingIndicator: PropTypes.bool,
  searchInputOptions: PropTypes.object,
  searchFunction: PropTypes.func.isRequired,
  ItemRow: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  onSelectItem: PropTypes.func.isRequired,
  initialList: PropTypes.array
}

export default SearchDrawer
