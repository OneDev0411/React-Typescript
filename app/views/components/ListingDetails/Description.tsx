import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      color: theme.palette.tertiary.light,
      marginBottom: theme.spacing(2),
      ...theme.typography.subtitle3,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h5
      }
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
  officeName: string
}

function Description({ address, description, officeName }: Props) {
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
      <h5 className={classes.title}>{address}</h5>
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
      <Box pt={2}>
        <Typography variant="body1">
          Listing Courtesy of {officeName}
        </Typography>
      </Box>
    </>
  )
}

export default Description
