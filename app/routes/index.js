import { IndexRoute, Route } from 'react-router'

import withAcl from 'components/Acl/with-acl'
import { ACL } from 'constants/acl'

import AppLayout from '../components/App'
import Dashboard from '../components/Pages/Dashboard'
import {
  showingDetailTabs,
  showingsTabs
} from '../components/Pages/Dashboard/Showings/constants'
import Load from '../loader'
import GoToDashboard from '../views/components/GoToDashboard'

// Containers

// Pages

import { withGuest, withSignedInUser } from './hoc'

const AsyncAuthenticationLayout = Load({
  loader: () =>
    import('./components/Authentication' /* webpackChunkName: "authlay" */)
})

/* ==================================== */
//  Auth
/* ==================================== */

const AsyncBranch = Load({
  loader: () =>
    import('../components/Pages/Branch' /* webpackChunkName: "branch" */)
})

const AsyncSignUp = withGuest(
  Load({
    loader: () =>
      import('../components/Pages/Auth/SignUp' /* webpackChunkName: "signup" */)
  })
)

const AsyncRegister = withGuest(
  Load({
    loader: () =>
      import(
        '../components/Pages/Auth/Register' /* webpackChunkName: "register" */
      )
  })
)

const AsyncSignIn = withGuest(
  Load({
    loader: () =>
      import('../components/Pages/Auth/SignIn' /* webpackChunkName: "signin" */)
  })
)

const AsyncSignOut = Load({
  loader: () =>
    import('../components/Pages/Auth/SignOut' /* webpackChunkName: "signout" */)
})

const AsyncVerifyRequest = Load({
  loader: () =>
    import(
      '../components/Pages/Verify/Request' /* webpackChunkName: "request_verify" */
    )
})

const AsyncVerifyConfirm = Load({
  loader: () =>
    import(
      '../components/Pages/Verify/Confirm' /* webpackChunkName: "confirm_verify" */
    )
})

const AsyncForgotPassword = withGuest(
  Load({
    loader: () =>
      import(
        '../components/Pages/Auth/Password/Forgot' /* webpackChunkName: "forgot_password" */
      )
  })
)

const AsyncResetPassword = Load({
  loader: () =>
    import(
      '../components/Pages/Auth/Password/Reset' /* webpackChunkName: "reset_password" */
    )
})

/* ==================================== */
//  Showings Public
/* ==================================== */

const AsyncBookShowing = Load({
  loader: () =>
    import(
      '../components/Pages/Showing/Book' /* webpackChunkName: "book_showing" */
    )
})

const AsyncShowingAppointment = Load({
  loader: () =>
    import(
      '../components/Pages/Showing/Appointment' /* webpackChunkName: "showing_appointment" */
    )
})

const AsyncShowingAppointmentCancel = Load({
  loader: () =>
    import(
      '../components/Pages/Showing/Appointment/Cancel' /* webpackChunkName: "showing_appointment_cancel" */
    )
})

const AsyncShowingAppointmentReschedule = Load({
  loader: () =>
    import(
      '../components/Pages/Showing/Appointment/Reschedule' /* webpackChunkName: "showing_appointment_reschedule" */
    )
})

const AsyncShowingAppointmentFeedback = Load({
  loader: () =>
    import(
      '../components/Pages/Showing/Appointment/Feedback' /* webpackChunkName: "showing_appointment_feedback" */
    )
})

/* ==================================== */
//  Agent On-boarding Wizard
/* ==================================== */

const AsyncConfirmAgentId = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/AgentOnboarding/ConfirmAgentId' /* webpackChunkName: "confirm_agent_id" */
      )
  })
)

const AsyncOnboardingChooseMls = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/AgentOnboarding/ChooseMls' /* webpackChunkName: "onboarding_choose_mls" */
      )
  })
)

const AsyncOnboardingSecurityQuestion = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/AgentOnboarding/SecurityQuestion' /* webpackChunkName: "onboarding_security_question" */
      )
  })
)

const AsyncOnboardingConfigBrand = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/AgentOnboarding/ConfigBrand' /* webpackChunkName: "onboarding_config_brand" */
      )
  })
)

const AsyncOnboardingPhoneNumber = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/AgentOnboarding/PhoneNumber' /* webpackChunkName: "onboarding_phone_number" */
      )
  })
)

