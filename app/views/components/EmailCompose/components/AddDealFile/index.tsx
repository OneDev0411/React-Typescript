import React, { MouseEventHandler, useState } from 'react'
import { connect } from 'react-redux'

import { ListItem } from '@material-ui/core'

import { FieldRenderProps } from 'react-final-form'

import { useDeepMemo } from 'hooks/use-deep-memo'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { selectDealTasks } from 'reducers/deals/tasks'

import { notUndefined } from 'utils/ts-utils'

import { IAppState } from 'reducers'
import { selectDealById } from 'reducers/deals/list'

import SearchDealDrawer from 'components/SearchDealDrawer'
import SelectDealFileDrawer from 'components/SelectDealFileDrawer'

import { getAllDealDocuments } from '../../../SelectDealFileDrawer/helpers/get-all-deal-documents'

import { DealRow } from './DealRow'
import IconDealFilled from '../../../SvgIcons/Deals/IconDealFilled'
import { iconSizes } from '../../../SvgIcons/icon-sizes'

interface StateProps {
  checklists: Record<UUID, IDealChecklist>
  tasks: Record<UUID, IDealTask>
  envelopes: Record<UUID, IDealEnvelope>
  getDealById(id: UUID | null): IDeal
}

interface Props extends FieldRenderProps<any> {
  deal?: IDeal
  initialAttachments: IFile[]
  onClick?: MouseEventHandler
  onChanged?: () => void
}

export function AddDealFile({
  initialAttachments,
  tasks,
  checklists,
  envelopes,
  getDealById,
  onChanged = () => {},
  ...props
}: Props & StateProps) {
  const [isDealsListOpen, setDealsListOpen] = useState(false)
  const [isDealFilesOpen, setDealFilesOpen] = useState(false)
  const [selectedDealId, setSelectedDealId] = useState<UUID | null>(
    props.deal ? props.deal.id : null
  )

  const deal = getDealById(selectedDealId)

  const handleClick = event => {
    setDealsListOpen(!selectedDealId)
    setDealFilesOpen(!!selectedDealId)

    if (props.onClick) {
      props.onClick(event)
    }
  }

  const closeDealDrawer = () => setDealsListOpen(false)

  const closeDealFilesDrawer = () => {
    setSelectedDealId(props.deal ? props.deal.id : null)
    setDealsListOpen(!props.deal)
    setDealFilesOpen(false)
  }

  const handleSelectDeal = (deal: IDeal) => {
    setSelectedDealId(deal.id)
    setDealsListOpen(false)
    setDealFilesOpen(true)
  }

  const fileExists = (files: IFile[], file: IFile) =>
    files.some(aFile => aFile.id === file.id)

  const handleChangeSelectedDealFile = (files: IFile[]) => {
    setSelectedDealId(props.deal ? props.deal.id : null)
    setDealFilesOpen(false)

    if (selectedDealId) {
      const currentFiles: IFile[] = props.input.value

      // Previously selected files which are either non-deal files or
      // deal files that are still selected
      const preservedFiles = currentFiles.filter(
        file => !fileExists(allDealFiles, file) || fileExists(files, file)
      )

      // New deal files that are selected from the drawer, but were not
      // previously selected
      const newDealFiles = files.filter(file =>
        preservedFiles.every(aFile => aFile.id !== file.id)
      )

      props.input.onChange([...preservedFiles, ...newDealFiles] as any)
      onChanged()
    }
  }

  const allDealFiles: IDealFile[] =
    useDeepMemo(() => {
      return (
        (selectedDealId &&
          getAllDealDocuments(
            deal,
            selectDealEnvelopes(deal, envelopes),
            selectDealTasks(deal, checklists, tasks),
            true
          )) ||
        []
      )
    }, [initialAttachments, selectedDealId, envelopes, checklists, tasks]) || []

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
    <>
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

      {isDealFilesOpen && deal && (
        <SelectDealFileDrawer
          isOpen
          allowNoChecklist
          title={deal ? `Select files from "${deal.title}"` : 'Select files'}
          dealId={deal.id}
          initialAttachments={initialDealFiles}
          defaultSelectedItems={selectedDealFiles}
          drawerOptions={{
            hideBackdrop: true
          }}
          onChangeSelectedDocuments={handleChangeSelectedDealFile}
          onClose={closeDealFilesDrawer}
        />
      )}
    </>
  )
}

export default connect(
  ({ deals: { list, checklists, tasks, envelopes } }: IAppState) => ({
    checklists,
    tasks,
    envelopes,
    getDealById: selectDealById.bind(null, list)
  })
)(AddDealFile)
