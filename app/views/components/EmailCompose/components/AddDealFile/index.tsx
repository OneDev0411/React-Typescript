import React, { Fragment, MouseEventHandler, useState } from 'react'
import { connect } from 'react-redux'

import { ListItem } from '@material-ui/core'

import { FieldRenderProps } from 'react-final-form'

import { useDeepMemo } from 'hooks/use-deep-memo'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { selectDealTasks } from 'reducers/deals/tasks'

import { notUndefined } from 'utils/ts-utils'

import { IAppState } from 'reducers/index'

import SearchDealDrawer from 'components/SearchDealDrawer'
import SelectDealFileDrawer from 'components/SelectDealFileDrawer'

import { getAllDealDocuments } from '../../../SelectDealFileDrawer/helpers/get-all-deal-documents'

import { DealRow } from './DealRow'
import IconDealFilled from '../../../SvgIcons/Deals/IconDealFilled'
import { iconSizes } from '../../../SvgIcons/icon-sizes'

interface Props extends FieldRenderProps<any> {
  checklists: IDealChecklist[]
  tasks: IDealTask[]
  envelopes: IDealEnvelope[]
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
  tasks,
  checklists,
  envelopes,
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

  const allDealFiles: IDealFile[] =
    useDeepMemo(() => {
      return (
        (deal &&
          getAllDealDocuments(
            deal,
            selectDealEnvelopes(deal, envelopes),
            selectDealTasks(deal, checklists, tasks),
            true
          )) ||
        []
      )
    }, [initialAttachments, deal, envelopes, checklists, tasks]) || []

  const fileToDealFile = (file: IFile): IDealFile | undefined => {
    return allDealFiles.find(document => document.id === file.id)
  }

  const selectedDealFiles: IDealFile[] = (props.input.value || [])
    .map((file: IFile) => fileToDealFile(file))
    .filter(notUndefined)

  const initialDealFiles = (initialAttachments || [])
    .map(fileToDealFile)
    .filter(notUndefined)

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
          initialAttachments={initialDealFiles}
          defaultSelectedItems={selectedDealFiles}
          deal={deal}
          onChangeSelectedDocuments={handleChangeSelectedDealFile}
          onClose={closeDealFilesDrawer}
        />
      )}
    </Fragment>
  )
}

export default connect(
  ({ deals: { checklists, list, tasks, envelopes } }: IAppState) => ({
    checklists,
    tasks,
    envelopes
  })
)(AddDealFile)