const AsyncOnboardingVerifyPhoneNumber = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/AgentOnboarding/VerifyPhoneNumber' /* webpackChunkName: "onboarding_verify_phone_number" */
      )
  })
)

const AsyncOnboardingOAuthAccounts = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/AgentOnboarding/OAuthAccounts' /* webpackChunkName: "onboarding_oauth_accounts" */
      )
  })
)

const AsyncOnboardingProfile = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/AgentOnboarding/Profile' /* webpackChunkName: "onboarding_profile" */
      )
  })
)

/* ==================================== */
//  Overview Page
/* ==================================== */

const AsyncDashboardOverview = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Overview' /* webpackChunkName: "overview" */
      )
  }),
  { oneOf: [ACL.DEALS, ACL.CRM] }
)

/* ==================================== */
//  Player
/* ==================================== */

const AsyncPlayer = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Player' /* webpackChunkName: "player" */
    )
})

/* ==================================== */
//  MLS
/* ==================================== */

const AsyncMLSLayout = Load({
  loader: () =>
    import('../components/Pages/Dashboard/MLS' /* webpackChunkName: "mls" */)
})

const AsyncMLSSearch = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/MLS/ExploreTab' /* webpackChunkName: "mls_search" */
    )
})

const AsyncMLSSavedSearch = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/MLS/SavedSearchTab' /* webpackChunkName: "alerts" */
    )
})

const AsyncMLSFavorites = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/MLS/FavoritesTab' /* webpackChunkName: "fav" */
    )
})

const AsyncMLSSinglePage = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/MLS/ListingPage' /* webpackChunkName: "list_single" */
    )
})

/* ==================================== */
//  Agent Network
/* ==================================== */

const AsyncAgentNetwork = withAcl.agentNetwork(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/AgentNetwork' /* webpackChunkName: "agent_network" */
      )
  })
)

const AsyncAgentNetworkAgents = withAcl.agentNetwork(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/AgentNetwork/Agents' /* webpackChunkName: "agent_network" */
      )
  })
)

/* ==================================== */
//  Deals
/* ==================================== */

const AsyncDealsLayout = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Deals' /* webpackChunkName: "deal_i" */
      )
  }),
  { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
)

const AsyncDealCreate = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Deals/Create/Deal' /* webpackChunkName: "deal_create" */
    )
})

const AsyncDealCreateOffer = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Deals/Create/Offer' /* webpackChunkName: "deal_co" */
    )
})

const AsyncDealsList = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Deals/List' /* webpackChunkName: "deal_l" */
    )
})

const AsyncDealsAnalytics = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Deals/Analytics' /* webpackChunkName: "deal_a" */
    )
})

const AsyncDealDashboard = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Deals/Dashboard' /* webpackChunkName: "deal_d" */
    )
})

const AsyncDealFileViewer = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Deals/FileViewer' /* webpackChunkName: "deal_fv" */
    )
})

const AsyncDealFormEdit = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Deals/FormEdit' /* webpackChunkName: "deal_fe" */
    )
})

/* ==================================== */
//  Calendar
/* ==================================== */

const AsyncCalendar = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Calendar' /* webpackChunkName: "calendar" */
      )
  })
)

/* ==================================== */
//  Contacts
/* ==================================== */

const AsyncContacts = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Contacts' /* webpackChunkName: "contact" */
      )
  })
)

const AsyncContactProfile = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Contacts/Profile' /* webpackChunkName: "contact_p" */
      )
  })
)

const AsyncContactsCsvImport = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Contacts/CsvImport' /* webpackChunkName: "contact_csv" */
      )
  })
)
const AsyncDuplicateContacts = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Contacts/List/Duplicates' /* webpackChunkName: "duplicate_contact" */
      )
  })
)
/* ==================================== */
//  CRM FLOWS
/* ==================================== */

const AsyncFlowsList = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Flows/List' /* webpackChunkName: "flow_list" */
      )
  })
)

const AsyncFlowEdit = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Flows/Edit' /* webpackChunkName: "flow_edit" */
      )
  })
)

/* ==================================== */
//  CRM Open Houses
/* ==================================== */

