import { useState } from 'react'

import { makeStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      color: theme.palette.tertiary.light,
      marginBottom: theme.spacing(2)
    },
    description: {
      color: theme.palette.tertiary.light,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.body1
      }
    }
  }),
  { name: 'Description' }
)

interface Props {
  address: string
  description: string
  officeName: Nullable<string>
  agentFullName?: string
  agentPhoneNumber?: string
  agentEmail?: string
}

function Description({
  address,
  description,
  officeName,
  agentFullName = '',
  agentPhoneNumber = '',
  agentEmail = ''
}: Props) {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const showMoreThreshold = isDesktop ? 800 : 400
  const isTooLong =
    description.length - showMoreThreshold > showMoreThreshold / 2
  const [isExpended, setIsExpended] = useState(!isTooLong)
  const handleShowMore = () => setIsExpended(state => !state)

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        {address}
      </Typography>
      <Typography variant="body2" className={classes.description}>
        {isTooLong ? (
          <>
            <span>{description.substring(0, showMoreThreshold)}</span>
            {isExpended ? (
              <span>{description.substring(showMoreThreshold)}</span>
            ) : (
              '...'
            )}
          </>
        ) : (
          description
        )}
      </Typography>
      {isTooLong && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button color="secondary" onClick={handleShowMore}>
            {isExpended ? 'Show Less' : 'Show More'}
          </Button>
        </Box>
      )}
      {officeName && (
        <Box pt={2}>
          <Typography variant="subtitle2">
            <strong>
              Listing Courtesy {agentFullName ? `of ${agentFullName}` : ''} of{' '}
              {officeName}
              <br />
              {agentPhoneNumber || agentEmail}
            </strong>
          </Typography>
        </Box>
      )}
    </>
  )
}

export default Description
