import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter, browserHistory } from 'react-router'

import { uppercaseFirstLetter } from '../../../../../utils/helpers'
import { confirmation } from '../../../../../store_actions/confirmation'
import Loading from '../../../../../views/components/Spinner'
// import AlertsList from './components/AlertsList'
// import DeleteAlertModal from './components/DeleteAlertModal'

import getAlerts from '../../../../../store_actions/listings/alerts/get-alerts'
import deleteAlert from '../../../../../store_actions/listings/alerts/delete-alert'
import { selectListings as selectAlerts } from '../../../../../reducers/listings'
import {
  ListItem,
  ListItemName,
  DeleteButton
} from '../../../../../views/components/SlideMenu/Menu/styled'
import { Tooltip } from './Tooltip'
import IconClose from '../../../../../views/components/SvgIcons/Close/CloseIcon'

class SavedSearchesList extends Component {
  state = {
    isDeleting: null
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
        message: `Delete saved search '${item.title}'?`,
        confirmLabel: 'Yes',
        onConfirm: () => this.deleteItem(item)
      })
    )

  deleteItem = async Item => {
    try {
      this.setState({ isDeleting: true })
      await this.props.dispatch(deleteAlert(Item))
      this.setState({ isDeleting: false }, () => {
        if (this.props.list.data.length > 0) {
          browserHistory.push(
            `/dashboard/mls/saved-searches/${this.props.list.data[0].id}`
          )
        } else {
          browserHistory.push('/dashboard/mls')
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { isDeleting } = this.state

    return (
      <div>
        <div style={{ fontWeight: 500, marginBottom: '1em' }}>
          Saved Searches
        </div>

        {this.props.isFetching || isDeleting ? (
          <Loading size="small" />
        ) : (
          this.props.list.data.map((item, index) => {
            const id = item.id

            return (
              <Tooltip key={index} item={item}>
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
