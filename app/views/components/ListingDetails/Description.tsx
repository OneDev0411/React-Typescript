import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      color: theme.palette.tertiary.light,
      marginBottom: theme.spacing(2),
      ...theme.typography.subtitle3,
      [theme.breakpoints.up('md')]: {
        ...theme.typography.h5
      }
    },
    description: {
      color: theme.palette.tertiary.light
    }
  }),
  { name: 'Description' }
)

interface Props {
  address: string
  description: string
}

function Description({ address, description }: Props) {
  const classes = useStyles()
  const showMoreThreshold = 300
  const isTooLong = description.length > showMoreThreshold
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
            Show More
          </Button>
        </Box>
      )}
    </>
  )
}

export default Description
