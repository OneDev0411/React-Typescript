import React from 'react'
import { connect } from 'react-redux'

import {
  getSavedSegments,
  deleteFilterSegment,
  changeActiveFilterSegment
} from '../../../../../store_actions/filter-segments'

import {
  selectActiveSavedSegment,
  getSegments,
  getDefaultList
} from '../../../../../reducers/filter-segments'

import { confirmation } from '../../../../../store_actions/confirmation'

import {
  Container,
  ListTitle,
  ListItem,
  ListItemName,
  ListIconContainer,
  Icon
} from './styled'

class SegmentsList extends React.Component {
  state = {
    isDeleting: []
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    const { getSavedSegments, isListFetched, name } = this.props

    if (isListFetched === false) {
      getSavedSegments(name)
    }
  }

  onSelectList = item => {
    const { changeActiveFilterSegment, onChange, name } = this.props

    changeActiveFilterSegment(name, item.id)

    if (onChange) {
      onChange(item)
    }
  }

  onRequestDelete = item =>
    this.props.confirmation({
      message: `Delete '${item.name}'?`,
      confirmLabel: 'Yes',
      onConfirm: () => this.deleteList(item)
    })

  deleteList = async item => {
    const { isDeleting } = this.state
    const { activeItem, name } = this.props

    this.setState({
      isDeleting: [...isDeleting, item.id]
    })

    try {
      await this.props.deleteFilterSegment(name, item)

      if (activeItem.id === item.id) {
        this.onSelectList(getDefaultList(name))
      }
    } catch (e) {
      // todo
      console.log(e)
    } finally {
      this.setState({
        isDeleting: _.without(isDeleting, item.id)
      })
    }
  }

  render() {
    const { list, activeItem, isFetching } = this.props
    const { isDeleting } = this.state
    const isSelected = id => activeItem && activeItem.id === id

    return (
      <Container>
        <ListTitle>Lists</ListTitle>

        {list.map((item, index) => (
          <ListItem
            key={index}
            isDeleting={isDeleting.includes(item.id)}
            isSelected={isSelected(item.id)}
          >
            <ListItemName
              onClick={() => !isSelected(item.id) && this.onSelectList(item)}
            >
              {item.name}
            </ListItemName>
            <ListIconContainer onClick={() => this.onRequestDelete(item)}>
              {item.editable !== false && <Icon className="fa fa-times" />}
            </ListIconContainer>
          </ListItem>
        ))}

        {isFetching && (
          <ListItem>
            <i className="fa fa-spin fa-spinner" />
          </ListItem>
        )}
      </Container>
    )
  }
}

function mapStateToProps(state, { name }) {
  const { filterSegments } = state[name]

  return {
    isListFetched: filterSegments.isListFetched,
    isFetching: filterSegments.isFetching,
    list: getSegments(filterSegments, name),
    activeItem: selectActiveSavedSegment(filterSegments, name)
  }
}

export default connect(
  mapStateToProps,
  {
    changeActiveFilterSegment,
    deleteFilterSegment,
    getSavedSegments,
    confirmation
  }
)(SegmentsList)
