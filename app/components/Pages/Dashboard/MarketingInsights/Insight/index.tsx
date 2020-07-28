import React, { useState } from 'react'
import {
  Box,
  Dialog,
  Theme,
  Typography,
  Avatar,
  Tooltip
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Helmet } from 'react-helmet'
import {
  mdiCheckAll,
  mdiEyeOutline,
  mdiCursorDefaultClickOutline,
  mdiAccountMultipleOutline
} from '@mdi/js'
import classNames from 'classnames'

import { PageTabs, Tab, TabSpacer } from 'components/PageTabs'
import { formatDate } from 'components/DateTimePicker/helpers'
import { EmailThread } from 'components/EmailThread'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getEmailCampaign } from 'models/email/get-email-campaign'
import { getEmailCampaignEmail } from 'models/email/helpers/get-email-campaign-email'

import Header from './Header'
import { Container } from '../../Contacts/components/Container'
import Loading from '../../../../Partials/Loading'
import { hasPixelTracking, valueAndPercent } from '../List/helpers'
import useItemData from './useItemData'
import ContactsTable from './ContactsTable'
import { ContactsListType } from './types'
import SortField, { SortableColumnsType as SortFieldType } from './SortField'

const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  senderWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing(1)
  },
  avatar: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.text.primary
  },
  senderAvatar: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    fontSize: theme.spacing(2)
  },
  enabledText: {
    color: theme.palette.common.black
  },
  disabledText: {
    color: theme.palette.action.disabled
  },
  activeText: {
    color: theme.palette.action.active
  },
  insightContainer: {
    padding: theme.spacing(0, 3, 6, 3)
  },
  summary: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.action.disabledBackground}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(3, 2),
    overflow: 'hidden'
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    width: theme.spacing(25)
  },
  summaryItemAvatar: {
    height: theme.spacing(5),
    width: theme.spacing(5),
    marginRight: theme.spacing(2)
  },
  summaryItemInfo: {
    width: theme.spacing(16)
  }
}))

interface Props {
  params: {
    id: string
  }
}

