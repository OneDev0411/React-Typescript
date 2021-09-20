import { makeStyles, Typography } from '@material-ui/core'
import { mdiAlertCircleOutline } from '@mdi/js'
import classNames from 'classnames'
import { withRouter, WithRouterProps } from 'react-router'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import LinkButton from '../LinkButton'

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(1, 2),
      borderRadius: 0,
      justifyContent: 'flex-start',
      borderTopLeftRadius: `${theme.shape.borderRadius}px`,
      borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
      '&:focus, &:hover': {
        outline: 'none',
        color: theme.palette.common.black
      }
    },
    selected: {
      '&&, &:focus, &:hover': {
        cursor: 'default',
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        textDecoration: 'none'
      }
    },
    error: { color: theme.palette.error.main }
  }),
  { name: 'ShowingDetailTabSettingsSubjectListItem' }
)

interface ShowingDetailTabSettingsSubjectListItemProps extends WithRouterProps {
  label: string
  to: string
  selected: boolean
  error: boolean
}

function ShowingDetailTabSettingsSubjectListItem({
  location,
  selected,
  label,
  to,
  error
}: ShowingDetailTabSettingsSubjectListItemProps) {
  const classes = useStyles()

  return (
    <LinkButton
      className={classNames(classes.root, selected && classes.selected)}
      to={`${location.pathname}?tab=${to}`}
      endIcon={
        error && (
          <SvgIcon
            path={mdiAlertCircleOutline}
            className={!selected ? classes.error : undefined}
          />
        )
      }
      fullWidth
    >
      <Typography variant="body1" component="span">
        {label}
      </Typography>
    </LinkButton>
  )
}

export default withRouter(ShowingDetailTabSettingsSubjectListItem)
