import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'

import { uppercaseFirstLetter } from 'utils/helpers'

import {
  getSavedSegments,
  deleteFilterSegment,
  changeActiveFilterSegment
} from 'actions/filter-segments'
import { confirmation } from 'actions/confirmation'

import {
  isListFetched,
  selectActiveSavedSegment,
  getSegments,
  getDefaultList
} from 'reducers/filter-segments'

import ToolTip from 'components/tooltip'
import IconClose from 'components/SvgIcons/Close/CloseIcon'
import LoadingIcon from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import {
  ListTitle,
  ListItem,
  ListItemName,
  DeleteButton
} from 'components/SlideMenu/Menu/styled'
import { ShowMoreLess } from 'components/ShowMoreLess'

class SegmentsList extends React.Component {
  state = {
    isDeleting: []
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    const { getSavedSegments, isListFetched, name, associations } = this.props

    if (isListFetched === false) {
      getSavedSegments(name, associations)
    }
  }

  onSelectList = async item => {
    await this.props.changeActiveFilterSegment(this.props.name, item.id)

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

        <ShowMoreLess
          moreText="More lists"
          lessText="Less lists"
          style={{ marginBottom: '1rem' }}
        >
          {list.map((item, index) => {
            const id = item.id

            return (
              <ToolTip key={index} caption={item.name} placement="right">
                <ListItem
                  isDeleting={isDeleting.includes(id)}
                  isSelected={isSelected(id)}
                  onClick={() => !isSelected(id) && this.onSelectList(item)}
                >
                  <ListItemName>{uppercaseFirstLetter(item.name)}</ListItemName>
                  {item.is_editable && (
                    <DeleteButton
                      onClick={event => {
                        this.onRequestDelete(item)
                        event.stopPropagation()
                      }}
                      isFit
                    >
                      <IconClose />
                    </DeleteButton>
                  )}
                </ListItem>
              </ToolTip>
            )
          })}
        </ShowMoreLess>

        {isFetching && (
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
    getSavedSegments,
    confirmation
  }
)(SegmentsList)
