import React, { Fragment, MouseEventHandler, useState } from 'react'

import { ListItem } from '@material-ui/core'

import { FieldRenderProps } from 'react-final-form'

import SearchDealDrawer from 'components/SearchDealDrawer'
import SelectDealFileDrawer from 'components/SelectDealFileDrawer'

import { DealRow } from './DealRow'
import IconDealFilled from '../../../SvgIcons/Deals/IconDealFilled'
import { iconSizes } from '../../../SvgIcons/icon-sizes'

interface Props extends FieldRenderProps<any> {
  deal?: IDeal
  onClick?: MouseEventHandler
  initialAttachments: IFile[]
  onChanged?: () => void
}

interface State {
  deal?: IDeal | null
  isDealsListOpen: boolean
  isDealFilesOpen: boolean
}

export function AddDealFile({
  initialAttachments,
  onChanged = () => {},
  ...props
}: Props) {
  const [isDealsListOpen, setDealsListOpen] = useState(false)
  const [isDealFilesOpen, setDealFilesOpen] = useState(false)
  const [deal, setDeal] = useState<IDeal | null>(props.deal || null)

  const handleClick = event => {
    setDealsListOpen(!deal)
    setDealFilesOpen(!!deal)

    if (props.onClick) {
      props.onClick(event)
    }
  }
  const closeDealDrawer = () => setDealsListOpen(false)

  const closeDealFilesDrawer = () => {
    setDeal(props.deal || null)
    setDealsListOpen(!props.deal)
    setDealFilesOpen(false)
  }

  const handleSelectDeal = (deal: IDeal) => {
    setDeal(deal)
    setDealsListOpen(false)
    setDealFilesOpen(true)
  }

  const handleChangeSelectedDealFile = (files: IFile[]) => {
    setDeal(props.deal || null)
    setDealFilesOpen(false)

    if (deal) {
      props.input.onChange(files as any)
      onChanged()
    }
  }

  return (
    <Fragment>
      <ListItem button onClick={handleClick}>
        <IconDealFilled
          size={iconSizes.small}
          style={{ marginRight: '0.5rem' }}
        />
        Attach from deals
      </ListItem>

      {isDealsListOpen && (
        <SearchDealDrawer
          isOpen
          title="Select a deal to view its files"
          itemRenderer={DealRow}
          onClose={closeDealDrawer}
          onSelect={handleSelectDeal}
        />
      )}

      {isDealFilesOpen && (
        /*
        // @ts-ignore */
        <SelectDealFileDrawer
          isOpen
          title={deal ? `Select files from "${deal.title}"` : 'Select files'}
          drawerOptions={{
            showBackdrop: false
          }}
          showStashFiles={false}
          initialAttachments={initialAttachments}
          defaultSelectedItems={props.input.value || []}
          deal={deal}
          onChangeSelectedDocuments={handleChangeSelectedDealFile}
          onClose={closeDealFilesDrawer}
        />
      )}
    </Fragment>
  )
}

export default AddDealFile
