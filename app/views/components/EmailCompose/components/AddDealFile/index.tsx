import React, { MouseEventHandler, useState } from 'react'
import { useSelector } from 'react-redux'

import { ListItem } from '@material-ui/core'

import { FieldRenderProps } from 'react-final-form'

import { mdiCurrencyUsdCircle } from '@mdi/js'

import { useDeepMemo } from 'hooks/use-deep-memo'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { selectDealTasks } from 'reducers/deals/tasks'

import { notUndefined } from 'utils/ts-utils'

import { IAppState } from 'reducers'

import SearchDealDrawer from 'components/SearchDealDrawer'
import SelectDealFileDrawer from 'components/SelectDealFileDrawer'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getAllDealDocuments } from '../../../SelectDealFileDrawer/helpers/get-all-deal-documents'

import { DealRow } from './DealRow'

interface StateProps {
  checklists: Record<UUID, IDealChecklist>
  tasks: Record<UUID, IDealTask>
  envelopes: Record<UUID, IDealEnvelope>
}

interface Props extends FieldRenderProps<any> {
  deafultSelectedDeal?: IDeal
  initialAttachments: IFile[]
  onClick?: MouseEventHandler
  onChanged?: () => void
}

export function AddDealFile({
  initialAttachments,
  deafultSelectedDeal,
  onChanged = () => {},
  ...props
}: Props) {
  const { checklists, tasks, envelopes }: StateProps = useSelector(
    ({ deals: { checklists, tasks, envelopes } }: IAppState) => ({
      checklists,
      tasks,
      envelopes
    })
  )
  const [isDealsListOpen, setDealsListOpen] = useState(false)
  const [isDealFilesOpen, setDealFilesOpen] = useState(false)
  const [deal, setDeal] = useState<IDeal | null>(deafultSelectedDeal || null)

  const handleClick = event => {
    setDealsListOpen(true)
    setDealFilesOpen(false)

    if (props.onClick) {
      props.onClick(event)
    }
  }

  const closeDealDrawer = () => setDealsListOpen(false)

  const closeDealFilesDrawer = () => {
    setDeal(deal || null)
    setDealsListOpen(true)
    setDealFilesOpen(false)
  }

  const handleSelectDeal = (deal: IDeal) => {
    setDeal(deal)
    setDealsListOpen(false)
    setDealFilesOpen(true)
  }

  const fileExists = (files: IFile[], file: IFile) =>
    files.some(aFile => aFile.id === file.id)

  const handleChangeSelectedDealFile = (files: IFile[]) => {
    setDeal(deal || null)
    setDealFilesOpen(false)

    if (deal) {
      const currentFiles: IFile[] = props.input.value || []

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
    <>
      <ListItem button onClick={handleClick}>
        <SvgIcon
          path={mdiCurrencyUsdCircle}
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

export default AddDealFile
