import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'
import classnames from 'classnames'

import { ClassesProps } from 'utils/ts-utils'

import { Logo } from './Logo'

const styles = (theme: Theme) =>
  createStyles({
    box: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      maxWidth: '40rem',
      textAlign: 'center',
      marginBottom: theme.spacing(6)
    },
    title: {
      marginBottom: theme.spacing(2)
    }
  })

export interface HeaderProps {
  classes?: ClassesProps<typeof styles>
  className?: string
  subtitle?: string
  title?: string
}

const useStyles = makeStyles(styles)

export function Header({ title, subtitle, ...props }: HeaderProps) {
  const classes = useStyles(props.classes)

  return (
    <Box className={classnames(classes.box, props.className)}>
      <Logo />
      {title && (
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
      )}
      {subtitle && <Typography variant="body1">{subtitle}</Typography>}
    </Box>
  )
}

export default Header
