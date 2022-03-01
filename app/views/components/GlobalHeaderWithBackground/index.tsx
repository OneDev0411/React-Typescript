import { ReactNode } from 'react'

import { Typography, makeStyles, Theme, createStyles } from '@material-ui/core'

import useIsMobile from '@app/hooks/use-is-mobile'
import { ClassesProps } from '@app/utils/ts-utils'

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      padding: ({
        noPadding
      }: Pick<GlobalHeaderWithBackgroundProps, 'noPadding'>) =>
        noPadding ? 0 : theme.spacing(4, 5),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    title: {
      marginBottom: theme.spacing(3),
      [theme.breakpoints.up('md')]: {
        marginBottom: 0,
        marginRight: theme.spacing(1)
      }
    },
    content: {
      [theme.breakpoints.up('md')]: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }
  })

const useStyles = makeStyles(styles, { name: 'GlobalHeaderWithBackground' })

export interface GlobalHeaderWithBackgroundProps {
  title?: string
  noPadding?: boolean
  isHiddenOnMobile?: boolean
  children?: ReactNode
}

export default function GlobalHeaderWithBackground({
  title,
  children,
  isHiddenOnMobile = true,
  noPadding
}: GlobalHeaderWithBackgroundProps & ClassesProps<typeof styles>) {
  const classes = useStyles({ noPadding })
  const isMobile = useIsMobile()

  if (isHiddenOnMobile && isMobile) {
    return null
  }

  return (
    <div className={classes.wrapper}>
      <div>
        {title && (
          <Typography variant="h4" noWrap className={classes.title}>
            {title}
          </Typography>
        )}
      </div>
      {children && <div className={classes.content}>{children}</div>}
    </div>
  )
}
