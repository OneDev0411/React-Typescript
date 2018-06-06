import { batchActions } from 'redux-batched-actions'
import { browserHistory } from 'react-router'

import * as actionTypes from '../../../constants/contacts'
import {
  selectPage,
  selectPages,
  selectCurrentPage,
  selectContactsInfo
} from '../../../reducers/contacts/list'
import {
  getContacts,
  searchContacts,
  clearContactPages,
  removeContactPage,
  setContactCurrentPage,
  updateContactPages
} from '../index.js'
import { deleteContacts as removeContacts } from '../../../models/contacts/delete-contact'

export function deleteContacts(contactIds) {
  return async (dispatch, getState) => {
    if (!contactIds) {
      throw new Error('Contact id is required.')
    }

    try {
      dispatch({
        type: actionTypes.DELETE_CONTACT_REQUEST
      })

      await removeContacts(contactIds)

      const { list } = getState().contacts
      const listInfo = selectContactsInfo(list)
      const pages = Math.ceil(listInfo.total / 50)
      const currentPage = selectCurrentPage(list)
      const currentPageContacts = selectPage(list, currentPage)

      const updateUrl = page => {
        let url = `/dashboard/contacts/page/${page}`

        if (listInfo.filter) {
          url = `${url}?filter=${listInfo.filter}`
        }

        browserHistory.push(url)
      }

      const moveToPrevPage = () => {
        const prevPage = currentPage - 1

        dispatch(removeContactPage(currentPage))
        dispatch({
          info: {
            ...listInfo,
            total: listInfo.total - contactIds.length
          },
          type: actionTypes.UPDATE_CONTACT_LIST_INFO
        })
        dispatch(setContactCurrentPage(prevPage))

        updateUrl(prevPage)

        // console.log(`to previous ${listInfo.type} page: ${prevPage}`)
      }

      const moveToNextPage = () => {
        const nextPages = {}
        const pages = selectPages(list)

        Object.keys(pages).forEach(page => {
          page = Number(page)

          if (page < currentPage) {
            nextPages[page] = pages[page]
          } else if (page > currentPage) {
            nextPages[page - 1] = pages[page]
          }
        })

        dispatch({
          info: {
            ...listInfo,
            total: listInfo.total - contactIds.length
          },
          type: actionTypes.UPDATE_CONTACT_LIST_INFO
        })
        dispatch(updateContactPages(nextPages))

        // console.log(`to next ${listInfo.type} page: ${currentPage}`)
      }

      const requestPage = async page => {
        // console.log(`request ${listInfo.type} page: ${page}`)

        batchActions([
          dispatch(clearContactPages),
          dispatch({
            type: actionTypes.CLEAR_CONTACTS_LIST
          })
        ])

        if (listInfo.type === 'general') {
          await dispatch(getContacts(page))
        } else {
          await dispatch(searchContacts(listInfo.filter, page))
        }

        updateUrl(page)
      }

      if (
        currentPageContacts &&
        currentPageContacts.ids.length === contactIds.length
      ) {
        if (pages === 1) {
          // pass general and filter
          // console.log('first page')

          return batchActions([
            dispatch(clearContactPages),
            dispatch({
              type: actionTypes.CLEAR_CONTACTS_LIST
            })
          ])
        }

        if (pages === currentPage) {
          // console.log('last page')

          if (selectPage(list, currentPage - 1)) {
            return moveToPrevPage() // pass filter and general
          }

          return requestPage(currentPage - 1) // pass filter and general
        }

        const nextPage = selectPage(list, currentPage + 1)

        if (nextPage) {
          // console.log('total is big has cache')

          return moveToNextPage(nextPage) // pass filter and general
        }
      }

      // pass filter and general
      // console.log('if false', currentPageContacts)

      requestPage(currentPage)
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.DELETE_CONTACT_FAILURE
      })
      throw error
    }
  }
}
