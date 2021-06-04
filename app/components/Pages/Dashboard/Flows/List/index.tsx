import React, { useContext, useState } from 'react'

import { connect, useDispatch } from 'react-redux'

import { Helmet } from 'react-helmet'
import { withRouter, WithRouterProps } from 'react-router'
import { Typography, Theme, IconButton, MenuItem } from '@material-ui/core'
import { Box, makeStyles, useTheme } from '@material-ui/core'
import { mdiDotsHorizontal } from '@mdi/js'

import { addNotification as notify } from 'components/notification'

import Table from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getActiveTeamId } from 'utils/user-teams'
import { goTo } from 'utils/go-to'
import { useGetBrandFlows } from 'hooks/use-get-brand-flows'

import { deleteBrandFlow } from 'models/flows/delete-brand-flow'

import Layout from '../../Marketing'

import { LoadingComponent } from '../../Contacts/List/Table/components/LoadingComponent'

import { getFlowEditUrl, createFlow } from '../helpers'
import New from '../New'
import CtaBar from '../../Account/components/CtaBar'

import { getFlowActions } from './helpers'

const useStyles = makeStyles((theme: Theme) => ({
  name: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(1.5)
  },
  description: {
    paddingRight: theme.spacing(2)
  },
  enrolledContacts: {},
  actions: {
    marginRight: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  row: {
    cursor: 'pointer',
    '&:hover': {
      '& $name': {
        color: theme.palette.secondary.main
      }
    },
    '&:not(:hover)': {
      '& $description': {
        color: theme.palette.grey[500]
      },
      '& $enrolledContacts': {
        color: theme.palette.grey[500]
      },
      '& $actions': {
        display: 'none'
      }
    }
  }
}))

interface Props {
  user: IUser
}

function List(props: Props & WithRouterProps) {
  const dispatch = useDispatch()
  const brand = getActiveTeamId(props.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<IBrandFlow | null>(null)
  const { flows, reloadFlows, isFetching, error } = useGetBrandFlows(brand)
  const confirmation = useContext(ConfirmationModalContext)
  const theme = useTheme<Theme>()

  async function newFlowSubmitHandler(flowData: IBrandFlowInput) {
    try {
      const brandId = getActiveTeamId(props.user)

      if (brandId === null) {
        dispatch(
          notify({
            message: 'You need to be in a team in order to create a flow',
            status: 'error'
          })
        )

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
      dispatch(
        notify({
          message: 'Unexpected error happened',
          status: 'error'
        })
      )
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
        <Typography noWrap variant="body2" classes={{ root: classes.name }}>
          {row.name}
        </Typography>
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
      width: `${theme.spacing(4)}px`,
      render: ({ row }) => {
        return (
          <BaseDropdown
            PopperProps={{
              placement: 'bottom-end'
            }}
            renderDropdownButton={buttonProps => (
              <IconButton
                {...buttonProps}
                style={{
                  padding: 0
                }}
              >
                <SvgIcon path={mdiDotsHorizontal} />
              </IconButton>
            )}
            renderMenu={({ close }) => (
              <div>
                {getFlowActions(row).map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      close()

                      switch (item.value) {
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
                              dispatch(
                                notify({
                                  message: `"${row.name}" Flow deleted.`,
                                  status: 'success'
                                })
                              )
                            }
                          })
                          break

                        case 'edit':
                        case 'view':
                          goTo(getFlowEditUrl(row.id))
                          break
                      }
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </div>
            )}
          />
        )
      }
    }
  ]

  return (
    <>
      <Helmet>
        <title>Marketing | Flows</title>
      </Helmet>
      <Layout
        render={() => (
          <Box mt={2}>
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
                getTdProps={({ column, row }) => ({
                  onClick: () => {
                    if (column.id !== 'actions') {
                      props.router.push(`/dashboard/marketing/flows/${row.id}`)
                    }
                  }
                })}
                classes={{ row: classes.row }}
              />
            )}
          </Box>
        )}
      />
    </>
  )
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps)(withRouter(List))
