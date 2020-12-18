import React from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Button,
  useMediaQuery,
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  Link
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { mdiPlayCircleOutline } from '@mdi/js'

import { hasUserAccessToBrandSettings } from 'utils/user-teams'
import { IAppState } from 'reducers'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface StylesProps {
  isDesktop: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    jumbo: {
      fontSize: '2rem',
      maxWidth: '568px',
      margin: `0 0 ${theme.spacing(4)}px`,
      fontFamily: theme.typography.h1.fontFamily
    },
    coverImage: (props: StylesProps) => {
      if (props.isDesktop) {
        return {
          width: '979px',
          position: 'absolute',
          top: `${theme.spacing(2)}px`,
          right: `${theme.spacing(2)}px`
        }
      }

      return {
        maxWidth: '100%'
      }
    },
    brandSettingsAlertMessage: {
      width: '100%'
    },
    brandSettingsAlertBox: {
      width: '100%'
    }
  })
)

const getCoverSrc = (rate: number) =>
  `/static/images/marketing/my-designs/empty-state${
    rate > 0 ? `@${rate}x` : ''
  }.png`

const srcSet = `
${getCoverSrc(0)} 1x,
${getCoverSrc(2)} 2x,
${getCoverSrc(3)} 3x
`
export default function EmptyState() {
  const theme = useTheme()
  const isDesktop = useMediaQuery('(min-width:1440px)')
  const classes = useStyles({ isDesktop })
  const user = useSelector(({ user }: IAppState) => user)
  const hasAccessToBrandSettings = hasUserAccessToBrandSettings(user)

  return (
    <>
      {hasAccessToBrandSettings && (
        <Box mt={1.5}>
          <Alert
            severity="info"
            classes={{ message: classes.brandSettingsAlertMessage }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              className={classes.brandSettingsAlertBox}
            >
              <div>
                You can customize your marketing materials. Use your brand's
                custom font, logo and color.
              </div>
              <div>
                <Link href="/dashboard/brand-settings" color="secondary">
                  Setup your brand here
                </Link>
              </div>
            </Box>
          </Alert>
        </Box>
      )}
      <Box display="flex" flexDirection="column" p={7} position="relative">
        <h1 className={classes.jumbo}>
          Impress your clients with stunning designs using ready-made social &
          email templates
        </h1>
        <div>
          <Button
            color="primary"
            target="blank"
            href="https://help.rechat.com/marketing/overview"
          >
            <SvgIcon
              path={mdiPlayCircleOutline}
              rightMargined
              color={theme.palette.primary.main}
            />
            Learn More
          </Button>
        </div>
        <img alt="empty-state" className={classes.coverImage} srcSet={srcSet} />
      </Box>
    </>
  )
}
