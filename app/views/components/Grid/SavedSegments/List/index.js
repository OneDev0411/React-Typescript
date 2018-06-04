import React from 'react'
import { connect } from 'react-redux'

import { changeActiveFilterSegment } from '../../../../../store_actions/filter-segments'

import {
  selectActiveSavedSegment,
  getSavedSegments
} from '../../../../../reducers/filter-segments'

import { Container, ListTitle, ListItem, ListItemName } from './styled'

const onSelectList = (props, item) => {
  const { changeActiveFilterSegment, onChange, name } = props

  changeActiveFilterSegment(name, item.id)

  if (onChange) {
    onChange(item)
  }
}

const SegmentsList = props => {
  const { list, activeItem, isFetching } = props

  return (
    <Container>
      <ListTitle>Lists</ListTitle>

      {list.map((item, index) => (
        <ListItem
          key={index}
          isSelected={activeItem && activeItem.id === item.id}
          onClick={() => onSelectList(props, item)}
        >
          <ListItemName>{item.name}</ListItemName>
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

function mapStateToProps(state, { name }) {
  const { filterSegments } = state[name]

  return {
    isFetching: filterSegments.isFetching,
    list: getSavedSegments(filterSegments, name),
    activeItem: selectActiveSavedSegment(filterSegments, name)
  }
}

export default connect(mapStateToProps, { changeActiveFilterSegment })(
  SegmentsList
)
