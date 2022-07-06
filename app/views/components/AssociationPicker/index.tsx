import { useCallback, useState } from 'react'

import { makeStyles } from '@material-ui/core'

import { Deals } from './Deals'
import { Listings } from './Listings'
import { SelectedItems } from './SelectedItems'

const useStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '500px',
      maxHeight: '500px'
    },
    search: {
      maxHeight: '200px'
    },
    lists: {
      flexGrow: 1,
      overflow: 'auto'
    }
  }),
  {
    name: 'DealPropertyPicker'
  }
)

interface Props<T> {
  defaultAssociations?: T[]
  onChange: (associations: T[]) => void
}

export function AssociationPicker<
  T extends ICRMTaskAssociation<'deal' | 'listing'>
>({ defaultAssociations, onChange }: Props<T>) {
  const classes = useStyles()
  const [criteria, setCriteria] = useState('')
  const [associations, setAssociations] = useState(defaultAssociations ?? [])
  const onChangeCriteria = useCallback((criteria: string) => {
    setCriteria(criteria)
  }, [])

  const handleSelectDeal = useCallback(
    (deal: IDeal) => {
      const nextAssociations = associations.some(
        item => item.association_type === 'deal' && item.deal!.id === deal.id
      )
        ? associations.filter(
            item =>
              !(item.association_type === 'deal' && item.deal!.id === deal.id)
          )
        : [
            ...associations,
            {
              association_type: 'deal',
              deal
            } as T
          ]

      setAssociations(nextAssociations)
      onChange(nextAssociations)
    },
    [associations, onChange]
  )

  const handleSelectListing = useCallback(
    (listing: IListing | ICompactListing) => {
      const nextAssociations = associations.some(
        item =>
          item.association_type === 'listing' && item.listing!.id === listing.id
      )
        ? associations.filter(
            item =>
              !(
                item.association_type === 'listing' &&
                item.listing!.id === listing.id
              )
          )
        : [
            ...associations,
            {
              association_type: 'listing',
              listing
            } as T
          ]

      setAssociations(nextAssociations)
      onChange(nextAssociations)
    },
    [associations, onChange]
  )

  const handleRemove = useCallback(
    (association: T) => {
      const nextAssociations = associations.filter(item => {
        if (
          association.association_type === 'deal' &&
          item.association_type === 'deal' &&
          item.deal!.id === association.deal!.id
        ) {
          return false
        }

        if (
          association.association_type === 'listing' &&
          item.association_type === 'listing' &&
          item.listing!.id === association.listing!.id
        ) {
          return false
        }

        return true
      })

      setAssociations(nextAssociations)
      onChange(nextAssociations)
    },
    [associations, onChange]
  )

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <SelectedItems<T>
          onChange={onChangeCriteria}
          defaultAssociations={associations}
          onRemove={handleRemove}
        />
      </div>

      <div className={classes.lists}>
        <Deals criteria={criteria} onSelect={handleSelectDeal} />
        <Listings criteria={criteria} onSelect={handleSelectListing} />
      </div>
    </div>
  )
}
