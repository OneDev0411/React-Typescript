import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, browserHistory } from 'react-router'

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'

import { BaseDropdownWithMore } from 'components/BaseDropdownWithMore'
import IconClose from 'components/SvgIcons/Close/CloseIcon'
import ArrowUp from 'components/SvgIcons/KeyboardArrowUp/IconKeyboardArrowUp'
import ArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import { uppercaseFirstLetter } from '../../../../../utils/helpers'
import { confirmation } from '../../../../../store_actions/confirmation'
import Loading from '../../../../../views/components/Spinner'

import getAlerts from '../../../../../store_actions/listings/alerts/get-alerts'
import deleteAlert from '../../../../../store_actions/listings/alerts/delete-alert'
import { selectListings as selectAlerts } from '../../../../../reducers/listings'

class SavedSearchesList extends Component {
  state = {
    isDeleting: null
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

  navigateToSavedItem = id => {
    browserHistory.push(`/dashboard/mls/saved-searches/${id}`)
  }

  render() {
    const { isDeleting } = this.state

    return (
      <BaseDropdownWithMore
        renderDropdownButton={props => (
          <span {...props}>
            Saved Searches{' '}
            {props.isActive ? (
              <ArrowUp style={{ verticalAlign: 'middle' }} />
            ) : (
              <ArrowDown style={{ verticalAlign: 'middle' }} />
            )}
          </span>
        )}
        listPlugin={{
          dense: true,
          style: { width: 220 }
        }}
        onIsOpenChange={open => {
          if (open) {
            this.props.dispatch(getAlerts())
          }
        }}
        renderMenu={() => {
          if (this.props.isFetching || isDeleting) {
            return [
              <ListItem key="loading">
                <Loading size="small" />
              </ListItem>
            ]
          }

          return this.props.list.data.map((item, index) => {
            const id = item.id

            return (
              <ListItem key={`SSL-${index}`}>
                <ListItemText
                  primary={uppercaseFirstLetter(item.title || '')}
                  style={{ overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => this.navigateToSavedItem(id)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={() => this.onRequestDelete(item)}
                    edge="end"
                    aria-label="delete"
                  >
                    <IconClose
                      style={{ fill: 'currentColor', width: 16, height: 16 }}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })
        }}
      />
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
