import React, { useState } from 'react'
import {
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Theme,
  makeStyles
} from '@material-ui/core'
import cn from 'classnames'
import { mdiMapMarker } from '@mdi/js'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import { useSearchLocation } from 'hooks/use-search-location'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  step?: number
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '&.has-border': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    },
    resultItem: {
      padding: theme.spacing(1),
      '&:hover': {
        background: theme.palette.action.hover,
        cursor: 'pointer'
      }
    },
    resultItemContent: {
      paddingLeft: theme.spacing(2)
    },
    lightText: {
      color: theme.palette.grey[500]
    },
    subtitle: {
      margin: theme.spacing(2, 1),
      color: theme.palette.grey[500]
    },
    submit: {
      marginTop: theme.spacing(2)
    },
    searchInput: {
      padding: theme.spacing(1.5)
    }
  }),
  {
    name: 'CreateDeal-Address'
  }
)

export function DealAddress({ step }: Props) {
  const wizard = useWizardForm()

  const classes = useStyles()

  const [searchCriteria, setSearchCriteria] = useState('')
  const { listings, places } = useSearchLocation(searchCriteria)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setSearchCriteria(value)
  }

  const handleSubmit = () => {
    wizard.next()
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>
        What is the address of the subject property?
      </QuestionTitle>
      <QuestionForm>
        <Box
          className={cn(classes.root, {
            'has-border': listings.length > 0 || places.length > 0
          })}
        >
          <Box mb={3}>
            <TextField
              fullWidth
              autoComplete="no"
              placeholder="Enter MLS# or Address"
              value={searchCriteria}
              className={classes.searchInput}
              onChange={handleChange}
            />
          </Box>

          <Box>
            {listings.length > 0 && (
              <Typography variant="body1" className={classes.subtitle}>
                Listings
              </Typography>
            )}

            {listings.map(listing => (
              <Box
                key={listing.mls_number}
                display="flex"
                className={classes.resultItem}
              >
                <div>
                  <Avatar
                    src={listing.cover_image_url}
                    alt={listing.mls_number}
                  />
                </div>

                <div className={classes.resultItemContent}>
                  <Typography variant="body2">
                    {listing.address.street_address}
                  </Typography>

                  <Typography variant="body2" className={classes.lightText}>
                    ${listing.price} . {listing.address.city},{' '}
                    {listing.address.state}, {listing.mls_number}
                  </Typography>
                </div>
              </Box>
            ))}

            {listings.length > 0 && (
              <Typography variant="body1" className={classes.subtitle}>
                Places
              </Typography>
            )}

            {places.map((place, index) => (
              <Box
                key={place.id || index}
                display="flex"
                className={classes.resultItem}
              >
                <SvgIcon path={mdiMapMarker} />
                <Typography
                  variant="body2"
                  className={classes.resultItemContent}
                >
                  <strong>{place.structured_formatting.main_text}</strong>{' '}
                  <span className={classes.lightText}>
                    {place.structured_formatting.secondary_text.replace(
                      ', USA',
                      ''
                    )}
                  </span>
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </QuestionForm>
    </QuestionSection>
  )
}
