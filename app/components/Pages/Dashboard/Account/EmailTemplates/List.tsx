import * as React from 'react'
import { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  makeStyles,
  Theme,
  Typography,
  Box,
  IconButton
} from '@material-ui/core'

import { IAppState } from 'reducers'
import {
  selectEmailTemplates,
  selectEmailTemplatesIsFetching
} from 'reducers/email-templates'

import { fetchEmailTemplates } from 'actions/email-templates/fetch-email-templates'
import { deleteEmailTemplate } from 'actions/email-templates/delete-email-template'

import { getActiveTeamId } from 'utils/user-teams'

import Table from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import Tooltip from 'components/tooltip'
import LoadingContainer from 'components/LoadingContainer'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import TrashIcon from 'components/SvgIcons/Trash/TrashIcon'

const useStyles = makeStyles((theme: Theme) => ({
  name: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(1.5),
    '&:not(:hover)': {
      color: theme.palette.common.black
    }
  },
  subject: {
    paddingRight: theme.spacing(2)
  },
  body: {
    paddingRight: theme.spacing(2)
  },
  actions: {
    flexGrow: 1,
    textAlign: 'right',
    '&:hover svg *': {
      fill: theme.palette.error.main
    }
  },
  row: {
    '&:not(:hover)': {
      '& $subject': {
        color: theme.palette.grey[500]
      },
      '& $body': {
        color: theme.palette.grey[500]
      },
      '& $actions': {
        display: 'none'
      }
    }
  }
}))

interface Props {
  brand: UUID
  isFetching: boolean
  templates: IBrandEmailTemplate[]
  onItemClick: (item: IBrandEmailTemplate) => void
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

  const columns: TableColumn<IBrandEmailTemplate>[] = [
    {
      header: 'Name',
      id: 'name',
      width: '25%',
      primary: true,
      accessor: template => template.name,
      render: ({ row }) => (
        <Typography noWrap variant="body2" classes={{ root: classes.name }}>
          {row.name}
        </Typography>
      )
    },
    {
      header: 'Subject',
      id: 'subject',
      width: '30%',
      sortable: false,
      render: ({ row }) => (
        <Typography noWrap variant="body2" classes={{ root: classes.subject }}>
          {row.subject}
        </Typography>
      )
    },
    {
      header: 'Body',
      id: 'body-actions',
      sortable: false,
      render: ({ row }) => (
        <Box display="flex" alignItems="center" paddingRight={4}>
          <Typography noWrap variant="body2" classes={{ root: classes.body }}>
            {row.text}
          </Typography>
          <div className={classes.actions}>
            <Tooltip
              caption={
                row.editable ? 'Delete' : "You can't delete default templates." // TODO: Tooltip doen't work for disabled buttons.
              }
            >
              <IconButton
                disabled={!row.editable || isTemplateDeleting(row.id)}
                onClick={e => {
                  e.stopPropagation()

                  modal.setConfirmationModal({
                    message: 'Delete Email Template!',
                    description: `Are you sure about deleting "${
                      row.name
                    }" template?`,
                    confirmLabel: 'Yes, I am sure',
                    onConfirm: () => handleDelete(row.id)
                  })
                }}
              >
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Box>
      )
    }
  ]

  return (
    <Table
      rows={templates}
      totalRows={(templates || []).length}
      columns={columns}
      loading={isFetching ? 'middle' : null}
      LoadingStateComponent={() => (
        <LoadingContainer style={{ padding: '20% 0' }} />
      )}
      getTrProps={({ row }) => ({
        onClick: isTemplateDeleting(row.id) ? () => {} : () => onItemClick(row),
        style: { cursor: 'pointer' }
      })}
      classes={{ row: classes.row }}
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
