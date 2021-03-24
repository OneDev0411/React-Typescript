import React, { useState } from 'react'
import {
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Theme,
  makeStyles,
  CircularProgress
} from '@material-ui/core'
import { useEffectOnce, useDebounce } from 'react-use'
import { mdiMapMarker, mdiHome } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { getStatusColorClass } from 'utils/listing'

import ListingCard from 'components/ListingCards/ListingCard'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { Callout } from 'components/Callout'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useSearchLocation } from 'hooks/use-search-location'

import { createAddressContext } from 'deals/utils/create-address-context'
import { updateListing, upsertContexts } from 'actions/deals'

import { getField } from 'models/Deal/helpers/context'

import getListing from 'models/listings/listing/get-listing'

import { useCreationContext } from '../../context/use-creation-context'

export interface PropertyAddress {
  type: 'Place' | 'Listing'
  address: string | unknown
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '&.has-border': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    },
    status: {
      color: '#fff',
      marginTop: theme.spacing(0.5),
      padding: theme.spacing(0.25, 0.5),
      borderRadius: theme.shape.borderRadius
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
    place: {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'CreateDeal-Address'
  }
)

interface Props {
  skippable: boolean
  onChange?: (address: PropertyAddress | null) => void
}

export function DealAddress({ skippable, onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()

  const classes = useStyles()
  const dispatch = useDispatch()

  const [place, setPlace] = useState<
    Nullable<Partial<google.maps.places.AutocompletePrediction>>
  >(null)
  const [listing, setListing] = useState<Nullable<ICompactListing | IListing>>(
    null
  )

  useEffectOnce(() => {
    ;(async () => {
      if (deal?.listing && !listing) {
        const compactListing = await getListing(deal.listing)

        setListing(compactListing)
      } else if (getField(deal, 'full_address')) {
        const streetNumber = getField(deal, 'street_number')
        const streetName = getField(deal, 'street_name')
        const state = getField(deal, 'state')
        const city = getField(deal, 'city')

        setPlace({
          structured_formatting: {
            main_text_matched_substrings: [],
            main_text: `${streetNumber} ${streetName} Street`,
            secondary_text: `${city}, ${state}, USA`
          }
        })
      }
    })()
  })

  const [searchCriteria, setSearchCriteria] = useState('')
  const [
    debouncedSearchCriteria,
    setDebouncedSearchCriteria
  ] = useState<string>('')

  /**
   * debounce search criteria to don't search contacts on input change
   */
  useDebounce(
    () => {
      setDebouncedSearchCriteria(searchCriteria)
    },
    700,
    [searchCriteria]
  )

  const {
    isEmptyState,
    isSearching,
    listings,
    places,
    getParsedPlace
  } = useSearchLocation(debouncedSearchCriteria)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setSearchCriteria(value)
  }

  const handleRemove = () => {
    setPlace(null)
    setListing(null)
    setSearchCriteria('')

    onChange?.(null)

    if (deal) {
      wizard.setStep(step)
    }
  }

  const handleSelectPlace = async (
    place: google.maps.places.AutocompletePrediction
  ) => {
    setPlace(place)

    const address = await getParsedPlace(place!)

    const fields = {
      city: address.city,
      postal_code: address.zip,
      state: address.state,
      street_name: address.street,
      street_number: address.number,
      unit_number: address.unit
    }

    if (deal) {
      dispatch(upsertContexts(deal.id, createAddressContext(deal, fields)))
      deal.listing && dispatch(updateListing(deal.id, null))
    }

    onChange?.({
      type: 'Place',
      address: fields
    })

    goNext()
  }

  const handleSelectListing = (listing: ICompactListing) => {
    setListing(listing)

    if (deal) {
      dispatch(updateListing(deal.id, listing.id))
    }

    onChange?.({
      type: 'Listing',
      address: listing.id
    })

    goNext()
  }

  const goNext = () => {
    if (wizard.currentStep === step) {
      setTimeout(() => wizard.next(), 700)
    }
  }

  if (wizard.lastVisitedStep < step) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>What is the address for the property?</QuestionTitle>
      <QuestionForm>
        {!listing && !place && (
          <Box className={classes.root}>
            <Box mb={3}>
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  autoComplete="no"
                  placeholder="Enter MLS# or Address"
                  value={searchCriteria}
                  onChange={handleChange}
                />
              </Box>

              {skippable && wizard.currentStep === step && (
                <Box mt={2} textAlign="right">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => wizard.next()}
                  >
                    Skip
                  </Button>
                </Box>
              )}
            </Box>

            {isSearching && (
              <Box my={1}>
                <CircularProgress />
              </Box>
            )}

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
                  alignItems="center"
                  className={classes.resultItem}
                  onClick={() => handleSelectListing(listing)}
                >
                  <Box width="32px" mr={1}>
                    <Avatar
                      src={listing.cover_image_url}
                      alt={listing.mls_number}
                    >
                      <SvgIcon path={mdiHome} />
                    </Avatar>
                  </Box>

                  <div className={classes.resultItemContent}>
                    <Typography variant="body2">
                      {listing.address.street_address}
                    </Typography>

                    <Typography variant="body2" className={classes.lightText}>
                      ${listing.price} . {listing.address.city},{' '}
                      {listing.address.state}, {listing.mls_number}
                    </Typography>

                    <Typography
                      variant="caption"
                      className={classes.status}
                      style={{
                        backgroundColor: getStatusColorClass(listing.status)
                      }}
                    >
                      {listing.status}
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
                  alignItems="center"
                  className={classes.resultItem}
                  onClick={() => handleSelectPlace(place)}
                >
                  <Box
                    width="32px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mr={1}
                  >
                    <SvgIcon path={mdiMapMarker} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      className={classes.resultItemContent}
                    >
                      <div>
                        <strong>{place.structured_formatting.main_text}</strong>
                      </div>
                      <span className={classes.lightText}>
                        {place.structured_formatting.secondary_text.replace(
                          ', USA',
                          ''
                        )}
                      </span>
                    </Typography>
                  </Box>
                </Box>
              ))}

              {isEmptyState && (
                <Callout
                  type="error"
                  style={{
                    margin: 0
                  }}
                >
                  Nothing found
                </Callout>
              )}
            </Box>
          </Box>
        )}

        {listing && <ListingCard listing={listing} />}

        {place && (
          <Box display="flex" alignItems="center" className={classes.place}>
            <Box mr={1}>
              <Avatar title="P">
                <SvgIcon path={mdiHome} />
              </Avatar>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {place.structured_formatting.main_text}
              </Typography>

              <Typography variant="subtitle2" className={classes.lightText}>
                {place.structured_formatting.secondary_text}
              </Typography>
            </Box>
          </Box>
        )}

        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          mt={2}
        >
          {(listing || place) && (
            <Button onClick={handleRemove}>Change Property</Button>
          )}

          {deal && (listing || place) && wizard.currentStep === step && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              ml={1}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => wizard.next()}
              >
                Looks Good
              </Button>
            </Box>
          )}
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
