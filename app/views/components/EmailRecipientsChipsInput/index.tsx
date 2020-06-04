import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { FieldRenderProps } from 'react-final-form'
import { Observable } from 'rxjs'
import { combineLatest } from 'rxjs/observable/combineLatest'
import { startWith } from 'rxjs/operators'
import { useControllableState } from 'react-use-controllable-state/dist'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { TextField } from 'final-form-material-ui'

import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { getSavedSegments } from 'actions/filter-segments/get-saved-segment'
import { IAppState } from 'reducers'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { areListsFetched, getSegments } from 'reducers/filter-segments'

import { ChipsInput } from '../ChipsInput'
import { InlineInputLabel } from '../InlineInputLabel'
import { ChipsInputProps } from '../ChipsInput/types'
import { recipientToChip } from './helpers/recipient-to-chip'
import { recipientToSuggestion } from './helpers/recipient-to-suggestion'
import { getTagSuggestions } from './helpers/get-tag-suggestions'
import { getListSuggestions } from './helpers/get-list-suggestions'
import { getContactSuggestions } from './helpers/get-contact-suggestions'

type BaseProps = Partial<FieldRenderProps<HTMLInputElement>> &
  Omit<
    ChipsInputProps<IDenormalizedEmailRecipientInput>,
    | 'items'
    | 'onChange'
    | 'itemToChip'
    | 'itemToSuggestion'
    | 'getSuggestions'
    | 'createFromString'
  >

interface StateProps {
  tags: IContactTag[]
  lists: IContactList[]
  isLoadingTags?: boolean
  areListsFetched?: boolean
}
interface DispatchProps {
  getContactsTags: IAsyncActionProp<typeof getContactsTags>
  getSavedSegments: IAsyncActionProp<typeof getSavedSegments>
}
interface Props extends BaseProps {
  label?: string

  suggestTags?: boolean
  suggestLists?: boolean
  suggestContacts?: boolean

  /**
   * Optional control props
   */
  onChange?: (value: IDenormalizedEmailRecipientInput[]) => void
  value?: IDenormalizedEmailRecipientInput[]
}

/**
 * A component for getting a list of tags, lists, contacts&email or contact&phone
 * can be controlled via `value` and `onChange` or Final Form input
 *
 * NOTE: The code in this component can be refactored into several components
 * each of which adds a source of suggestion for email recipients. This can be
 * done with react context. There will be different components (e.g.
 * EmailRecipientTagSuggestion, EmailRecipientListSuggestion, ...) each
 * providing a source of recipient suggestion via an specified context provider.
 * inside this component the context is used and all suggestion sources will
 * be utilized in suggesting recipients.
 * pros:
 * - Better encapsulation and SRP.
 * - More scalable
 *
 * cons:
 * - More overhead and more abstraction
 * - Cost of refactoring!
 */
function EmailRecipientsChipsInput({
  getContactsTags,
  getSavedSegments,
  isLoadingTags,
  areListsFetched,
  suggestTags = true,
  suggestLists = true,
  suggestContacts = true,
  tags, // provided from redux store
  lists, // provided from redux store
  label,
  input,
  meta,
  value,
  onChange,
  ...chipsInputProps
}: Props & StateProps & DispatchProps) {
  const [recipients, setRecipients] = useControllableState<
    IDenormalizedEmailRecipientInput[]
  >(
    input ? (Array.isArray(input.value) ? input.value : []) : value,
    input ? (input.onChange as any) : onChange,
    []
  )

  useEffect(() => {
    if (!isLoadingTags) {
      getContactsTags()
    }

    if (!areListsFetched) {
      getSavedSegments('contacts')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSuggestions: (
    searchTerm: string
  ) => Observable<IDenormalizedEmailRecipientInput[]> = (
    searchTerm: string
  ) => {
    const suggestionList$: Observable<IDenormalizedEmailRecipientInput[]>[] = [
      ...(suggestTags ? [getTagSuggestions(tags, searchTerm)] : []),
      ...(suggestLists ? [getListSuggestions(lists, searchTerm)] : []),
      ...(suggestContacts ? [getContactSuggestions(searchTerm)] : [])
    ]

    return combineLatest(
      ...suggestionList$.map(observable => observable.pipe(startWith([]))),
      (...values) => values.flat()
    )
  }

  const { InputProps = {}, inputProps = {}, ...TextFieldProps } =
    chipsInputProps.TextFieldProps || {}

  const createEmailRecipient: (
    email: string
  ) => IDenormalizedEmailRecipientEmailInput = value => ({
    recipient_type: 'Email',
    email: value
  })

  return (
    <ChipsInput
      {...chipsInputProps}
      items={recipients || []}
      onChange={setRecipients}
      itemToChip={recipientToChip}
      itemToSuggestion={recipientToSuggestion}
      getSuggestions={getSuggestions}
      createFromString={createEmailRecipient}
      TextFieldComponent={TextField}
      TextFieldProps={{
        InputProps: {
          startAdornment: <InlineInputLabel>{label}</InlineInputLabel>,
          ...InputProps
        },
        inputProps: {
          ...inputProps,
          onFocus: input && input.onFocus,
          // passing onFocus causes error messages to be shown exactly while
          // clicking on quick suggestions. So let's not show error messages
          // on blur, they are gonna be shown anyways on submit.
          'data-test': 'email-recipients-input'
        },
        input,
        meta,
        ...TextFieldProps
      }}
      searchDebounce={300}
    />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    getContactsTags: (...args) => dispatch(getContactsTags(...args)),
    getSavedSegments: (...args) => dispatch(getSavedSegments(...args))
  }
}

const mapStateToProps = ({ contacts }: IAppState) => {
  const tags = selectTags(contacts.tags)
  const lists = getSegments<IContactList>(contacts.filterSegments, 'contacts')
  const isLoadingTags = isFetchingTags(contacts.tags)

  return {
    tags,
    lists,
    isLoadingTags,
    areListsFetched: areListsFetched(contacts.filterSegments)
  }
}

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EmailRecipientsChipsInput)
