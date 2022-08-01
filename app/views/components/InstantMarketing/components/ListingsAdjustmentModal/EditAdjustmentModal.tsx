import { useState } from 'react'

import {
  TextField,
  InputAdornment,
  Button,
  Chip,
  Grid,
  makeStyles,
  Typography,
  IconButton
} from '@material-ui/core'
import { mdiPlus, mdiClose } from '@mdi/js'
import cn from 'classnames'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import {
  getListingFormattedPrice,
  getResizeUrl,
  getStatusColor
} from '@app/utils/listing'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { MaskedInput } from 'components/MaskedInput'
import { Modal, ModalHeader, ModalFooter } from 'components/Modal'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import {
  EMPTY_ADJUSTMENT,
  INITIAL_ADJUSTMENT_SIZE,
  MAX_ADJUSTMENT_SIZE,
  MIN_ADJUSTMENT_SIZE,
  PLACEHOLDER_IMAGE
} from './constants'
import { fillAdjustmentsWithEmptyItems, sumAdjustmentsPrice } from './helpers'
import ListingAdjustmentCardSummery from './ListingAdjustmentCardSummery'
import { IAdjustment, IAdjustmentOptionalValue } from './types'

interface Props {
  listing: IListing
  adjustments: IAdjustment[]
  onChange: (id: UUID, changedValue: IAdjustment[]) => void
  onClose: () => void
}

const useStyles = makeStyles(
  theme => ({
    body: {
      width: '100%',
      position: 'relative',
      marginTop: 1,
      padding: theme.spacing(0, 2),
      overflowY: 'auto',
      height: '75vh',
      backgroundColor: theme.palette.common.white
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(3, 4)
    },
    image: {
      objectFit: 'cover',
      objectPosition: 'center',
      width: 200,
      height: 120,
      marginRight: theme.spacing(1.5),
      borderRadius: theme.shape.borderRadius
    },
    summery: {
      flex: 3,
      marginLeft: theme.spacing(1.5),
      textAlign: 'left'
    },
    statusChip: {
      fontSize: 12,
      borderRadius: theme.spacing(0.5),
      '& $iconSmall': {
        marginLeft: theme.spacing(1)
      }
    },
    statusDot: (props: Props) => ({
      backgroundColor: `#${getStatusColor(props.listing.status)}`,
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: '50%',
      display: 'inline-block'
    }),
    iconSmall: {
      opacity: '100%'
    },
    formHeader: { ...theme.typography.subtitle2 },
    formRow: {
      display: 'flex',
      margin: theme.spacing(1, 0),
      alignItems: 'center',
      '&:hover $removeRow, &:focus-within $removeRow': {
        opacity: 1,
        transition: '.4s opacity'
      }
    },
    formRowIndex: {
      ...theme.typography.body3,
      color: theme.palette.grey[500],
      width: 24,
      textAlign: 'center'
    },
    formRowDesc: { flex: 5, margin: theme.spacing(0, 1) },
    formRowValue: { flex: 2, margin: theme.spacing(0, 1) },
    formRowAction: { width: 24, textAlign: 'center' },
    removeRow: {
      opacity: 0.02,
      transition: '.4s opacity',
      '&:focus': {
        opacity: 1,
        transition: '.4s opacity'
      }
    },
    inputField: { width: '100%' },
    formFooter: {
      margin: theme.spacing(2, 0),
      display: 'flex',
      justifyContent: 'space-between'
    },
    addMore: { marginLeft: theme.spacing(3) },
    price: {
      marginTop: theme.spacing(1),
      justifyContent: 'flex-end',
      display: 'flex'
    },
    priceTitle: {
      paddingRight: theme.spacing(4),
      color: theme.palette.grey[700]
    },
    priceValue: {
      color: theme.palette.grey[900],
      width: 156
    },
    saveButton: {
      minWidth: 120,
      marginLeft: theme.spacing(2)
    }
  }),
  { name: 'EditAdjustmentModal' }
)

const priceMask = createNumberMask({
  prefix: '',
  includeThousandsSeparator: true,
  allowNegative: false,
  allowLeadingZeroes: false,
  allowDecimal: false,
  integerLimit: 8
})

