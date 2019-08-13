import * as React from 'react'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers/index'
import { selectEmailTemplates, selectEmailTemplatesIsFetching, selectEmailTemplatesError } from 'reducers/email-templates'

import { fetchEmailTemplates } from 'actions/email-templates/fetch-email-templates'

import { getActiveTeamId } from 'utils/user-teams'

import Table from 'components/Grid/Table'
import LoadingContainer from 'components/LoadingContainer'

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
  handleOnClickRow: (IBrandEmailTemplate) => void
  fetchEmailTemplates: IAsyncActionProp<typeof fetchEmailTemplates>
}

function EmailTemplatesList({
  brand,
  isFetching,
  templates,
  handleOnClickRow,
  fetchEmailTemplates
}: Props) {
  const classes = useStyles();

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
    }
  ]

  return (
    <Table
      columns={columns}
      data={templates}
      plugins={{ sortable: {} }}
      isFetching={isFetching}
      LoadingState={() => <LoadingContainer style={{ padding: '20% 0' }} />}
      getTrProps={(index, { original: template }) => ({
        onClick: () => handleOnClickRow(template),
        style: { cursor: 'pointer' }
      })}
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
      dispatch(fetchEmailTemplates(...args))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailTemplatesList)
