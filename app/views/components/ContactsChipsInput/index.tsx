import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { FieldRenderProps } from 'react-final-form'
import { Observable } from 'rxjs'
import { of } from 'rxjs/observable/of'
import { combineLatest } from 'rxjs/observable/combineLatest'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { map, startWith } from 'rxjs/operators'
import { useControllableState } from 'react-use-controllable-state/dist'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import Fuse from 'fuse.js'

import { TextField } from 'final-form-material-ui'

import { searchContacts } from 'models/contacts/search-contacts'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { getSavedSegments } from 'actions/filter-segments/get-saved-segment'
import { IAppState } from 'reducers/index'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { getSegments, isListFetched } from 'reducers/filter-segments'

import { ChipsInput } from '../ChipsInput'
import { InlineInputLabel } from '../InlineInputLabel'
import { Recipient } from './types'
import { ChipsInputProps } from '../ChipsInput/types'
import { recipientToChip } from './helpers/recipient-to-chip'
import { recipientToSuggestion } from './helpers/recipient-to-suggestion'
import { filterTags } from './helpers/filter-tags'
import { filterLists } from './helpers/filter-lists'

type BaseProps = Partial<FieldRenderProps<HTMLInputElement>> &
  Omit<
    ChipsInputProps<Recipient>,
    | 'items'
    | 'onChange'
    | 'itemToChip'
    | 'itemToSuggestion'
    | 'getSuggestions'
    | 'createFromString'
  >

interface Props extends BaseProps {
  tags: IContactTag[]
  lists: IContactList[]

  label?: string

  isLoadingTags?: boolean
  areListsFetched?: boolean

  /**
   * Optional control props
   */
  onChange?: (value: Recipient[]) => void
  value?: Recipient[]
  getContactsTags: IAsyncActionProp<typeof getContactsTags>
  getSavedSegments: IAsyncActionProp<typeof getSavedSegments>
}

/**
 * A component for getting a list of tags, lists, contacts&email or contact&phone
 * can be controlled via `value` and `onChange` or Final Form input
 */
function ContactsChipsInput({
  getContactsTags,
  getSavedSegments,
  isLoadingTags,
  areListsFetched,
  tags,
  lists,
  label,
  input,
  meta,
  value,
  onChange,
  ...chipsInputProps
}: Props) {
  const [recipients, setRecipients] = useControllableState<Recipient[]>(
    input ? input.value : value,
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

  const getSuggestions: (searchTerm: string) => Observable<Recipient[]> = (
    searchTerm: string
  ) => {
    return combineLatest(
      ...[
        of(filterTags(tags, searchTerm)),
        of(filterLists(lists, searchTerm)),
        searchTerm
          ? fromPromise(searchContacts(searchTerm)).pipe(
              map(result => {
                return new Fuse(
                  result.data
                    .map(contact => {
                      const emails: string[] = contact.emails || []

                      return emails.map(email => ({
                        contact,
                        email
                      }))
                    })
                    .flat(),
                  { keys: ['email', 'contact.display_name'] }
                ).search(searchTerm)
              })
            )
          : of([])
        // @ts-ignore something is wrong with pipe typing
      ].map(observable => observable.pipe(startWith([]))),
      (...values) => values.flat()
    )
  }

  const { InputProps = {}, ...TextFieldProps } =
    chipsInputProps.TextFieldProps || {}

  return (
    <ChipsInput
      {...chipsInputProps}
      items={recipients || []}
      onChange={setRecipients}
      itemToChip={recipientToChip}
      itemToSuggestion={recipientToSuggestion}
      getSuggestions={getSuggestions}
      createFromString={value => ({ email: value })}
      TextFieldComponent={TextField}
      TextFieldProps={{
        margin: 'dense',
        InputProps: {
          startAdornment: <InlineInputLabel>{label}</InlineInputLabel>,
          ...InputProps
        },
        input,
        meta,
        ...TextFieldProps
      }}
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
    areListsFetched: isListFetched(contacts.filterSegments)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsChipsInput)
