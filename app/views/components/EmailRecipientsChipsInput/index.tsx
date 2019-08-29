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

import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { searchContacts } from 'models/contacts/search-contacts'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { getSavedSegments } from 'actions/filter-segments/get-saved-segment'
import { IAppState } from 'reducers/index'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { getSegments, isListFetched } from 'reducers/filter-segments'

import { ChipsInput } from '../ChipsInput'
import { InlineInputLabel } from '../InlineInputLabel'
import { ChipsInputProps } from '../ChipsInput/types'
import { recipientToChip } from './helpers/recipient-to-chip'
import { recipientToSuggestion } from './helpers/recipient-to-suggestion'
import { filterEntities } from './helpers/filter-entities'
import { RecipientSuggestions } from './RecipientSuggestions'

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

interface Props extends BaseProps {
  tags: IContactTag[]
  lists: IContactList[]

  label?: string

  isLoadingTags?: boolean
  areListsFetched?: boolean

  includeSuggestions?: boolean

  /**
   * Optional control props
   */
  onChange?: (value: IDenormalizedEmailRecipientInput[]) => void
  value?: IDenormalizedEmailRecipientInput[]
  getContactsTags: IAsyncActionProp<typeof getContactsTags>
  getSavedSegments: IAsyncActionProp<typeof getSavedSegments>
}

const useEmailRecipientsChipsInputStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      Input: {
        flexWrap: 'wrap'
      },
      inputWrapper: {
        flexBasis: '93%'
      }
    }),
  { name: 'EmailRecipientsChipsInput' }
)

/**
 * A component for getting a list of tags, lists, contacts&email or contact&phone
 * can be controlled via `value` and `onChange` or Final Form input
 *
 * NOTE: we can pull this suggestions feature up into ChipsInput, but
 * right now, there is a styling issue which is not resolved generally,
 * and it's fixed by a workaround. This workaround is dependent on the
 * label width!
 */
function EmailRecipientsChipsInput({
  getContactsTags,
  getSavedSegments,
  isLoadingTags,
  areListsFetched,
  includeSuggestions,
  tags,
  lists,
  label,
  input,
  meta,
  value,
  onChange,
  ...chipsInputProps
}: Props) {
  const [recipients, setRecipients] = useControllableState<
    IDenormalizedEmailRecipientInput[]
  >(input ? input.value : value, input ? (input.onChange as any) : onChange, [])

  const classes = useEmailRecipientsChipsInputStyles()

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
      of(
        filterEntities(tags, searchTerm, ['text']).map(tag => ({
          recipient_type: 'Tag',
          tag
        }))
      ),
      of(
        filterEntities(lists, searchTerm, ['name']).map(list => ({
          recipient_type: 'List',
          list
        }))
      ),
      searchTerm
        ? fromPromise(
            searchContacts(searchTerm, undefined, {
              associations: [],
              order: '-created_at'
            })
          ).pipe(
            map(result => {
              return new Fuse(
                result.data
                  .map(contact => {
                    const emails: string[] = contact.emails || []

                    return emails.map<IDenormalizedEmailRecipientEmailInput>(
                      email => ({
                        recipient_type: 'Email',
                        contact,
                        email
                      })
                    )
                  })
                  .flat(),
                {
                  keys: ['email', 'contact.display_name']
                }
              ).search(searchTerm)
            })
          )
        : of([])
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

  const acceptSuggestion = recipient => {
    return setRecipients([...recipients, recipient])
  }

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
          endAdornment: includeSuggestions ? (
            <RecipientSuggestions
              currentRecipients={recipients}
              onSelect={acceptSuggestion}
            />
          ) : null,
          className: classes.Input,
          ...InputProps
        },
        inputProps: {
          ...inputProps,
          inputWrapperClassName: classes.inputWrapper
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
    areListsFetched: isListFetched(contacts.filterSegments)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailRecipientsChipsInput)
