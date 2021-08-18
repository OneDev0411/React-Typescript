import React, { useMemo, memo } from 'react'

import { Typography, Theme, makeStyles } from '@material-ui/core'
import cn from 'classnames'

import { areRecipientsEqual } from '../../../../helpers/are-recipients-equal'

const useStyles = makeStyles(
  (theme: Theme) => ({
    name: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
    },
    disabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  }),
  { name: 'BrandSelector' }
)

interface Props {
  brand: IBrand
  currentRecipients?: IDenormalizedEmailRecipientInput[]
  onClick: (brand: IBrand) => void
}

function RawBrand({ brand, currentRecipients = [], onClick }: Props) {
  const classes = useStyles()

  const isUsed: boolean = useMemo(() => {
    if (Array.isArray(currentRecipients) && currentRecipients.length > 0) {
      return !!currentRecipients.find(
        areRecipientsEqual({ recipient_type: 'Brand', brand })
      )
    }

    return false
  }, [brand, currentRecipients])

  const handleOnClick = () => {
    if (isUsed) {
      return null
    }

    onClick(brand)
  }

  return (
    <div
      className={cn(classes.name, { [classes.disabled]: isUsed })}
      onClick={handleOnClick}
    >
      <Typography variant="body2">{brand.name}</Typography>
    </div>
  )
}

export const Brand = memo(RawBrand)
