// ListingDispatcher.js
import { Dispatcher } from './flux'

const ListingDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ListingDispatcher.register(payload => true)

export default ListingDispatcher