const AsyncOpenHousesList = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/OpenHouse/List/OpenHousesList' /* webpackChunkName: "oh_list" */
      )
  }),
  [ACL.CRM, ACL.MARKETING]
)

/* ==================================== */
//  CRM Tours List
/* ==================================== */

const AsyncToursList = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Tours/List/ToursList' /* webpackChunkName: "tours_list" */
      )
  })
)

/* ==================================== */
//  Marketing Center
/* ==================================== */

const AsyncMarketingOverview = withAcl.marketing(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Marketing/Overview' /* webpackChunkName: "marketing_overview" */
      )
  })
)

const AsyncMarketingEditor = withAcl.marketing(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Marketing/Editor' /* webpackChunkName: "marketing_editor" */
      )
  })
)

const AsyncMarketingWizard = withAcl.marketing(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Marketing/Wizard' /* webpackChunkName: "marketing_wizard" */
      )
  })
)

const AsyncMarketingMls = withAcl.marketing(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Marketing/Mls' /* webpackChunkName: "marketing_listing" */
      )
  })
)

const AsyncMarketingTemplates = withAcl.marketing(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Marketing/List' /* webpackChunkName: "marketing_templates" */
      )
  })
)

const AsyncMarketingHistory = withAcl.marketing(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Marketing/History' /* webpackChunkName: "marketing_history" */
      )
  })
)

/* ==================================== */
//  Inbox
/* ==================================== */

const AsyncInbox = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Inbox' /* webpackChunkName: "inbox" */
      )
  })
)

/* ==================================== */
//  Insights
/* ==================================== */

const AsyncMarketingInsightsList = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/MarketingInsights/List' /* webpackChunkName: "marketing_insights_list" */
      )
  }),
  { oneOf: [ACL.MARKETING, ACL.CRM] }
)

const AsyncMarketingInsight = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/MarketingInsights/Insight' /* webpackChunkName: "email_insight" */
      )
  }),
  { oneOf: [ACL.MARKETING, ACL.CRM] }
)
const AsyncSuperCampaignList = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/MarketingInsights/pages/SuperCampaignList' /* webpackChunkName: "email_insight_super_campaign" */
      )
  }),
  [
    { oneOf: [ACL.MARKETING, ACL.CRM] },
    { oneOf: [ACL.ADMIN, ({ user }) => user.user_type === 'Agent'] }
  ]
)
const AsyncSocialPostList = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/MarketingInsights/pages/SocialPostList' /* webpackChunkName: "email_insight_social_post" */
      )
  }),
  [ACL.MARKETING]
)
/* ==================================== */
//  Chatroom
/* ==================================== */

const AsyncRecents = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Chatroom' /* webpackChunkName: "chat" */
      )
  })
)

// Notifications
const AsyncNotificationsPage = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Notifications' /* webpackChunkName: "notif_p" */
      )
  })
)

/* ==================================== */
//  Account settings
/* ==================================== */

const AsyncAccountLayout = withSignedInUser(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Account' /* webpackChunkName: "account_layout" */
      )
  })
)

const AsyncProfile = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Account/Profile' /* webpackChunkName: "profile" */
    )
})

const ExportCalendar = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Account/ICalIntegration' /* webpackChunkName: "deal_templates" */
      )
  })
)

const ManageTags = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Account/ManageTags' /* webpackChunkName: "manage_tags" */
      )
  })
)
const GlobalTriggers = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Account/Triggers' /* webpackChunkName: "global_trigger" */
      )
  })
)

const ReminderNotifications = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Account/ReminderNotifications' /* webpackChunkName: "reminder_notifications" */
      )
  }),
  { oneOf: [ACL.CRM, ACL.DEALS] }
)

const EmailSignature = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Account/EmailSignature' /* webpackChunkName: "email_signature" */
      )
  })
)

const EmailTemplatesSettings = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Account/EmailTemplates/EmailTemplatesSettings' /* webpackChunkName: "email_templates" */
      )
  })
)

const ConnectedAccountsSetting = withAcl.crm(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Account/ConnectedAccounts' /* webpackChunkName: "connected_accounts" */
      )
  })
)

const AsyncUpgradeToAgent = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Account/UpgradeToAgent' /* webpackChunkName: "upgrade_to_agent" */
    )
})

