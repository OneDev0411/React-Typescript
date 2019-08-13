import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers/index'
import { selectEmailTemplates, selectEmailTemplatesIsFetching } from 'reducers/email-templates'

import { fetchEmailTemplates } from 'actions/email-templates/fetch-email-templates'
import { deleteEmailTemplate } from 'actions/email-templates/delete-email-template'

import { getActiveTeamId } from 'utils/user-teams'

import Table from 'components/Grid/Table'
import LoadingContainer from 'components/LoadingContainer'
import { DangerButton } from 'components/Button/DangerButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body2: {
      color: theme.palette.grey['500']
    }
  })
)

interface Props {
  brand: UUID
  isFetching: boolean
  templates: IBrandEmailTemplate[]
  handleOnClickRow: (IBrandEmailTemplate) => void,
  deleteEmailTemplate: IAsyncActionProp<typeof deleteEmailTemplate>
  fetchEmailTemplates: IAsyncActionProp<typeof fetchEmailTemplates>
}

function EmailTemplatesList({
  brand,
  isFetching,
  templates,
  handleOnClickRow,
  deleteEmailTemplate,
  fetchEmailTemplates,
}: Props) {
  const classes = useStyles();
  const [deletingItems, setDeletingItems] = useState([''])

  const isDeleting = (id: UUID): boolean => deletingItems.includes(id)
  const removeFromDeletingItems = (id: UUID): void =>
    setDeletingItems(deletingItems.filter(item => item !== id))
  const addToDeletingItems = (id: UUID): void => setDeletingItems([
    ...deletingItems,
    id
  ])

  const handleDelete = useCallback(async (id: UUID): Promise<void> => {
    try {
      addToDeletingItems(id)
      await deleteEmailTemplate(brand, id)
      removeFromDeletingItems(id)
    } catch (error) {
      removeFromDeletingItems(id)
    }
  }, [brand, addToDeletingItems, deleteEmailTemplate, removeFromDeletingItems])

  useEffect(() => {
    fetchEmailTemplates(brand)
  }, [brand, fetchEmailTemplates])

  const columns = [
    {
      header: 'Name',
      id: 'name',
      width: '35%',
      accessor: template => template.name,
      render: ({ rowData }) =>
        <Typography
          noWrap
          component="div"
          variant="body1"
        >
          {rowData.name}
        </Typography>
    },
    {
      header: 'Content',
      id: 'content',
      sortable: false,
      render: ({ rowData }) => (
        <div>
          <Typography
            noWrap
            component="div"
            variant="body1"
          >
            {rowData.subject}
          </Typography>
          <Typography
            noWrap
            component="div"
            variant="body2"
            className={classes.body2}
          >
            {rowData.body}
          </Typography>
        </div>
      )
    },
    {
      id: 'delete',
      sortable: false,
      render: ({ rowData: { id } }) => (
        <div style={{ textAlign: 'right' }}>
          <DangerButton
            size="small"
            variant="outlined"
            onClick={(e) => {
              handleDelete(id)
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            {isDeleting(id) ? 'Deleting...' : 'Delete'}
          </DangerButton>
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
      getTrProps={(index, { original: template }) => {
        const _isDeleting = isDeleting(template.id)
        return {
          onClick: _isDeleting ? () => { } : () => handleOnClickRow(template),
          style: {
            cursor: 'pointer',
            pointerEvents: _isDeleting ? 'none' : 'initial'
          }
        }
      }}
    />
  )
}

const mapStateToProps = (state: IAppState) => {
  const brand = getActiveTeamId(state.user) || ''
  const { emailTemplates } = state

  return {
    brand,
    templates: selectEmailTemplates(emailTemplates, brand),
    isFetching: selectEmailTemplatesIsFetching(emailTemplates, brand)
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
