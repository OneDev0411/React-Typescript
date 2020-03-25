import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { Button } from '@material-ui/core'

import Drawer from 'components/OverlayDrawer'

import Loading from 'components/Spinner'

import { getDeal } from 'actions/deals'

import { selectDealById } from 'reducers/deals/list'
import { IAppState } from 'reducers'

import Documents from './Documents'

interface DispatchProps {
  getDeal: IAsyncActionProp<typeof getDeal>
}

interface StateProps {
  getDealById(dealId: UUID): IDeal
}

interface Props {
  isOpen?: boolean
  title?: string
  showStashFiles?: boolean
  allowNoChecklist?: boolean
  drawerOptions?: object
  defaultSelectedItems: IDealFile[]
  initialAttachments: IDealFile[]
  dealId: UUID
  onChangeSelectedDocuments(documents: IDealFile[]): void
  onClose(): void
}

function SelectDealFileDrawer({
  dealId,
  isOpen = false,
  showStashFiles = true,
  title = 'Select Documents',
  drawerOptions = {},
  allowNoChecklist = false,
  defaultSelectedItems,
  initialAttachments,
  onChangeSelectedDocuments,
  getDealById,
  getDeal,
  onClose
}: Props & StateProps & DispatchProps) {
  const [selectedItems, setSelectedItems] = useState<IDealFile[]>(
    defaultSelectedItems
  )

  const fullDeal = getDealById(dealId)

  useEffect(() => {
    if (!fullDeal || !fullDeal.checklists) {
      getDeal(dealId)
    }
  }, [dealId, fullDeal, getDeal])

  const toggleSelectRow = (document: IDealFile): void => {
    if (!document.checklist && !allowNoChecklist) {
      return
    }

    const isExists =
      Array.isArray(selectedItems) &&
      selectedItems.some(row => row.id === document.id)

    setSelectedItems(
      isExists
        ? selectedItems.filter(row => row.id !== document.id)
        : [...selectedItems, document]
    )
  }

  return (
    <Drawer open={isOpen} onClose={onClose} {...drawerOptions}>
      <Drawer.Header title={title} />
      <Drawer.Body>
        {fullDeal && fullDeal.checklists ? (
          <Documents
            deal={fullDeal}
            showStashFiles={showStashFiles}
            allowNoChecklist={allowNoChecklist}
            initialAttachments={initialAttachments}
            selectedItems={selectedItems}
            onToggleItem={toggleSelectRow}
          />
        ) : (
          <Loading />
        )}
      </Drawer.Body>

      <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
        <Button
          color="secondary"
          variant="contained"
          disabled={selectedItems.length === 0}
          onClick={() => onChangeSelectedDocuments(selectedItems)}
        >
          Next
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}

function mapStateToProps({ deals }: IAppState) {
  return {
    getDealById: selectDealById.bind(null, deals.list)
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    getDeal: (...args: Parameters<typeof getDeal>) => dispatch(getDeal(...args))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectDealFileDrawer)
