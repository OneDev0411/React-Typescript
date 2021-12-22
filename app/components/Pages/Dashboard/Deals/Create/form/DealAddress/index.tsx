import React, { useEffect, useState } from 'react'

import {
  Grid,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { mdiMapMarker, mdiHome, mdiDatabaseOutline } from '@mdi/js'
import { useDebounce } from 'react-use'
import Flex from 'styled-flex-component'

import ListingCard from 'components/ListingCards/ListingCard'
import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { getStatusColorClass } from 'utils/listing'

import { ManualAddress } from './ManualAddress'
import { useStyles } from './styles'
import { useSearchAddress } from './use-search-address'

interface Address {
  city?: string
  county?: string
  postal_code?: string
  state?: string
  street_name?: string
  street_number?: string
  street_prefix?: string
  street_suffix?: string
  unit_number?: string
}

export interface PropertyAddress {
  type: 'Place' | 'Listing'
  address: string | unknown
}

interface Props {
  skippable: boolean
  concurrentMode?: boolean
  error?: string
  onChange?: (address: PropertyAddress | null) => void
}

export function DealAddress({
  concurrentMode = false,
  error,
  skippable,
  onChange
}: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { next: goNextStep, currentStep } = wizard

  const classes = useStyles()

  const [place, setPlace] =
    useState<Nullable<Partial<google.maps.places.AutocompletePrediction>>>(null)
  const [selectedListing, setSelectedListing] =
    useState<Nullable<ICompactListing | IListing>>(null)
  const [address, setAddress] = useState<Address | null>(null)

  const [searchCriteria, setSearchCriteria] = useState('')
  const [debouncedSearchCriteria, setDebouncedSearchCriteria] =
    useState<string>('')

  const { isSearching, listing, listings, places, getParsedPlace } =
    useSearchAddress(debouncedSearchCriteria)

  useEffect(() => {
    if (listing?.id && currentStep === step) {
      setSelectedListing(listing)

      onChange?.({
        type: 'Listing',
        address: listing.id
      })

      goNextStep()
    }
  }, [listing, onChange, goNextStep, currentStep, step])

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

  const getAddressString = (
    fields: (string | undefined)[],
    separator = ', '
  ) => {
    return fields.filter(item => !!item).join(separator)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setSearchCriteria(value)
  }

  const handleRemove = () => {
    setPlace(null)
    setSelectedListing(null)
    setAddress(null)
    setDebouncedSearchCriteria('')
    setSearchCriteria('')

    onChange?.(null)
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

    onChange?.({
      type: 'Place',
      address: fields
    })

    goNext()
  }

  const goNext = () => {
    if (concurrentMode) {
      wizard.setStep(step)
    }

    if (!concurrentMode && currentStep === step) {
      setTimeout(() => wizard.next(), 700)
    }
  }

  const handleSelectListing = (listing: IListing | ICompactListing) => {
    setSelectedListing(listing)

    onChange?.({
      type: 'Listing',
      address: listing.id
    })

    goNext()
  }

  const handleSelectNewAddress = (address: Address) => {
    const newAddress = {
      ...address,
      // TODO: our global address component isn't well typed
      street_prefix: (address as any).street_prefix.value
    }

    setAddress(newAddress)

    onChange?.({
      type: 'Place',
      address: newAddress
    })

    goNext()
  }

  if (wizard.lastVisitedStep < step) {
    return null
  }

  return (
    <QuestionSection error={error}>
      <QuestionTitle>What is the address for the property?</QuestionTitle>
      <QuestionForm>
        {!selectedListing && !place && !address && (
          <div className={classes.root}>
            <div className={classes.searchContainer}>
              <div>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  autoComplete="no"
                  placeholder="Enter MLS# or Address"
                  value={searchCriteria}
                  onChange={handleChange}
                />
              </div>

              {skippable && currentStep === step && (
                <div className={classes.skipContainer}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => wizard.next()}
                  >
                    Skip
                  </Button>
                </div>
              )}
            </div>

            {isSearching && (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            )}

            <div>
              {!isSearching && debouncedSearchCriteria && (
                <Typography variant="body1" className={classes.subtitle}>
                  Places
                </Typography>
              )}

              {places.map((place, index) => (
                <Flex
                  key={place.id || index}
                  alignCenter
                  className={classes.resultItem}
                  onClick={() => handleSelectPlace(place)}
                >
                  <Flex
                    alignCenter
                    justifyCenter
                    className={classes.avatarContainer}
                  >
                    <SvgIcon path={mdiMapMarker} />
                  </Flex>

                  <div>
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
                  </div>
                </Flex>
              ))}

              {!isSearching && debouncedSearchCriteria.length > 0 && (
                <ManualAddress
                  address={searchCriteria}
                  onSelectAddress={handleSelectNewAddress}
                />
              )}

              {listings.length > 0 && (
                <Typography variant="body1" className={classes.subtitle}>
                  Listings
                </Typography>
              )}

              {listings.map(listing => (
                <Flex
                  key={listing.mls_number}
                  alignCenter
                  className={classes.resultItem}
                  onClick={() => handleSelectListing(listing)}
                >
                  <div className={classes.avatarContainer}>
                    <Avatar
                      src={listing.cover_image_url}
                      alt={listing.mls_number}
                    >
                      <SvgIcon path={mdiHome} />
                    </Avatar>
                  </div>

                  <div className={classes.resultItemContent}>
                    <Typography variant="body2">
                      {listing.address.street_address}
                    </Typography>

                    <Typography variant="body2" className={classes.lightText}>
                      ${listing.price} . {listing.address.city},{' '}
                      {listing.address.state}, {listing.mls_number}
                    </Typography>

                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <Typography
                          variant="caption"
                          className={classes.status}
                          style={{
                            backgroundColor: getStatusColorClass(listing.status)
                          }}
                        >
                          {listing.status}
                        </Typography>
                      </Grid>
                      <Grid
                        className={classes.mlsSource}
                        item
                        title="Listing Provider (MLS) Source"
                      >
                        <SvgIcon
                          path={mdiDatabaseOutline}
                          className={classes.mlsSourceIcon}
                        />
                        {listing.mls_display_name}
                      </Grid>
                    </Grid>
                  </div>
                </Flex>
              ))}
            </div>
          </div>
        )}

        {selectedListing && <ListingCard listing={selectedListing} />}

        {(place || address) && (
          <Flex alignCenter className={classes.place}>
            <div className={classes.avatarContainer}>
              <Avatar title="P">
                <SvgIcon path={mdiHome} />
              </Avatar>
            </div>

            <div>
              <Typography variant="subtitle1">
                {place && place.structured_formatting!.main_text}
                {address &&
                  getAddressString(
                    [address.street_number, address.street_name],
                    ' '
                  )}
              </Typography>

              <Typography variant="subtitle2" className={classes.lightText}>
                {place && place.structured_formatting!.secondary_text}
                {address && getAddressString([address.city, address.state])}
              </Typography>
            </div>
          </Flex>
        )}

        <Flex alignCenter justifyEnd className={classes.actions}>
          {(selectedListing || place || address) && (
            <Button onClick={handleRemove}>Change Property</Button>
          )}
        </Flex>
      </QuestionForm>
    </QuestionSection>
  )
}
