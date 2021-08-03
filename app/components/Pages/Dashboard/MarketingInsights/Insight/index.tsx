import React, { useState } from 'react'

import {
  Dialog,
  Theme,
  Typography,
  Tooltip,
  makeStyles,
  Avatar as MUIAvatar
} from '@material-ui/core'
import {
  mdiCheckAll,
  mdiEyeOutline,
  mdiCursorDefaultClickOutline,
  mdiAccountMultipleOutline
} from '@mdi/js'
import classNames from 'classnames'
import pluralize from 'pluralize'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { Avatar } from 'components/Avatar'
import { formatDate } from 'components/DateTimePicker/helpers'
import EmailNotificationSetting from 'components/EmailNotificationSetting'
import { EmailThread } from 'components/EmailThread'
import { addNotification } from 'components/notification'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import useLabeledSwitchHandlers from 'hooks/use-labeled-switch-handlers'
import { getContactNameInitials } from 'models/contacts/helpers'
import { getEmailCampaign } from 'models/email/get-email-campaign'
import { getEmailCampaignEmail } from 'models/email/helpers/get-email-campaign-email'
import { setEmailNotificationStatus } from 'models/email/set-email-notification-status'

import Loading from '../../../../Partials/Loading'
import { Container } from '../../Contacts/components/Container'
import { hasPixelTracking, valueAndPercent } from '../List/helpers'

import ContactsTable from './ContactsTable'
import Header from './Header'
import SortField, { SortableColumnsType as SortFieldType } from './SortField'
import { ContactsListType } from './types'
import { useItemData } from './useItemData'

const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerWrapper: {
    padding: theme.spacing(0, 3, 1, 3)
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing(1),
    margin: theme.spacing(1, 0),
    borderBottom: `1px solid ${theme.palette.divider}`
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
  grow: {
    flexGrow: 1
  },
  mainText: {
    color: theme.palette.common.black
  },
  labelText: {
    color: theme.palette.grey[500]
  },
  sortFieldWrapper: {
    padding: theme.spacing(0.5, 0)
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
  },
  settingsContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  }
}))

interface Props {
  params: {
    id: string
  }
}

function Insight({ location, params: { id } }: Props & WithRouterProps) {
  const [sortField, setSortField] = useState<SortFieldType>({
    label: 'Most Opened',
    value: 'opened',
    ascending: false
  })
  const [isOpenViewEmail, setOpenViewEmail] = useState(false)
  const { item, isLoading, reload } = useItemData(id)
  const [emailPreview, setEmailPreview] =
    useState<IEmail<IEmailOptionalFields> | null>(null)

  const dispatch = useDispatch()

  const emailNotificationSettingHandlers = useLabeledSwitchHandlers(
    item?.notifications_enabled,
    async checked => {
      if (!item) {
        return
      }

      try {
        await setEmailNotificationStatus(item.id, checked)
      } catch (error) {
        console.error(error)
        dispatch(
          addNotification({
            status: 'error',
            message: 'Unable to change email notification setting.'
          })
        )
      } finally {
        try {
          await reload()
        } catch (error) {
          console.error(error)
          dispatch(
            addNotification({
              status: 'error',
              message: 'Unable to refresh the page.'
            })
          )
        }
      }
    }
  )

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
    // TODO(mojtaba): Fix missing fields either make them optional in type definition, or provide them here
  } as ContactsListType
  const sentFromTitle = sentFrom.display_name || sentFrom.to
  const pixelTracking = hasPixelTracking(item)
  const summaryItems = [
    {
      icon: mdiAccountMultipleOutline,
      value: pluralize('Recipient', item.sent, true),
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
      tooltip: `Email is opened ${pluralize('time', item.opened, true)}`,
      hidden: !pixelTracking
    },
    {
      icon: mdiEyeOutline,
      value: `${valueAndPercent(item.opened, item.delivered)}`,
      label: 'Opened',
      tooltip: `${item.opened} People have opened the email`,
      hidden: pixelTracking
    },
    {
      icon: mdiCursorDefaultClickOutline,
      value: `${item.clicked}`,
      label: 'Clicks',
      tooltip: `Email is clicked ${pluralize('time', item.clicked, true)}`,
      hidden: !pixelTracking
    },
    {
      icon: mdiCursorDefaultClickOutline,
      value: `${valueAndPercent(item.clicked, item.delivered)}`,
      label: 'Clicked',
      tooltip: `${item.clicked} People have clicked the email`,
      hidden: pixelTracking
    }
  ]

  const openViewEmail = async () => {
    try {
      if (!emailPreview) {
        const emailCampaign = await getEmailCampaign(id, {
          emailCampaignAssociations: ['emails', 'attachments'],
          emailRecipientsAssociations: [],
          emailFields: ['html', 'text'],
          limit: 1
        })
        const email = getEmailCampaignEmail(emailCampaign)

        setEmailPreview(email)
      }
    } catch (error) {
      console.error(error)
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
          backUrl={location.query?.backUrl ?? '/dashboard/insights'}
          title={item.subject}
          viewEmailDisabled={!item.emails}
          onViewEmail={openViewEmail}
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
        <div className={classes.headerWrapper}>
          <div className={classes.header}>
            <Typography variant="body2" className={classes.labelText}>
              Sent From&nbsp;&nbsp;
            </Typography>
            <Avatar
              url={sentFrom.profile_image_url || ''}
              alt={sentFromTitle}
              size="small"
            >
              {getContactNameInitials(sentFrom)}
            </Avatar>
            <Typography variant="body2" className={classes.mainText}>
              &nbsp;&nbsp;{sentFromTitle}
            </Typography>
            <Typography variant="body2" className={classes.labelText}>
              &nbsp;on
            </Typography>
            <Typography variant="body2" className={classes.mainText}>
              &nbsp;{formatDate(item.executed_at! * 1000)}
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sortFieldWrapper}>
              <SortField sortLabel={sortField.label} onChange={setSortField} />
            </div>
          </div>
        </div>
        <div className={classes.insightContainer}>
          <div className={classes.summary}>
            {summaryItems.map(
              ({ icon, value, label, tooltip, hidden }, index) =>
                hidden ? null : (
                  <Tooltip
                    key={index}
                    title={tooltip || ''}
                    placement="bottom-start"
                  >
                    <div className={classes.summaryItem}>
                      <MUIAvatar
                        className={classNames(
                          classes.avatar,
                          classes.summaryItemAvatar
                        )}
                      >
                        <SvgIcon path={icon} />
                      </MUIAvatar>
                      <div className={classes.summaryItemInfo}>
                        <Typography
                          variant="subtitle1"
                          display="block"
                          noWrap
                          className={classes.mainText}
                        >
                          {value}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          noWrap
                          className={classes.labelText}
                        >
                          {label}
                        </Typography>
                      </div>
                    </div>
                  </Tooltip>
                )
            )}
            <div className={classes.settingsContainer}>
              <EmailNotificationSetting {...emailNotificationSettingHandlers} />
            </div>
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

export default withRouter(Insight)
