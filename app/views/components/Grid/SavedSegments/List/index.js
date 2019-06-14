import React from 'react'
import { connect } from 'react-redux'

import {
  getSavedSegments,
  deleteFilterSegment,
  changeActiveFilterSegment
} from 'actions/filter-segments'

import {
  isListFetched,
  selectActiveSavedSegment,
  getSegments,
  getDefaultList
} from 'reducers/filter-segments'

import LoadingIcon from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { ListTitle, ListItem } from 'components/SlideMenu/Menu/styled'
import { ShowMoreLess } from 'components/ShowMoreLess'

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

    if (!props.isListFetched) {
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

  render() {
    const { props } = this

    return (
      <div data-test="lists-list">
        <ListTitle>Lists</ListTitle>

        <ShowMoreLess
          moreText="More lists"
          lessText="Less lists"
          style={{ marginBottom: '1rem' }}
        >
          {props.list.map(item => {
            const { id } = item

            return (
              <Item
                key={id}
                isDeleting={this.state.deletingItems.includes(id)}
                item={item}
                deleteHandler={this.deleteItem}
                selectHandler={this.selectItem}
                selected={this.isSelected(id)}
              />
            )
          })}
        </ShowMoreLess>

        {props.isFetching && (
          <ListItem>
            <LoadingIcon />
          </ListItem>
        )}
      </div>
    )
  }
}

function mapStateToProps(state, { name }) {
  const { filterSegments } = state[name]

  return {
    isListFetched: isListFetched(filterSegments),
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
    getSavedSegments
  }
)(SegmentsList)
