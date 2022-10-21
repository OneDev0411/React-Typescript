import React from 'react'

import { ListItem, ListItemText } from '@material-ui/core'
import { connect } from 'react-redux'

import Loading from '@app/components/Partials/Loading'
import {
  changeActiveFilterSegment,
  deleteFilterSegment,
  getSavedSegments
} from 'actions/filter-segments'
import {
  getDefaultList,
  getSegments,
  areListsFetched,
  selectActiveSavedSegment
} from 'reducers/filter-segments'

import Item from './Item'

class SegmentsList extends React.Component {
  state = {
    deletingItems: []
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    const { props } = this

    if (!props.areListsFetched) {
      props.getSavedSegments(props.name, { associations: props.associations })
    }
  }

  selectItem = async item => {
    const { props } = this

    await props.changeActiveFilterSegment(props.name, item.id)

    if (props.onChange) {
      props.onChange(item)
    }
  }

  deleteItem = async item => {
    const { name, activeItem } = this.props

    try {
      this.setState(state => ({
        deletingItems: [...state.deletingItems, item.id]
      }))

      await this.props.deleteFilterSegment(name, item)

      this.setState(state => ({
        deletingItems: state.deletingItems.filter(id => id !== item.id)
      }))

      if (activeItem == null || activeItem.id === item.id) {
        this.selectItem(getDefaultList(name))
      }
    } catch (error) {
      // todo
      console.error(error)
    }
  }

  isSelected = id => this.props.activeItem && this.props.activeItem.id === id

  getFilteredList = searchCriteria =>
    searchCriteria
      ? this.props.list.filter(item =>
          item.name
            .trim()
            .toLocaleLowerCase()
            .includes(searchCriteria.trim().toLocaleLowerCase())
        )
      : this.props.list

  render() {
    const list = this.getFilteredList(this.props.searchCriteria)

    if (!this.props.areListsFetched) {
      return (
        <ListItem>
          <ListItemText disableTypography>
            <Loading />
          </ListItemText>
        </ListItem>
      )
    }

    if (this.props.areListsFetched && list.length === 0) {
      return (
        <ListItem disabled>
          <ListItemText disableTypography>
            {this.props.list.length === 0
              ? "You don't have any list!"
              : 'No result!'}
          </ListItemText>
        </ListItem>
      )
    }

    return (
      <>
        {list.map(item => {
          return (
            <Item
              key={item.id}
              isDeleting={this.state.deletingItems.includes(item.id)}
              item={item}
              deleteHandler={this.deleteItem}
              selectHandler={this.selectItem}
              closeHandler={this.props.onClose}
              selected={this.isSelected(item.id)}
            />
          )
        })}
      </>
    )
  }
}

function mapStateToProps(state, { name, getPredefinedLists, searchCriteria }) {
  const { filterSegments } = state[name]

  const predefinedLists = getPredefinedLists(name, state, false)

  return {
    areListsFetched: areListsFetched(filterSegments),
    isFetching: filterSegments.isFetching,
    list: getSegments(filterSegments, name, predefinedLists),
    activeItem: selectActiveSavedSegment(filterSegments, name, predefinedLists),
    searchCriteria
  }
}

const ConnectedSegmentsList = connect(mapStateToProps, {
  changeActiveFilterSegment,
  deleteFilterSegment,
  getSavedSegments
})(SegmentsList)

ConnectedSegmentsList.defaultProps = {
  getPredefinedLists: name => ({ default: getDefaultList(name) })
}

export default ConnectedSegmentsList
