import React from 'react'
import { connect } from 'react-redux'

import { uppercaseFirstLetter } from '../../../../../utils/helpers'

import {
  getSavedSegments,
  deleteFilterSegment,
  changeActiveFilterSegment
} from '../../../../../store_actions/filter-segments'

import {
  isListFetched,
  selectActiveSavedSegment,
  getSegments,
  getDefaultList
} from '../../../../../reducers/filter-segments'

import { confirmation } from '../../../../../store_actions/confirmation'
import IconClose from '../../../../../views/components/SvgIcons/Close/CloseIcon'
import {
  ListTitle,
  ListItem,
  ListItemName,
  DeleteButton
} from '../../../../../views/components/SlideMenu/Menu/styled'

import ToolTip from 'components/tooltip'

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
    this.props.changeActiveFilterSegment(this.props.name, item.id)

    if (this.props.onChange) {
      this.props.onChange(item)
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
      <div>
        <ListTitle>Lists</ListTitle>

        {list.map((item, index) => {
          const id = item.id
          let editable = true

          if (item.editable != null) {
            editable = item.editable
          }

          return (
            <ToolTip key={index} caption={item.name} placement="right">
              <ListItem
                isDeleting={isDeleting.includes(id)}
                isSelected={isSelected(id)}
              >
                <ListItemName
                  onClick={() => !isSelected(id) && this.onSelectList(item)}
                >
                  {uppercaseFirstLetter(item.name)}
                </ListItemName>
                {editable && (
                  <DeleteButton
                    onClick={() => this.onRequestDelete(item)}
                    isFit
                  >
                    <IconClose />
                  </DeleteButton>
                )}
              </ListItem>
            </ToolTip>
          )
        })}

        {isFetching && (
          <ListItem>
            <i className="fa fa-spin fa-spinner" />
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
    getSavedSegments,
    confirmation
  }
)(SegmentsList)
