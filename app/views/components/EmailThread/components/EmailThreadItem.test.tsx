import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { render, fireEvent } from '@testing-library/react'

import gmailThreadJson from 'fixtures/email-thread/gmail-thread-1.json'
import outlookThreadJson from 'fixtures/email-thread/outlook-thread-1.json'
import forwardedEmailThreadJson from 'fixtures/email-thread/forwarded-email-thread.json'

import { AppTheme } from '../../../../AppTheme'

import { EmailThreadItem } from './EmailThreadItem'
import { normalizeThreadMessageToThreadEmail } from '../helpers/normalize-to-email-thread-email'

const gmailThread: IEmailThread<'messages'> = {
  ...gmailThreadJson,
  type: 'email_thread',
  messages: gmailThreadJson.messages as IEmailThreadMessage[]
}

const outlookThread: IEmailThread<'messages'> = {
  ...outlookThreadJson,
  type: 'email_thread',
  messages: outlookThreadJson.messages as IEmailThreadMessage[]
}

const forwardedEmailThread: IEmailThread<'messages'> = {
  ...forwardedEmailThreadJson,
  type: 'email_thread',
  messages: forwardedEmailThreadJson.messages as IEmailThreadMessage[]
}

// normally, email content is rendered in iframe, which makes it hard
// (if possible) to query. We change this behaviour to simply render
// the content instead of rendering the iframe.
jest.mock('../../Iframe', () => ({
  Iframe: ({ srcDoc }) => (
    <div
      dangerouslySetInnerHTML={{
        __html: srcDoc
      }}
    />
  )
}))

describe('EmailThreadItem', () => {
  it('renders', () => {
    const mockStore = createStore((state, action) => state, {
      contacts: { oAuthAccounts: { list: {} } }
    })

    render(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={normalizeThreadMessageToThreadEmail(gmailThread.messages[0])}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )
  })

  it('it does not render replied content (replied from gmail)', () => {
    const replyFromGmail = normalizeThreadMessageToThreadEmail(
      gmailThread.messages[1]
    )
    const somethingInOriginalEmail = 'This is the original content'
    const somethingInReplyFromGmail =
      'This reply is sent via gmail client, not rechat'

    const mockStore = createStore((state, action) => state, {
      contacts: { oAuthAccounts: { list: {} } }
    })

    const $ = render(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={replyFromGmail}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    expect($.queryByText(somethingInOriginalEmail, { exact: false })).toBeNull()
    expect(
      $.queryByText(somethingInReplyFromGmail, { exact: false })
    ).not.toBeNull()
  })

  it('it does not render replied content (replied from outlook)', () => {
    const replyFromOutlook = normalizeThreadMessageToThreadEmail(
      outlookThread.messages[2]
    )
    const somethingInOriginalEmail = 'Reply To Saeed From Outlook'
    const somethingInReplyFromOutlook = 'Reply body 2'

    const mockStore = createStore((state, action) => state, {
      contacts: { oAuthAccounts: { list: {} } }
    })

    const $ = render(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={replyFromOutlook}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    expect($.queryByText(somethingInOriginalEmail, { exact: false })).toBeNull()
    expect(
      $.queryByText(somethingInReplyFromOutlook, { exact: false })
    ).not.toBeNull()
  })

  it('it does not render replied content (replied from rechat)', () => {
    const replyFromRechat = normalizeThreadMessageToThreadEmail(
      gmailThread.messages[3]
    )
    const somethingInOriginalEmail = 'This is the original content'
    const somethingInReplyFromRechat = 'And this reply is sent from rechat!'

    const mockStore = createStore((state, action) => state, {
      contacts: { oAuthAccounts: { list: {} } }
    })

    const $ = render(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={replyFromRechat}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    expect($.queryByText(somethingInOriginalEmail, { exact: false })).toBeNull()
    expect(
      $.queryByText(somethingInReplyFromRechat, { exact: false })
    ).not.toBeNull()
  })

  it('it does not collapse the forwarded content', () => {
    // IMPORTANT: note that this behaviour is the current behaviour but
    // gmail for example has more complicated and smarted behaviour.
    // It doesn't collapse forwarded content if it's inbound, but it
    // does collapse it when it's in sent. We skip these complexities
    // and don't collapse forwarded content at all for now.
    const originalEmail = normalizeThreadMessageToThreadEmail(
      forwardedEmailThread.messages[0]
    )
    const secondForwardEmail = normalizeThreadMessageToThreadEmail(
      forwardedEmailThread.messages[1]
    )
    const replyEmail = normalizeThreadMessageToThreadEmail(
      forwardedEmailThread.messages[2]
    )
    const somethingInOriginalEmail = 'A request at Lejebolig.dk regarding the'
    const somethingInSecondForward = 'Forwarded with an extra message'
    const somethingInReplyFromGmail = 'reply to forwarded email'

    const mockStore = createStore((state, action) => state, {
      contacts: { oAuthAccounts: { list: {} } }
    })

    const $ = render(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={originalEmail}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    expect(
      $.queryByText(somethingInOriginalEmail, { exact: false })
    ).not.toBeNull()

    $.rerender(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={secondForwardEmail}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    expect(
      $.queryByText(somethingInOriginalEmail, { exact: false })
    ).not.toBeNull()
    expect(
      $.queryByText(somethingInSecondForward, { exact: false })
    ).not.toBeNull()

    $.rerender(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={replyEmail}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    expect($.queryByText(somethingInOriginalEmail, { exact: false })).toBeNull()
    expect($.queryByText(somethingInSecondForward, { exact: false })).toBeNull()
    expect(
      $.queryByText(somethingInReplyFromGmail, { exact: false })
    ).not.toBeNull()
  })

  it('renders "•••" when there is replied content', () => {
    const email = normalizeThreadMessageToThreadEmail(gmailThread.messages[1])

    const mockStore = createStore((state, action) => state, {
      contacts: { oAuthAccounts: { list: {} } }
    })

    const $ = render(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={email}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    expect($.queryByTitle('Show trimmed content')).not.toBeNull()
  })

  it('does not render "•••" when there is no replied content', () => {
    const email = normalizeThreadMessageToThreadEmail(gmailThread.messages[0])

    const mockStore = createStore((state, action) => state, {
      contacts: { oAuthAccounts: { list: {} } }
    })

    const $ = render(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={email}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    expect($.queryByTitle('Show trimmed content')).toBeNull()
  })

  it('Toggles quoted content when "•••" is clicked', () => {
    const email = normalizeThreadMessageToThreadEmail(gmailThread.messages[1])
    const originalContent = 'This is the original content'

    const mockStore = createStore((state, action) => state, {
      contacts: { oAuthAccounts: { list: {} } }
    })

    const $ = render(
      <Provider store={mockStore}>
        <AppTheme>
          <EmailThreadItem
            email={email}
            collapsed={false}
            onToggleCollapsed={() => {}}
          />
        </AppTheme>
      </Provider>
    )

    const toggleButton = $.getByTitle('Show trimmed content')

    expect($.queryByText(originalContent)).toBeNull()

    fireEvent.click(toggleButton)

    expect($.queryByText(originalContent)).not.toBeNull()

    fireEvent.click(toggleButton)

    expect($.queryByText(originalContent)).toBeNull()
  })
})
