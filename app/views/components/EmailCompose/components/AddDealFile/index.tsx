import React, { Fragment, MouseEventHandler, useState } from 'react'

import { ListItem } from '@material-ui/core'

import { FieldRenderProps } from 'react-final-form'

import { connect } from 'react-redux'

import SearchDealDrawer from 'components/SearchDealDrawer'
import SelectDealFileDrawer from 'components/SelectDealFileDrawer'

import { IAppState } from 'reducers/index'

import { selectDealById } from 'reducers/deals/list'

import { useDeepMemo } from 'hooks/use-deep-memo'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { selectDealTasks } from 'reducers/deals/tasks'

import { notUndefined } from 'utils/ts-utils'

import { DealRow } from './DealRow'
import IconDealFilled from '../../../SvgIcons/Deals/IconDealFilled'
import { iconSizes } from '../../../SvgIcons/icon-sizes'
import { getAllDealDocuments } from '../../../SelectDealFileDrawer/helpers/get-all-deal-documents'

/**
{
  "type": "form",
  "id": "task_facb0b96-6740-11e9-97c8-0a95998482ac",
  "task_id": "facb0b96-6740-11e9-97c8-0a95998482ac",
  "file_id": "ed5946ec-caa2-11e9-a7ef-027d31a1f7a0",
  "checklist": "fab88e94-6740-11e9-88e7-0a95998482ac",
  "title": "Information About Brokerage Services (TAR 2501)\t\t\t\t\t.pdf",
  "url": "https://boer.api.rechat.com:443/tasks/facb0b96-6740-11e9-97c8-0a95998482ac/submission.pdf?hash=jFzZqXtHACj1jdzQEWMhXfprgL2ZJBmOXGNTY4RVYirECyV3S4id4%2BRHm39DB2inxE%2BVOb1Ni8FATK9G7BbgmhPBROoCd5ZamgHtvUwxZ1wnl8W81ixoJF02PKoeYPGdRmKCTXNE1lV9WqV1aA%2BgJG3Iu8g9pXimAuxxeUIATg%3D%3D",
  "date": "2019-04-25T10:00:39.468Z"
}
 */
interface Props extends FieldRenderProps<any> {
  checklists: any
  tasks: any
  envelopes: any
  getDeal: (id: string) => any
  deal?: IDeal
  onClick?: MouseEventHandler
  initialAttachments: IFile[]
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
  ...props
}: Props) {
  const [isDealsListOpen, setDealsListOpen] = useState(false)
  const [isDealFilesOpen, setDealFilesOpen] = useState(false)
  const [deal, setDeal] = useState<IDeal | null>(props.deal || null)

  const allDealDocuments =
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

  const fileToDocument = file =>
    allDealDocuments.find(document => document.file.id === file.id)

  const selectedDocuments = (props.input.value || []).map(
    file => fileToDocument(file) || { file }
  )
  const initialDocuments = (initialAttachments || [])
    .map(fileToDocument)
    .filter(notUndefined)

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

  const handleSelectDeal = deal => {
    setDeal(deal)
    setDealsListOpen(false)
    setDealFilesOpen(true)
  }

  const handleChangeSelectedDealFile = dealDocuments => {
    setDeal(props.deal || null)
    setDealFilesOpen(false)

    if (deal) {
      props.input.onChange(dealDocuments.map(document => document.file))
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
          initialAttachments={initialDocuments}
          defaultSelectedItems={selectedDocuments}
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
    envelopes,
    getDeal: id => selectDealById(list, id)
  })
)(AddDealFile)
