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
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { mdiMapMarker } from '@mdi/js'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { updateListing, upsertContexts } from 'actions/deals'
import { addressTitle } from 'utils/listing'
import { useSearchLocation } from 'hooks/use-search-location'

import { useFormContext } from '../../context/use-form-context'
import { createAddressContext } from '../../../utils/create-address-context'

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
  const context = useFormContext()

  const classes = useStyles()

  const dispatch = useDispatch()

  const [place, setPlace] = useState<
    Nullable<google.maps.places.AutocompletePrediction>
  >(null)
  const [listing, setListing] = useState<Nullable<ICompactListing>>(null)

  const [searchCriteria, setSearchCriteria] = useState('')
  const { listings, places, getParsedPlace } = useSearchLocation(searchCriteria)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setSearchCriteria(value)
  }

  const handleSubmit = async () => {
    if (!context.deal) {
      return
    }

    if (place) {
      const address = await getParsedPlace(place!)
      const contexts = createAddressContext(context.deal, address)

      dispatch(upsertContexts(context.deal.id, contexts))
    }

    if (listing) {
      dispatch(updateListing(context.deal.id, listing.id))
    }

    wizard.next()
  }

  if (wizard.lastVisitedStep < step!) {
    return null
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>
        What is the address of the subject property?
      </QuestionTitle>
      <QuestionForm>
        {!listing && !place && (
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
                  onClick={() => setListing(listing)}
                >
                  <Avatar
                    src={listing.cover_image_url}
                    alt={listing.mls_number}
                  />

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

              {places.length > 0 && (
                <Typography variant="body1" className={classes.subtitle}>
                  Places
                </Typography>
              )}

              {places.map((place, index) => (
                <Box
                  key={place.id || index}
                  display="flex"
                  className={classes.resultItem}
                  onClick={() => setPlace(place)}
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
        )}

        {listing && (
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Avatar src={listing.cover_image_url} />
            </Box>
            <Typography variant="subtitle1">
              {addressTitle(listing.address)}
            </Typography>
          </Box>
        )}

        {place && (
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Avatar title="P" />
            </Box>
            <Typography variant="subtitle1">
              {place.structured_formatting.main_text}
            </Typography>
          </Box>
        )}

        {(listing || place) && (
          <Box mt={4}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}
