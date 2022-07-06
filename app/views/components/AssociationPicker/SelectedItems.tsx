import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'

import { makeStyles, TextField, Theme } from '@material-ui/core'
import { useDebounce } from 'react-use'

import { getField } from '@app/models/Deal/helpers/context'
import { addressTitle, getListingAddressObj } from '@app/utils/listing'

import { SelectedItemCard } from './SelectedItemCard'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: theme.spacing(1, 2),
      backgroundColor: theme.palette.action.hover,
      minHeight: theme.spacing(4),
      maxHeight: '150px',
      overflow: 'auto'
    },
    searchInput: {
      marginBottom: theme.spacing(0.5),
      padding: theme.spacing(0.75, 1),
      '&:focus': {
        backgroundColor: theme.palette.common.white
      }
    }
  }),
  {
    name: 'DealPropertyPicker-SelectedItems'
  }
)

export interface InputRef {
  clear(): void
}

interface Props<T> {
  defaultAssociations?: T[]
  onChange: (value: string) => void
  onRemove: (association: T) => void
}

function SelectedItems<T extends ICRMTaskAssociation<'deal' | 'listing'>>({
  defaultAssociations,
  inputRef,
  onChange,
  onRemove
}: Props<T> & {
  inputRef: ForwardedRef<InputRef>
}) {
  const classes = useStyles()
  const [criteria, setCriteria] = useState('')

  useDebounce(
    () => {
      onChange(criteria)
    },
    200,
    [criteria, onChange]
  )

  useImperativeHandle(inputRef, () => ({
    clear: () => setCriteria('')
  }))

  return (
    <div className={classes.root}>
      {defaultAssociations?.map(item => {
        if (item.association_type === 'deal') {
          return (
            <SelectedItemCard
              key={item.deal!.id}
              photo={getField(item.deal, 'photo')}
              title={item.deal!.title}
              onRemove={() => onRemove(item)}
            />
          )
        }

        if (item.association_type === 'listing') {
          const address = getListingAddressObj(item.listing!)

          return (
            <SelectedItemCard
              key={item.listing!.id}
              photo={item.listing!.cover_image_url ?? ''}
              title={
                typeof address === 'string' ? address : addressTitle(address)
              }
              onRemove={() => onRemove(item)}
            />
          )
        }

        return null
      })}

      <TextField
        placeholder="Search Property or Deal"
        value={criteria}
        onChange={e => setCriteria(e.target.value)}
        InputProps={{
          disableUnderline: true,
          classes: {
            input: classes.searchInput
          }
        }}
      />
    </div>
  )
}

function SelectedItemsWithRef<
  T extends ICRMTaskAssociation<'deal' | 'listing'>
>(props: Props<T>, ref: ForwardedRef<InputRef>) {
  return <SelectedItems {...props} inputRef={ref} />
}

export default forwardRef(SelectedItemsWithRef) as <T>(
  props: Props<T> & { ref?: ForwardedRef<InputRef> }
) => ReturnType<typeof SelectedItems>
