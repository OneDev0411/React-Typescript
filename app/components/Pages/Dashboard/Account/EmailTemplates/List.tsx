import * as React from 'react'
import { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'

import { IAppState } from 'reducers/index'
import {
  selectEmailTemplates,
  selectEmailTemplatesIsFetching
} from 'reducers/email-templates'

import { fetchEmailTemplates } from 'actions/email-templates/fetch-email-templates'
import { deleteEmailTemplate } from 'actions/email-templates/delete-email-template'

import { getActiveTeamId } from 'utils/user-teams'

import Table from 'components/Grid/Table'
import Tooltip from 'components/tooltip'
import ActionButton from 'components/Button/ActionButton'
import LoadingContainer from 'components/LoadingContainer'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface CellProps {
  rowData: IBrandEmailTemplate
}

interface GetTrProps {
  original: IBrandEmailTemplate
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body2: {
      color: theme.palette.grey['500']
    },
    deleteButtonWrapper: {
      textAlign: 'right'
    }
  })
)

interface Props {
  brand: UUID
  isFetching: boolean
  templates: IBrandEmailTemplate[]
  onItemClick: (IBrandEmailTemplate) => void
  deleteEmailTemplate: IAsyncActionProp<typeof deleteEmailTemplate>
  fetchEmailTemplates: IAsyncActionProp<typeof fetchEmailTemplates>
}

function EmailTemplatesList({
  brand,
  isFetching,
  templates,
  onItemClick,
  deleteEmailTemplate,
  fetchEmailTemplates
}: Props) {
  const classes = useStyles()
  const [deletingItems, setDeletingItems] = useState<string[]>([])
  const modal = useContext(ConfirmationModalContext)

  const isTemplateDeleting = (id: UUID): boolean => deletingItems.includes(id)
  const removeFromDeletingItems = (id: UUID): void =>
    setDeletingItems(deletingItems.filter(item => item !== id))
  const addToDeletingItems = (id: UUID): void =>
    setDeletingItems([...deletingItems, id])

  const handleDelete = async (id: UUID): Promise<void> => {
    try {
      addToDeletingItems(id)
      await deleteEmailTemplate(brand, id)
      removeFromDeletingItems(id)
    } catch (error) {
      removeFromDeletingItems(id)
    }
  }

  useEffect(() => {
    fetchEmailTemplates(brand)
  }, [brand, fetchEmailTemplates])

  const columns = [
    {
      header: 'Name',
      id: 'name',
      width: '35%',
      accessor: (template: IBrandEmailTemplate) => template.name,
      render: ({ rowData }: CellProps) => (
        <Typography noWrap component="div" variant="body1">
          {rowData.name}
        </Typography>
      )
    },
    {
      header: 'Content',
      id: 'content',
      sortable: false,
      render: ({ rowData }: CellProps) => (
        <div>
          <Typography noWrap component="div" variant="body1">
            {rowData.subject}
          </Typography>
          <Typography
            noWrap
            component="div"
            variant="body2"
            className={classes.body2}
          >
            {rowData.text}
          </Typography>
        </div>
      )
    },
    {
      id: 'delete',
      sortable: false,
      render: ({ rowData: { id, editable, name } }: CellProps) => (
        <div className={classes.deleteButtonWrapper}>
          <Tooltip
            caption={
              editable ? 'Delete' : "You can't delete default templates."
            }
          >
            <ActionButton
              size="small"
              appearance="outline"
              inverse
              className="danger"
              disabled={!editable}
              onClick={e => {
                e.stopPropagation()

                modal.setConfirmationModal({
                  message: 'Delete Email Template!',
                  description: `Are you sure about deleting "${name}" template?`,
                  confirmLabel: 'Yes, I am sure',
                  onConfirm: () => handleDelete(id)
                })
              }}
            >
              {isTemplateDeleting(id) ? 'Deleting...' : 'Delete'}
            </ActionButton>
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <Table
      data={templates}
      columns={columns}
      isFetching={isFetching}
      plugins={{ sortable: {} }}
      LoadingState={() => <LoadingContainer style={{ padding: '20% 0' }} />}
      getTrProps={(index: number, { original: template }: GetTrProps) => {
        return {
          onClick: isTemplateDeleting(template.id)
            ? () => {}
            : () => onItemClick(template),
          style: { cursor: 'pointer' }
        }
      }}
    />
  )
}

const mapStateToProps = (state: IAppState) => {
  const brand = getActiveTeamId(state.user) || ''

  return {
    brand,
    templates: selectEmailTemplates(state.emailTemplates, brand),
    isFetching: selectEmailTemplatesIsFetching(state.emailTemplates, brand)
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    fetchEmailTemplates: (...args: Parameters<typeof fetchEmailTemplates>) =>
      dispatch(fetchEmailTemplates(...args)),
    deleteEmailTemplate: (...args: Parameters<typeof deleteEmailTemplate>) =>
      dispatch(deleteEmailTemplate(...args))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailTemplatesList)
