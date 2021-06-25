import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, browserHistory } from 'react-router'

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

import { mdiChevronDown, mdiChevronUp, mdiClose } from '@mdi/js'

import { BaseDropdownWithMore } from 'components/BaseDropdownWithMore'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { uppercaseFirstLetter } from '../../../../../utils/helpers'
import { confirmation } from '../../../../../store_actions/confirmation'
import Loading from '../../../../../views/components/Spinner'

import getAlerts from '../../../../../store_actions/listings/alerts/get-alerts'
import deleteAlert from '../../../../../store_actions/listings/alerts/delete-alert'
import { selectListings as selectAlerts } from '../../../../../reducers/listings'

const styles = theme => ({
  savedSearchItem: {
    padding: theme.spacing(0, 4, 0, 1.5),

    '&:hover': {
      color: theme.palette.primary,
      backgroundColor: theme.palette.grey['50']
    },
    '&:hover $savedSearchText': {
      color: theme.palette.secondary.main
    }
  },
  savedSearchText: {
    color: theme.palette.tertiary.dark
  }
})

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
        const { location } = this.props

        // Based on the discussion at https://gitlab.com/rechat/web/-/issues/3922#note_303236379
        // if we are on the same saved-search page which we're deleting it, we redirect user to
        // MLS' default page, otherwise we're staying where we are.
        if (location.pathname.includes(Item.id)) {
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
    const { classes, theme } = this.props

    return (
      <BaseDropdownWithMore
        className={classes.dropdown}
        renderDropdownButton={props => (
          <span {...props}>
            Saved Searches{' '}
            {props.isActive ? (
              <SvgIcon
                path={mdiChevronUp}
                style={{ verticalAlign: 'middle' }}
              />
            ) : (
              <SvgIcon
                path={mdiChevronDown}
                style={{ verticalAlign: 'middle' }}
              />
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

          if (!this.props.list.data.length) {
            return (
              <ListItem>
                <ListItemText primary="No saved filters." />
              </ListItem>
            )
          }

          return this.props.list.data.map((item, index) => {
            const id = item.id

            return (
              <ListItem
                key={`SSL-${index}`}
                disableGutters
                className={classes.savedSearchItem}
              >
                <ListItemText
                  primary={uppercaseFirstLetter(
                    item.title || 'Untitled Search'
                  )}
                  style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textOverflow: 'ellipsis'
                  }}
                  onClick={() => this.navigateToSavedItem(id)}
                  className={classes.savedSearchText}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={() => this.onRequestDelete(item)}
                    edge="end"
                    aria-label="delete"
                  >
                    <SvgIcon path={mdiClose} size={muiIconSizes.small} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })
        }}
        morePlugin={{ textStyle: { padding: theme.spacing(1, 1.5) } }}
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

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps)(SavedSearchesList))
)
