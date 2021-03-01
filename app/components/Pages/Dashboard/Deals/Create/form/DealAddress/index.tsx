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
import { useDebounce } from 'react-use'
import { mdiMapMarker, mdiHome } from '@mdi/js'

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
    searchInput: {
      padding: theme.spacing(1.5)
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
  onChange: (address: PropertyAddress) => void
}

export function DealAddress({ onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()

  const classes = useStyles()

  const [place, setPlace] = useState<
    Nullable<google.maps.places.AutocompletePrediction>
  >(null)
  const [listing, setListing] = useState<Nullable<ICompactListing>>(null)

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

  const { isSearching, listings, places, getParsedPlace } = useSearchLocation(
    debouncedSearchCriteria
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setSearchCriteria(value)
  }

  const handleRemove = () => {
    setPlace(null)
    setListing(null)
    setSearchCriteria('')
  }

  const handleSelectPlace = async (
    place: google.maps.places.AutocompletePrediction
  ) => {
    setPlace(place)

    const address = await getParsedPlace(place!)

    onChange({
      type: 'Place',
      address
    })

    goNext()
  }

  const handleSelectListing = (listing: ICompactListing) => {
    setListing(listing)

    onChange({
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
    <QuestionSection
      disabled={!!deal}
      disableMessage="You will be able to edit the address inside the deal"
    >
      <QuestionTitle>What is the address for the property?</QuestionTitle>
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
                  onClick={() => handleSelectListing(listing)}
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
                  onClick={() => handleSelectPlace(place)}
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

              {!isSearching &&
                debouncedSearchCriteria.length > 0 &&
                listings.length === 0 &&
                places.length === 0 && (
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

        {(listing || place) && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            mt={2}
          >
            <Button onClick={handleRemove}>Change Property</Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}