const AsyncCampaigns = Load({
  loader: () =>
    import(
      '../components/Pages/Dashboard/Account/Campaigns' /* webpackChunkName: "campaigns" */
    )
})

// const AsyncCSS = Load({
//   loader: () =>
//     import(
//       '../components/Pages/Dashboard/Account/CentralizedShowingService' /* webpackChunkName: "centralized_showing_service" */
//     )
// })

/* ==================================== */
//  Widgets
/* ==================================== */

const WidgetsContainer = Load({
  loader: () =>
    import(
      '../components/Pages/Widgets' /* webpackChunkName: "widgets_container" */
    )
})
const AsyncListingsWidget = Load({
  loader: () =>
    import(
      '../components/Pages/Widgets/Listings' /* webpackChunkName: "listing_w" */
    )
})

const AsyncMapWidget = Load({
  loader: () =>
    import('../components/Pages/Widgets/Map' /* webpackChunkName: "map_w" */)
})

const AsyncMlsSearchFieldWidget = Load({
  loader: () =>
    import(
      '../components/Pages/Widgets/MlsSearchField' /* webpackChunkName: "search_field" */
    )
})

const AsyncHeroSearchSectionWidget = Load({
  loader: () =>
    import(
      '../components/Pages/Widgets/HeroSearchSection' /* webpackChunkName: "search_field" */
    )
})

/* ==================================== */
//  Websites
/* ==================================== */

const AsyncWebsitesList = withAcl.websites(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Websites/pages/Website' /* webpackChunkName: "websites_list" */
      )
  })
)

/* ==================================== */
//  Showings
/* ==================================== */

const AsyncShowings = withAcl.showings(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Showings/pages/Showings' /* webpackChunkName: "showings" */
      )
  })
)

const AsyncShowingDetail = withAcl.showings(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Showings/pages/ShowingDetail' /* webpackChunkName: "showing_detail" */
      )
  })
)

const AsyncCreateShowing = withAcl.showings(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Showings/pages/CreateShowing' /* webpackChunkName: "create_showing" */
      )
  })
)

/* ==================================== */
//  Super Campaigns
/* ==================================== */

const AsyncSuperCampaignDetail = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/SuperCampaigns/pages/SuperCampaignDetail' /* webpackChunkName: "super_campaign_detail" */
      )
  }),
  [ACL.ADMIN]
)

/* ==================================== */
//  Other Pages
/* ==================================== */

const AsyncBrandSettings = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/BrandSettings' /* webpackChunkName: "brand_settings" */
      )
  }),
  [ACL.MARKETING, ACL.ADMIN]
)

const AsyncShare = withAcl.marketing(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Marketing/SharePage' /* webpackChunkName: "mc_share_page" */
      )
  })
)

const AsyncTeams = withAcl.admin(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Teams' /* webpackChunkName: "teams" */
      )
  })
)

const AsyncChecklists = withAcl.admin(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Checklists' /* webpackChunkName: "console_checklists" */
      )
  })
)

const AsyncMobile = Load({
  loader: () =>
    import('../components/Pages/Mobile' /* webpackChunkName: "mobile" */)
})

const Async404 = Load({
  loader: () => import('../components/Pages/404' /* webpackChunkName: "404" */)
})

const AsyncOops = Load({
  loader: () =>
    import('../components/Pages/Oops' /* webpackChunkName: "Oops" */)
})

/* ==================================== */
//  Deal Context
/* ==================================== */

const AsyncContexts = withAcl.admin(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Contexts/List' /* webpackChunkName: "deal_context" */
      )
  })
)

/* ==================================== */
//  Deal Statuses
/* ==================================== */

const AsyncDealStatuses = withAcl.admin(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/DealStatuses' /* webpackChunkName: "deal_statuses" */
      )
  })
)

//  Listings
/* ==================================== */
const AsyncListingsList = withAcl(
  Load({
    loader: () =>
      import(
        '../components/Pages/Dashboard/Listings/pages/Listings' /* webpackChunkName: "listings" */
      )
  }),
  { oneOf: [ACL.DEALS, ACL.BACK_OFFICE, ACL.MARKETING] }
)

