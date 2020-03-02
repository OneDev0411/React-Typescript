import React, { useContext, useState } from 'react'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { addNotification as notify } from 'reapop'
import { Helmet } from 'react-helmet'
import { Box, Typography, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import Table from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import Link from 'components/ALink'
import VerticalDotsIcon from 'components/SvgIcons/MoreVert/IconMoreVert'
import { BasicDropdown } from 'components/BasicDropdown'

import { getActiveTeamId } from 'utils/user-teams'
import { goTo } from 'utils/go-to'
import { useGetBrandFlows } from 'hooks/use-get-brand-flows'

import { deleteBrandFlow } from 'models/flows/delete-brand-flow'

import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import { getFlowEditUrl, createFlow } from '../helpers'
import New from '../New'
import CtaBar from '../../Account/components/CtaBar'

import { getFlowActions } from './helpers'

const useStyles = makeStyles((theme: Theme) => ({
  name: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(1.5),
    '&:not(:hover)': {
      color: theme.palette.common.black
    }
  },
  description: {
    paddingRight: theme.spacing(2),
    color: theme.palette.grey[500]
  },
  enrolledContacts: {
    color: theme.palette.grey[500]
  }
}))

interface Props {
  user: IUser
  notify: IAsyncActionProp<typeof notify>
}

function List(props: Props) {
  const brand = getActiveTeamId(props.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<IBrandFlow | null>(null)
  const { flows, reloadFlows, isFetching, error } = useGetBrandFlows(brand)
  const confirmation = useContext(ConfirmationModalContext)

  async function newFlowSubmitHandler(flowData: IBrandFlowInput) {
    try {
      const brandId = getActiveTeamId(props.user)

      if (brandId === null) {
        props.notify({
          message: 'You need to be in a team in order to create a flow',
          status: 'error'
        })

        return
      }

      await createFlow(brandId, flowData, selectedFlow, createdFlow => {
        goTo(
          getFlowEditUrl(createdFlow.id),
          null,
          {},
          {
            flow: createdFlow
          }
        )
      })
    } catch (err) {
      console.error(err)
      props.notify({
        message: 'Unexpected error happened',
        status: 'error'
      })
      setIsModalOpen(false)
      setSelectedFlow(null)
    }
  }

  const classes = useStyles()

  const columns: TableColumn<IBrandFlow>[] = [
    {
      header: 'Name',
      id: 'name',
      primary: true,
      width: '33%',
      render: ({ row }) => (
        <Link to={`/dashboard/account/flows/${row.id}`}>
          <Typography noWrap variant="body1" classes={{ root: classes.name }}>
            {row.name}
          </Typography>
        </Link>
      )
    },
    {
      header: 'Description',
      id: 'description',
      render: ({ row }) => (
        <Typography
          noWrap
          variant="body2"
          classes={{ root: classes.description }}
        >
          {row.description}
        </Typography>
      )
    },
    {
      header: 'Enrolled Contacts',
      id: 'cotnacts',
      width: '160px',
      render: ({ row }) => (
        <Typography
          variant="body2"
          classes={{ root: classes.enrolledContacts }}
        >
          {row.active_flows} Enrolled
        </Typography>
      )
    },
    {
      id: 'actions',
      width: '32px',
      render: ({ row }) => {
        const actions = getFlowActions(row)

        return (
          <Box display="flex" justifyContent="flex-end">
            <BasicDropdown
              fullHeight
              pullTo="right"
              selectedItem={null}
              buttonRenderer={(btnProps: any) => (
                <VerticalDotsIcon {...btnProps} />
              )}
              items={actions}
              onSelect={(action: typeof actions[number]) => {
                switch (action.value) {
                  case 'duplicate':
                    setSelectedFlow(row)
                    setIsModalOpen(true)
                    break

                  case 'delete':
                    confirmation.setConfirmationModal({
                      message: `Delete "${row.name}" Flow?`,
                      description: `This Flow will be deleted 
                      and you can not use it anymore. Are you sure?`,
                      onConfirm: async () => {
                        if (!brand) {
                          return
                        }

                        await deleteBrandFlow(brand, row.id)
                        await reloadFlows()
                        props.notify({
                          message: `"${row.name}" Flow deleted.`,
                          status: 'success'
                        })
                      }
                    })
                    break

                  case 'edit':
                  case 'view':
                    goTo(getFlowEditUrl(row.id))
                    break
                }
              }}
            />
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <Helmet>
        <title>Flows | Rechat</title>
      </Helmet>

      {isModalOpen && (
        <New
          onClose={() => {
            setIsModalOpen(false)
            setSelectedFlow(null)
          }}
          onSubmit={newFlowSubmitHandler}
          flow={selectedFlow}
        />
      )}

      <CtaBar
        label="Create new flow"
        description="Create a custom flow for your specific needs – We’ll take care of the rest!"
        onClick={() => setIsModalOpen(true)}
      />

      {error ? (
        <h4>{error}</h4>
      ) : isFetching ? (
        <LoadingComponent />
      ) : (
        <Table
          columns={columns}
          rows={flows}
          totalRows={(flows || []).length}
          loading={isFetching ? 'middle' : null}
          LoadingStateComponent={LoadingComponent}
        />
      )}
    </>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    notify: (...args: Parameters<typeof notify>) => dispatch(notify(...args))
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)
