import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router'

import { uppercaseFirstLetter } from '../../../../../utils/helpers'
import { confirmation } from '../../../../../store_actions/confirmation'
import Loading from '../../../../../views/components/Spinner'
// import AlertsList from './components/AlertsList'
// import DeleteAlertModal from './components/DeleteAlertModal'

import getAlerts from '../../../../../store_actions/listings/alerts/get-alerts'
import { selectListings as selectAlerts } from '../../../../../reducers/listings'
import {
  ListItem,
  ListItemName,
  DeleteButton
} from '../../../../../views/components/SlideMenu/Menu/styled'
import Tooltip from '../../../../../views/components/tooltip'
import IconClose from '../../../../../views/components/SvgIcons/Close/CloseIcon'

class SavedSearchesList extends Component {
  state = {
    isDeleting: []
  }

  componentDidMount() {
    this.props.dispatch(getAlerts())
  }

  onSelectList = item => {
    const { changeActiveFilterSegment, onChange, name } = this.props

    changeActiveFilterSegment(name, item.id)

    if (onChange) {
      onChange(item)
    }
  }

  onRequestDelete = item =>
    this.props.dispatch(
      confirmation({
        message: `Delete '${item.title}'?`,
        confirmLabel: 'Yes',
        onConfirm: () => this.deleteItem(item)
      })
    )

  deleteItem = item => {
    console.log(item)
  }

  render() {
    const { isDeleting } = this.state

    return (
      <div>
        <div style={{ fontWeight: 500, marginBottom: '1em' }}>
          Saved Searches
        </div>

        {this.props.isFetching ? (
          <Loading size="small" />
        ) : (
          this.props.list.data.map((item, index) => {
            const id = item.id

            return (
              <Tooltip
                key={index}
                caption={item.title.length > 13 ? item.title : ''}
                placement="top"
              >
                <Link to={`/dashboard/mls/saved-searches/${id}`}>
                  <ListItem
                    isDeleting={isDeleting}
                    isSelected={this.props.params.alertId === id}
                  >
                    <ListItemName>
                      {uppercaseFirstLetter(item.title || '')}
                    </ListItemName>
                    <DeleteButton
                      isFit
                      onClick={() => this.onRequestDelete(item)}
                    >
                      <IconClose />
                    </DeleteButton>
                  </ListItem>
                </Link>
              </Tooltip>
            )
          })
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { list } = state.alerts

  return {
    isFetching: list.isFetching,
    list: { data: selectAlerts(list), info: list.info }
  }
}

export default withRouter(connect(mapStateToProps)(SavedSearchesList))