export function EditAdjustmentModal(props: Props) {
  const { listing, onChange, onClose } = props
  const classes = useStyles(props)

  const [adjustments, setAdjustment] = useState<IAdjustmentOptionalValue[]>(
    fillAdjustmentsWithEmptyItems(
      props.adjustments || [],
      INITIAL_ADJUSTMENT_SIZE
    )
  )

  const adjustedTotal = listing.price + (sumAdjustmentsPrice(adjustments) || 0)

  const coverImageURL = listing.cover_image_url
    ? `${getResizeUrl(listing.cover_image_url)}?w=160`
    : PLACEHOLDER_IMAGE

  const handleSave = () => {
    const filteredAdjustments = adjustments.filter(
      (adjustment): adjustment is IAdjustment =>
        !!adjustment.description.trim() && !!adjustment.value
    )

    onChange(listing.id, filteredAdjustments)
  }

  const onChangeAdjustment = <T extends keyof IAdjustmentOptionalValue>(
    index: number,
    key: T,
    value: IAdjustmentOptionalValue[T]
  ) => {
    setAdjustment(oldValues => [
      ...oldValues.map((oldValue, oldValueIndex) =>
        oldValueIndex === index
          ? {
              ...oldValue,
              [key]: value
            }
          : oldValue
      )
    ])
  }

  const onRemoveAdjustment = (index: number) => {
    setAdjustment(oldValues => {
      const newValues = [
        ...oldValues.filter((_, oldValueIndex) => oldValueIndex !== index)
      ]

      return fillAdjustmentsWithEmptyItems(newValues, MIN_ADJUSTMENT_SIZE)
    })
  }

  const onChangeMaskValue = (index: number, maskedValue: string) => {
    const value = maskedValue
      ? parseFloat(maskedValue.replace(/\,/gi, ''))
      : undefined

    onChangeAdjustment(index, 'value', value)
  }

  const onAddMore = () => {
    setAdjustment(oldValues => [...oldValues, EMPTY_ADJUSTMENT])
  }

  const onClear = () => {
    setAdjustment(fillAdjustmentsWithEmptyItems([], INITIAL_ADJUSTMENT_SIZE))
  }

  return (
    <Modal isOpen autoHeight>
      <ModalHeader title="Adjustment" />
      <div className={classes.body}>
        <div className={classes.headerContainer}>
          <img className={classes.image} alt="listing" src={coverImageURL} />

          <div className={classes.summery}>
            <ListingAdjustmentCardSummery listing={listing} />
            {listing.status && (
              <div>
                <Chip
                  label={listing.status}
                  size="small"
                  variant="outlined"
                  classes={{
                    root: classes.statusChip,
                    iconSmall: classes.iconSmall
                  }}
                  icon={<Grid className={classes.statusDot} />}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <div className={cn(classes.formHeader, classes.formRow)}>
            <div className={classes.formRowIndex} />
            <div className={classes.formRowDesc}>Description</div>
            <div className={classes.formRowValue}>Value</div>
            <div className={classes.formRowAction} />
          </div>
          {adjustments.map((adjustment, index) => (
            <div key={index} className={classes.formRow}>
              <div className={classes.formRowIndex}>{index + 1}</div>
              <div className={classes.formRowDesc}>
                <TextField
                  type="text"
                  size="small"
                  color="primary"
                  value={adjustment.description || ''}
                  inputProps={{
                    'aria-label': 'Description'
                  }}
                  autoFocus={index === 0}
                  onChange={event => {
                    onChangeAdjustment(index, 'description', event.target.value)
                  }}
                  variant="outlined"
                  className={classes.inputField}
                />
              </div>
              <div className={classes.formRowValue}>
                <TextField
                  type="text"
                  size="small"
                  color="primary"
                  value={adjustment.value || ''}
                  InputProps={{
                    inputProps: {
                      'aria-label': 'Value',
                      mask: priceMask
                    },
                    inputComponent: priceMask ? MaskedInput : undefined,
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                  onChange={event => {
                    onChangeMaskValue(index, event.target.value)
                  }}
                  variant="outlined"
                  className={classes.inputField}
                />
              </div>
              <div className={classes.formRowAction}>
                <IconButton
                  disabled={adjustments.length <= MIN_ADJUSTMENT_SIZE}
                  size="small"
                  className={classes.removeRow}
                  onClick={() => {
                    onRemoveAdjustment(index)
                  }}
                >
                  <SvgIcon size={muiIconSizes.medium} path={mdiClose} />
                </IconButton>
              </div>
            </div>
          ))}
          <div className={classes.formFooter}>
            <div className={classes.addMore}>
              <Button
                disabled={adjustments.length >= MAX_ADJUSTMENT_SIZE}
                onClick={onAddMore}
                variant="text"
                color="primary"
                startIcon={
                  <SvgIcon size={muiIconSizes.medium} path={mdiPlus} />
                }
              >
                Add more
              </Button>
            </div>
            <div>
              <div className={classes.price}>
                <Typography className={classes.priceTitle} variant="body1">
                  Adjusted total
                </Typography>
                <Typography className={classes.priceValue} variant="subtitle1">
                  $ {getListingFormattedPrice(adjustedTotal, false)}
                </Typography>
              </div>
              <div className={classes.price}>
                <Typography className={classes.priceTitle} variant="body1">
                  Before
                </Typography>
                <Typography className={classes.priceValue} variant="subtitle1">
                  $ {getListingFormattedPrice(listing.price, false)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalFooter>
        <Grid container direction="row-reverse" justifyContent="space-between">
          <Grid
            item
            container
            direction="row-reverse"
            xs={7}
            justifyContent="flex-start"
          >
            <Button
              className={classes.saveButton}
              variant="contained"
              type="submit"
              color="primary"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              type="reset"
              color="default"
              onClick={onClear}
            >
              Clear Form
            </Button>
          </Grid>
          <Grid item container xs={5} justifyContent="space-between">
            <Button variant="text" color="default" onClick={onClose}>
              Back to listings
            </Button>
          </Grid>
        </Grid>
      </ModalFooter>
    </Modal>
  )
}