export default (
  <Route>
    <Route path="/">
      <IndexRoute component={GoToDashboard} />
      <Route path="dashboard" component={GoToDashboard} />
    </Route>

    <Route path="/" component={AsyncAuthenticationLayout}>
      <Route path="branch" component={AsyncBranch} />
      <Route path="share" component={AsyncShare} />

      <Route path="register" component={AsyncRegister} />

      <Route path="signin" component={AsyncSignIn} />
      <Route path="signout" component={AsyncSignOut} />
      <Route path="signup" component={AsyncSignUp} />

      <Route path="verify/confirm/:verifyType" component={AsyncVerifyConfirm} />
      <Route path="verify/request/:verifyType" component={AsyncVerifyRequest} />

      <Route path="password/forgot" component={AsyncForgotPassword} />
      <Route path="password/reset" component={AsyncResetPassword} />

      <Route path="showings/:slugAndId/book" component={AsyncBookShowing} />
      <Route
        path="showings/appointments/:appointmentToken"
        component={AsyncShowingAppointment}
      />
      <Route
        path="showings/appointments/:appointmentToken/cancel"
        component={AsyncShowingAppointmentCancel}
      />
      <Route
        path="showings/appointments/:appointmentToken/reschedule"
        component={AsyncShowingAppointmentReschedule}
      />
      <Route
        path="showings/appointments/:appointmentToken/feedback"
        component={AsyncShowingAppointmentFeedback}
      />

      <Route path="mobile" component={AsyncMobile} />

      <Route path="widgets" component={WidgetsContainer}>
        <Route path="map" component={AsyncMapWidget} />
        <Route path="listings" component={AsyncListingsWidget} />
        <Route path="mls-search-field" component={AsyncMlsSearchFieldWidget} />
        <Route
          path="hero-search-section"
          component={AsyncHeroSearchSectionWidget}
        />
      </Route>
    </Route>

    <Route path="/" component={AppLayout}>
      <Route
        path="onboarding/confirm-agent-id"
        component={AsyncConfirmAgentId}
      />
      <Route
        path="onboarding/confirm-agent-id/choose-mls"
        component={AsyncOnboardingChooseMls}
      />
      <Route
        path="onboarding/confirm-agent-id/security-question"
        component={AsyncOnboardingSecurityQuestion}
      />
      <Route
        path="onboarding/config-brand"
        component={AsyncOnboardingConfigBrand}
      />
      <Route
        path="onboarding/phone-number"
        component={AsyncOnboardingPhoneNumber}
      />
      <Route
        path="onboarding/verify-phone-number"
        component={AsyncOnboardingVerifyPhoneNumber}
      />
      <Route
        path="onboarding/oauth-accounts"
        component={AsyncOnboardingOAuthAccounts}
      />
      <Route path="onboarding/profile" component={AsyncOnboardingProfile} />

      {/* these two routes have the same components with none dashboard path */}
      <Route path="branch" component={AsyncBranch} />
      <Route path="share" component={AsyncShare} />

      <Route path="dashboard" component={Dashboard}>
        <Route path="player" component={AsyncPlayer} />
        <Route path="overview" component={AsyncDashboardOverview} />
        <Route path="inbox(/:emailThreadId)" component={AsyncInbox} />

        <Route path="calendar(/:id)" component={AsyncCalendar} />

        <Route path="contacts" component={AsyncContacts} />
        <Route path="contacts/duplicates" component={AsyncDuplicateContacts} />
        <Route path="contacts/:id" component={AsyncContactProfile} />
        <Route path="contacts/import/csv" component={AsyncContactsCsvImport} />

        <Route path="marketing" component={AsyncMarketingOverview} />
        <Route path="marketing/designs" component={AsyncMarketingHistory} />
        <Route path="marketing/wizard" component={AsyncMarketingWizard} />
        <Route path="marketing/editor" component={AsyncMarketingEditor} />
        <Route path="marketing/mls/:id" component={AsyncMarketingMls} />
        <Route
          path="marketing/:types(/:medium)"
          component={AsyncMarketingTemplates}
        />
        <Route path="flows" component={AsyncFlowsList} />
        <Route path="flows/:id" component={AsyncFlowEdit} />

        <Route path="agent-network" component={AsyncAgentNetwork} />
        <Route
          path="agent-network/agents"
          component={AsyncAgentNetworkAgents}
        />

        <Route path="insights">
          <IndexRoute component={AsyncMarketingInsightsList} />
          <Route path="scheduled" component={AsyncMarketingInsightsList} />
          <Route
            path="super-campaign/:id/detail"
            component={AsyncSuperCampaignDetail}
          />
          <Route path="super-campaign" component={AsyncSuperCampaignList} />
          <Route path="social-post" component={AsyncSocialPostList} />
          <Route path=":id" component={AsyncMarketingInsight} />
        </Route>

        <Route path="tours" component={AsyncToursList} />
        <Route path="open-house" component={AsyncOpenHousesList} />

        <Route
          path="/dashboard/deals(/filter/:filter)(/analytics)"
          component={AsyncDealsLayout}
        >
          <IndexRoute component={AsyncDealsList} />
          <Route
            path="/dashboard/deals/analytics/:dashboard"
            component={AsyncDealsAnalytics}
          />
          <Route
            path="/dashboard/deals/create(/:id)"
            component={AsyncDealCreate}
          />
          <Route
            path="/dashboard/deals/:id/form-edit/:taskId"
            component={AsyncDealFormEdit}
          />
          <Route
            path="/dashboard/deals/:id/offer"
            component={AsyncDealCreateOffer}
          />
          <Route
            path="/dashboard/deals/:id/view/:taskId(/:entityType/:entityId)"
            component={AsyncDealFileViewer}
          />
          <Route
            path="/dashboard/deals/:id(/:tab)"
            component={AsyncDealDashboard}
          />
        </Route>

        <Route path="/dashboard/mls" component={AsyncMLSLayout}>
          <IndexRoute component={AsyncMLSSearch} />
          <Route path="favorites" component={AsyncMLSFavorites} />
          <Route path="saved-searches/:id" component={AsyncMLSSavedSearch} />
        </Route>

        <Route path="/dashboard/mls/:id" component={AsyncMLSSinglePage} />

        <Route path="recents(/:roomId)">
          <IndexRoute component={AsyncRecents} />
        </Route>

        <Route
          path="notifications(/:type/:id)"
          component={AsyncNotificationsPage}
        />

        <Route path="account" component={AsyncAccountLayout}>
          <IndexRoute component={AsyncProfile} />
          <Route path="upgrade" component={AsyncUpgradeToAgent} />

          <Route path="exportCalendar" component={ExportCalendar} />
          <Route path="manage-tags" component={ManageTags} />
          <Route path="triggers" component={GlobalTriggers} />
          <Route
            path="reminder-notifications"
            component={ReminderNotifications}
          />
          <Route path="email-signature" component={EmailSignature} />
          <Route path="email-templates" component={EmailTemplatesSettings} />
          <Route
            path="connected-accounts"
            component={ConnectedAccountsSetting}
          />
          <Route path="campaigns" component={AsyncCampaigns} />
          {/* <Route path="css" component={AsyncCSS} /> */}
        </Route>

        <Route path="teams(/:id)">
          <IndexRoute component={AsyncTeams} />
        </Route>

        <Route path="checklists">
          <IndexRoute component={AsyncChecklists} />
        </Route>

        <Route path="contexts">
          <IndexRoute component={AsyncContexts} />
        </Route>

        <Route path="statuses(/:id)">
          <IndexRoute component={AsyncDealStatuses} />
        </Route>

        <Route path="brand-settings">
          <IndexRoute component={AsyncBrandSettings} />
        </Route>

        <Route path="websites(/templates/:type)">
          <IndexRoute component={AsyncWebsitesList} />
        </Route>

        <Route path="showings">
          <IndexRoute component={AsyncShowings} />
          <Route
            path={`:id/detail/:tab(${Object.keys(showingDetailTabs).join(
              '|'
            )})`}
            component={AsyncShowingDetail}
          />
          <Route path=":id/detail" component={AsyncShowingDetail} />
          <Route path="create" component={AsyncCreateShowing} />
          <Route
            path={`:tab(${Object.keys(showingsTabs).join('|')})`}
            component={AsyncShowings}
          />
        </Route>

        <Route path="listings(/:brandId)" component={AsyncListingsList} />
      </Route>
    </Route>

    <Route path="/oops" component={AsyncOops} />
    <Route path="*" component={Async404} />
  </Route>
)
