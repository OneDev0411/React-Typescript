import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Alert } from '@material-ui/lab'
import { Box, Link, IconButton, Theme, makeStyles } from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { ACL } from 'constants/acl'
import { IAppState } from 'reducers'
import { OPEN_HOUSE_REQUESTS_SETTINGS_KEY } from 'constants/user'
import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks'
import { getActiveTeamId, getActiveTeamSettings } from 'utils/user-teams'

import { RenderProps } from 'components/Grid/Table/types'
import { useGridStyles } from 'components/Grid/Table/styles'
import Acl from 'components/Acl'
import Table from 'components/Grid/Table'
import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import { SET_CREATE_CALLBACK_HANDLER } from 'components/GlobalActionsButton/context/constants'
import { useGlobalActionContext } from 'components/GlobalActionsButton/hooks/use-global-action-context'

import EmptyState from './EmptyState'
import Avatar from './columns/Avatar'
import Title from './columns/Title'
import Date from './columns/Date'
import Registrants from './columns/Registrants'
import GuestRegistration from './columns/GuestRegistration'
import Actions from './columns/Actions'

interface Associations {
  deal?: IDeal
  listing?: ICompactListing
}

type TableRow = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>

const useAlertStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      marginBottom: theme.spacing(2)
    },
    message: {
      '& a, & a:hover': {
        color: theme.palette.info.dark,
        textDecoration: 'none'
      }
    }
  }),
  { name: 'MuiAlert' }
)

function OpenHousesList() {
  useAlertStyles()

  const [, dispatch] = useGlobalActionContext()
  const gridClasses = useGridStyles()

  const { list, isFetching, error, reloadList } = useFilterCRMTasks(
    {
      order: '-due_date',
      task_type: 'Open House'
    },
    {
      isFetching: true
    }
  )

  const user = useSelector<IAppState, IUser>(store => store.user)
  const activeBrandId = getActiveTeamId(user) || ''
  const activeBrandSettings = getActiveTeamSettings(user, '', true)
  const showNotifyOfficeBanner =
    activeBrandSettings[OPEN_HOUSE_REQUESTS_SETTINGS_KEY]

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAlertOpen, setAlertToOpen] = useState(true)
  const [selectedOH, setSelectedOH] = useState<ICRMTask<
    CRMTaskAssociation,
    CRMTaskAssociationType
  > | null>(null)
  const [associations, setAssociations] = useState<Associations | null>(null)

  useEffectOnce(() => {
    dispatch({
      type: SET_CREATE_CALLBACK_HANDLER,
      handlers: {
        onCreateOpenHouse: reloadList
      }
    })
  })

  const handleEdit = (
    openHouse: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    setSelectedOH(openHouse)
    setIsDrawerOpen(true)
  }

  const columns = [
    {
      header: 'Avatar',
      id: 'Avatar',
      width: '60px',
      render: ({ row }: RenderProps<TableRow>) => (
        <Avatar
          listings={
            row.associations
              ? row.associations.filter(a => a.association_type === 'listing')
              : []
          }
        />
      )
    },
    {
      header: 'Title',
      id: 'title',
      primary: true,
      render: ({ row }: RenderProps<TableRow>) => (
        <Title title={row.title} onClick={() => handleEdit(row)} />
      )
    },
    {
      header: 'Date',
      id: 'date',
      class: 'opaque',
      render: ({ row }: RenderProps<TableRow>) => (
        <Date dueDate={row.due_date} />
      )
    },
    {
      header: 'Registrants',
      id: 'registrants',
      width: '100px',
      class: 'opaque',
      render: ({ row }: RenderProps<TableRow>) => (
        <Registrants
          registrants={
            row.associations
              ? row.associations.filter(a => a.association_type === 'contact')
              : []
          }
        />
      )
    },
    {
      id: 'guest-registration',
      width: '200px',
      class: 'visible-on-hover',
      render: ({ row }: RenderProps<TableRow>) => (
        <GuestRegistration activeBrandId={activeBrandId} openHouse={row} />
      )
    },
    {
      id: 'actions',
      width: '50px',
      class: 'visible-on-hover',
      render: ({ row }: RenderProps<TableRow>) => (
        <Actions
          openHouse={row}
          onEdit={() => handleEdit(row)}
          reloadList={reloadList}
        />
      )
    }
  ]

  const onOpenOHDrawer = async (item: ICompactListing | IDeal) => {
    const associations: Associations = {}

    if (['compact_listing', 'property'].includes(item.type)) {
      // @ts-ignore TODO: This is temporary https://rechathq.slack.com/archives/CMXKY2L31/p1574616881213400
      associations.listing = item
    } else if (item.type === 'deal') {
      associations.deal = item
    }

    setAssociations(associations)
    setIsDrawerOpen(true)
  }

  const onCloseOHDrawer = () => {
    setSelectedOH(null)
    setIsDrawerOpen(false)
  }

  const drawerCallback = () => {
    onCloseOHDrawer()
    reloadList()
  }

  const renderContent = () => {
    if (isFetching) {
      return <LoadingContainer style={{ padding: '30vh 0 0' }} />
    }

    if (error) {
      return <h4>{error}</h4>
    }

    if (!list.length) {
      return <EmptyState onOpenDrawer={onOpenOHDrawer} />
    }

    return (
      <Table<TableRow>
        columns={columns}
        rows={list}
        totalRows={(list || []).length}
        loading={isFetching ? 'middle' : null}
        LoadingStateComponent={LoadingContainer}
        classes={{
          row: gridClasses.row
        }}
      />
    )
  }

  return (
    <>
      <Helmet>
        <title>Open House Registration Pages | Rechat</title>
      </Helmet>

      <PageLayout>
        <PageLayout.Header title="Open House Registration Pages" />
        <PageLayout.Main>
          <Box>
            {showNotifyOfficeBanner && (
              <Acl access={ACL.DEALS}>
                {isAlertOpen && (
                  <Alert
                    severity="info"
                    action={
                      <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setAlertToOpen(false)}
                      >
                        <SvgIcon path={mdiClose} />
                      </IconButton>
                    }
                  >
                    <Box>
                      Visit <Link href="/dashboard/deals">deals</Link> to notify
                      your office to book an open house on the MLS. This page is
                      only for creating open house registration pages and
                      events.
                    </Box>
                  </Alert>
                )}
              </Acl>
            )}
            {renderContent()}

            {isDrawerOpen && (
              // @ts-ignore js component
              <OpenHouseDrawer
                deleteCallback={drawerCallback}
                isOpen
                onClose={onCloseOHDrawer}
                openHouse={selectedOH}
                submitCallback={drawerCallback}
                associations={associations}
              />
            )}
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default OpenHousesList
