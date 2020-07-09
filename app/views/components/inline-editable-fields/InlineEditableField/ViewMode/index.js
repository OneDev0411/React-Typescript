import React from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'

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

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      backgroundColor: '#fff'
    }
  })
)

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
        <ButtonGroup
          aria-label="small contained button group"
          size="small"
          variant="contained"
        >
          {props.showDelete && (
            <Button onClick={props.handleDelete} className={classes.button}>
              <SvgIcon size={muiIconSizes.small} path={mdiTrashCanOutline} />
              Delete
            </Button>
          )}
          {props.showEdit && (
            <Button onClick={toggleMode} className={classes.button}>
              <SvgIcon size={muiIconSizes.small} path={mdiPencilOutline} />
              Edit
            </Button>
          )}
          {props.showAdd && (
            <Button onClick={props.handleAddNew} className={classes.button}>
              <SvgIcon size={muiIconSizes.small} path={mdiPlusCircleOutline} />
              Add
            </Button>
          )}
        </ButtonGroup>
      </ViewModeActionBar>
    </ViewModeContainer>
  )
}
