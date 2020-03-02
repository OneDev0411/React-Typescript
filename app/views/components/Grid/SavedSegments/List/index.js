import React from 'react'
import { connect } from 'react-redux'
import { ListItem, ListItemText, withStyles } from '@material-ui/core/styles'

import {
  // eslint-disable-next-line import/named
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

import { BaseDropdownWithMore } from 'components/BaseDropdownWithMore'
import LoadingIcon from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Item from './Item'

const styles = theme => ({
  root: {
    fontSize: '1rem',
    color: theme.palette.text.secondary
  }
})

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

  render() {
    const { props } = this
    const { classes } = props

    return (
      <BaseDropdownWithMore
        buttonLabel="Saved List"
        DropdownToggleButtonProps={{
          className: classes.root
        }}
        listPlugin={{
          disablePadding: true,
          style: { width: 220 }
        }}
        renderMenu={() => {
          if (props.isFetching) {
            return [
              <ListItem dense key="loading">
                <LoadingIcon />
              </ListItem>
            ]
          }

          if (props.list.length === 0) {
            return [
              <ListItem dense key="loading">
                <ListItemText>No Saved List!</ListItemText>
              </ListItem>
            ]
          }

          return props.list.map(item => {
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
          })
        }}
      />
    )
  }
}

function mapStateToProps(state, { name, getPredefinedLists }) {
  const { filterSegments } = state[name]

  const predefinedLists = getPredefinedLists(name, state, false)

  return {
    areListsFetched: areListsFetched(filterSegments),
    isFetching: filterSegments.isFetching,
    list: getSegments(filterSegments, name, predefinedLists),
    activeItem: selectActiveSavedSegment(filterSegments, name, predefinedLists)
  }
}

const ConnectedSegmentsList = connect(
  mapStateToProps,
  {
    changeActiveFilterSegment,
    deleteFilterSegment,
    getSavedSegments
  }
)(SegmentsList)

ConnectedSegmentsList.defaultProps = {
  getPredefinedLists: name => ({ default: getDefaultList(name) })
}

export default withStyles(styles)(ConnectedSegmentsList)
