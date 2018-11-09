import React from 'react'
import styled from 'styled-components'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { blue } from 'views/utils/colors'
import ToolTip from 'views/components/tooltip'

import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'

import { savedSegmentId } from 'reducers/filter-segments'

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5em;

  color: ${props => (props.isSelected ? blue.A100 : '#000')};
  font-weight: ${props => (props.isSelected ? 500 : 400)};
  cursor: ${props => (props.isSelected ? 'initial' : 'pointer')};

  &:hover {
    color: ${blue.A100};
  }
`

export const ListItemName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 0.5em;
`

class Index extends React.Component {
  isSelected = () => this.props.activeItem === 'duplicate contacts'

  onClick = () => {
    if (!this.isSelected()) {
      this.props.changeActiveFilterSegment('contacts', 'duplicate contacts')
      browserHistory.push('/dashboard/contacts/duplicate-contacts')
    }
  }

  render() {
    return (
      <ToolTip caption="Duplicate Contacts" placement="right">
        <ListItem isSelected={this.isSelected()}>
          <ListItemName onClick={this.onClick}>Duplicate Contacts</ListItemName>
        </ListItem>
      </ToolTip>
    )
  }
}

function mapStateToProps({ contacts }) {
  return {
    activeItem: savedSegmentId(contacts.filterSegments)
  }
}

export default connect(
  mapStateToProps,
  {
    changeActiveFilterSegment
  }
)(Index)
