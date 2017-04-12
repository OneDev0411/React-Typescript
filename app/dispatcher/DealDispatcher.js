import { Dispatcher } from './flux'

import getDeals from '../actions/deals/get-deals'
import createDeal from '../actions/deals/create-deal'
import getSubmissions from '../actions/deals/get-submissions'
import addSubmission from '../actions/deals/add-submission'
import getSubmissionForm from '../actions/deals/get-submission-form'
import getEnvelopes from '../actions/deals/get-envelopes'
import getDealForms from '../actions/deals/get-deal-forms'
import uploadFile from '../actions/deals/upload-file'
import saveSubmissionForm from '../actions/deals/save-submission-form'

const DealDispatcher = new Dispatcher()

// Register callback with DealDispatcher
DealDispatcher.register(async function (payload) {
  const action = payload.action

  switch (action) {

    case 'get-deals':
      getDeals(payload.user)
      break

    case 'create-deal':
      return await createDeal(payload.data, payload.user)
      break

    case 'get-submissions':
      getSubmissions(payload.id, payload.user)
      break

    case 'add-submission':
      addSubmission(payload.id, payload.form)
      break

    case 'get-deal-forms':
      getDealForms(payload.user)
      break

    case 'get-envelopes':
      getEnvelopes(payload.id, payload.user)
      break

    case 'upload-file':
      return await uploadFile(payload.id, payload.user, payload.file)
      break

    case 'save-submission-form':
      return await saveSubmissionForm(payload.user, payload.type, payload.deal,
        payload.form, payload.state, payload.values, payload.submission)
      break

    case 'get-submission-form':
      getSubmissionForm(payload.user, payload.deal, payload.last_revision)
      break

    default:
      return true
  }
  return true
})

export default DealDispatcher
