import { useMemo, memo } from 'react'

import { Theme, makeStyles } from '@material-ui/core'
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

  const isSelected: boolean = useMemo(() => {
    if (Array.isArray(currentRecipients) && currentRecipients.length > 0) {
      return currentRecipients.some(
        areRecipientsEqual({ recipient_type: 'Brand', brand })
      )
    }

    return false
  }, [brand, currentRecipients])

  const handleOnClick = () => {
    if (isSelected) {
      return null
    }

    onClick(brand)
  }

  return (
    <div
      className={cn(classes.name, { [classes.disabled]: isSelected })}
      onClick={handleOnClick}
    >
      {brand.name}
    </div>
  )
}

export const Brand = memo(RawBrand)
