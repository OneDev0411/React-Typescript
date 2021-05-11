import React from 'react'
import PropTypes from 'prop-types'
import { Box, makeStyles } from '@material-ui/core'

import {
  mdiPlusCircleOutline,
  mdiPencilOutline,
  mdiTrashCanOutline
} from '@mdi/js'

import { noop } from 'utils/helpers'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import {
  Label,
  Value,
  ViewModeContainer,
  ViewModeActionBar
} from '../../styled'

const useStyles = makeStyles(theme => ({
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background.paper,
    padding: theme.spacing(0.5),
    borderRadius: `${theme.shape.borderRadius}px`,
    boxShadow:
      '0px 0px 8px rgba(0, 0, 0, 0.25), 0px 16px 16px -8px rgba(0, 0, 0, 0.25)'
  },
  button: {
    padding: theme.spacing(0, 2),
    background: theme.palette.background.paper,
    borderRadius: `${theme.shape.borderRadius}px`,
    textAlign: 'center',
    '& svg': {
      margin: 'auto'
    },
    '&:hover': {
      background: theme.palette.action.hover
    }
  },
  buttonLabel: {
    display: 'block',
    ...theme.typography.caption
  }
}))

ViewMode.propTypes = {
  handleAddNew: PropTypes.func,
  handleDelete: PropTypes.func,
  label: PropTypes.string,
  renderBody: PropTypes.func,
  showAdd: PropTypes.bool,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  style: PropTypes.shape(),
  toggleMode: PropTypes.func.isRequired,
  value: PropTypes.string
}

ViewMode.defaultProps = {
  handleAddNew: noop,
  label: 'Label',
  renderBody: noop,
  showAdd: false,
  showEdit: true,
  showDelete: true,
  style: {},
  value: '-'
}

export function ViewMode(props) {
  const classes = useStyles()
  const { label, value, toggleMode, renderBody } = props

  return (
    <ViewModeContainer onClick={toggleMode} style={props.style}>
      {renderBody() == null ? (
        <React.Fragment>
          <Label>{label}</Label>
          <Value>{value}</Value>
        </React.Fragment>
      ) : (
        renderBody({ label, value, toggleMode })
      )}
      <ViewModeActionBar className="action-bar">
        <Box className={classes.actionContainer}>
          {props.showDelete && (
            <Box onClick={props.handleDelete} className={classes.button}>
              <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
              <span className={classes.buttonLabel}>Delete</span>
            </Box>
          )}
          {props.showEdit && (
            <Box onClick={toggleMode} className={classes.button}>
              <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
              <span className={classes.buttonLabel}>Edit</span>
            </Box>
          )}
          {props.showAdd && (
            <Box onClick={props.handleAddNew} className={classes.button}>
              <SvgIcon path={mdiPlusCircleOutline} size={muiIconSizes.small} />
              <span className={classes.buttonLabel}>Add</span>
            </Box>
          )}
        </Box>
      </ViewModeActionBar>
    </ViewModeContainer>
  )
}