function Insight({ params: { id } }: Props) {
  const [sortField, setSortField] = useState<SortFieldType>({
    label: 'Most Opened',
    value: 'opened',
    ascending: false
  })
  const [isOpenViewEmail, setOpenViewEmail] = React.useState(false)
  const { item, isLoading } = useItemData(id)
  const [emailPreview, setEmailPreview] = useState<IEmail<
    IEmailOptionalFields
  > | null>(null)

  const classes = useStyles()

  if (isLoading) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  if (!item) {
    // TODO: Adding a fallback (This useful for when a request failing, or a user doesn't have access to the item.)
    return null
  }

  const sentFrom: ContactsListType = {
    display_name: item.from ? item.from.display_name || '' : '',
    to: item.from ? item.from.email : '',
    profile_image_url: item.from ? item.from.profile_image_url : ''
    // TODO(mojtaba): fix missing fields either make them optional in type
    //  definition, or provide them here
  } as ContactsListType
  const sentFromTitle = sentFrom.display_name || sentFrom.to
  const pixelTracking = hasPixelTracking(item)
  const summaryItems = [
    {
      icon: mdiAccountMultipleOutline,
      value: `${item.sent} Recipient${item.sent === 1 ? '' : 's'}`,
      label: 'Total Sent'
    },
    {
      icon: mdiCheckAll,
      value: valueAndPercent(item.delivered, item.sent),
      label: 'Delivered',
      tooltip: `${valueAndPercent(item.failed, item.sent)} Bounced`,
      hidden: pixelTracking
    },
    {
      icon: mdiEyeOutline,
      value: `${item.opened}`,
      label: 'Opens',
      tooltip: `Email is opened ${item.opened} time${
        item.opened === 1 ? '' : 's'
      }`,
      hidden: !pixelTracking
    },
    {
      icon: mdiEyeOutline,
      value: `${valueAndPercent(item.opened, item.sent)}`,
      label: 'Opened',
      tooltip: `${item.opened} People have opened the email`,
      hidden: pixelTracking
    },
    {
      icon: mdiCursorDefaultClickOutline,
      value: `${item.clicked}`,
      label: 'Clicks',
      tooltip: `Email is clicked ${item.clicked} time${
        item.clicked === 1 ? '' : 's'
      }`,
      hidden: !pixelTracking
    },
    {
      icon: mdiCursorDefaultClickOutline,
      value: `${valueAndPercent(item.clicked, item.sent)}`,
      label: 'Clicked',
      tooltip: `${item.clicked} People have clicked the email`,
      hidden: pixelTracking
    }
  ]

  const openEmailView = async () => {
    try {
      if (!emailPreview) {
        const email = await getEmailCampaign(id, {
          emailCampaignAssociations: ['emails'],
          emailRecipientsAssociations: [],
          emailFields: ['html', 'text'],
          limit: 1
        })

        setEmailPreview(getEmailCampaignEmail(email))
      }
    } catch (e) {
      console.error('something went wrong for loading preview')
    } finally {
      setOpenViewEmail(true)
    }
  }

  const closeEmailView = () => {
    setOpenViewEmail(false)
  }

  return (
    <>
      <Helmet>
        <title>{`${
          item.subject ? `${item.subject} | ` : ''
        }Marketing Insights | Rechat`}</title>
      </Helmet>
      <div className={classes.pageContainer}>
        <Header
          backUrl="/dashboard/insights"
          title={item.subject}
          onViewEmail={openEmailView}
        />
        <Dialog
          maxWidth="lg"
          fullWidth
          onClose={closeEmailView}
          open={isOpenViewEmail}
        >
          {emailPreview && (
            <EmailThread
              messages={[emailPreview]}
              subject={emailPreview.subject}
              onClose={closeEmailView}
            />
          )}
        </Dialog>
        <Box px={3} pb={2}>
          <PageTabs
            defaultValue="unknown"
            tabs={[
              <TabSpacer key="sender-spacer">
                <div className={classes.senderWrapper}>
                  <Typography variant="body2" className={classes.disabledText}>
                    Sent From&nbsp;&nbsp;
                  </Typography>
                  <Avatar
                    alt={sentFromTitle}
                    src={sentFrom.profile_image_url || ''}
                    className={classNames(classes.avatar, classes.senderAvatar)}
                  >
                    {sentFromTitle.substring(0, 1).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" className={classes.enabledText}>
                    &nbsp;&nbsp;{sentFromTitle}
                  </Typography>
                  <Typography variant="body2" className={classes.disabledText}>
                    &nbsp;on
                  </Typography>
                  <Typography variant="body2" className={classes.enabledText}>
                    &nbsp;{formatDate(item.executed_at! * 1000)}
                  </Typography>
                </div>
              </TabSpacer>,
              <Tab
                key="sort-field"
                label={
                  <SortField
                    sortLabel={sortField.label}
                    onChange={setSortField}
                  />
                }
              />
            ]}
          />
        </Box>
        <div className={classes.insightContainer}>
          <div className={classes.summary}>
            {summaryItems.map(
              ({ icon, value, label, tooltip, hidden }, index) =>
                hidden ? null : (
                  <Tooltip title={tooltip || ''} placement="bottom-start">
                    <div key={index} className={classes.summaryItem}>
                      <Avatar
                        className={classNames(
                          classes.avatar,
                          classes.summaryItemAvatar
                        )}
                      >
                        <SvgIcon path={icon} />
                      </Avatar>
                      <div className={classes.summaryItemInfo}>
                        <Typography
                          variant="subtitle1"
                          display="block"
                          noWrap
                          className={classes.enabledText}
                        >
                          {value}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          noWrap
                          className={classes.activeText}
                        >
                          {label}
                        </Typography>
                      </div>
                    </div>
                  </Tooltip>
                )
            )}
          </div>
          <section className="content">
            <ContactsTable
              item={item}
              sortBy={sortField}
              onChangeSort={setSortField}
            />
          </section>
        </div>
      </div>
    </>
  )
}

export default Insight
