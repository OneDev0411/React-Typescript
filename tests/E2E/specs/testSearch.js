import ROOMS_DATA from '../data/rooms'
import SEARCH_DATA from '../data/search'

module.exports = {

  before(client) {
    console.log('Setting up...')
    client.resizeWindow(1200, 900)

    const loginToWebsite = client.page.login()

    loginToWebsite.navigate()
    loginToWebsite.login(client.globals.rechat_username,
      client.globals.rechat_password)
  },

  beforeEach(client) {
    const search = client.page.search()
    const loginToWebsite = client.page.login()

    loginToWebsite.navigate()

    client
      .url((result) => {
        if (result.value.search('signin') !== -1) {
          loginToWebsite.login(client.globals.rechat_username,
            client.globals.rechat_password)
        }
      })
  },

  after(client) {
    client.end()
    console.log('Closing down...')
  },

  '#2 Click On Clusters To Zoom In On Listings': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.clusterVisible()
    search.clickFirstCluster()
    search.isPageReady()
    search.anyMarkerPresent()
  },

  '#3 Check The Different Grid views, Map, List, Thumbnail tabs': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.clusterVisible()
    search.navigate()
    search.verifyListView()
    search.verifyMapView()
    search.verifyGridView()
  },

  '#6 Images Are Showing For Listings': client => {
    const search = client.page.search()

    search.navigate()
    // search.isPageReady()
    search.clusterVisible()
    search.searchMls()
    search.verifyListingImage()
  },

  '#7. Scrolling Through Images': client => {
	    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.clusterVisible()
    search.scrollToFifthListing()
  },

  '#8 Enlarging Images': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.clusterVisible()
    search.enlargeImage()
    search.verifyEnlargeImage()
  },

  '#9 Sorting Side Panel Listings': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.clusterVisible()
    search.sortSidePanelListingArea()
    search.sortSidePanelListingBedrooms()
    search.sortSidePanelListingBaths()
    search.sortSidePanelListingSqft()
    search.sortSidePanelListingPerSqft()
    search.sortSidePanelListingBuilt()
    search.sortSidePanelListingDistance()
  },

  '#86 List Of Homes Should Be Visible': client => {
    const search = client.page.search()

    search.api.refresh()
    search.navigate()
    search.isPageReady()
    // search.closeHomeListing()
    search.verifyListView()

    // Click on an item to view details
    search.isDetailVisible()

    // Closing the detail should take to main page
    search.isMainScreenVisibleAfterClose()
  },

  '#30 Search for price range': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    // search.closeHomeListing()
    search.openSearchFiltersSideBar()

    search.setPrice()
    search.filterUpdate()
    search.verifyPriceUpdated()
  },

  '#34 Favorite and Unfavorite a listing': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    // search.closeHomeListing()

    search.verifyMapView()
    search.markHomeViewFavouriteBtn()
    search.api.refresh()
    search.markHomeViewFavouriteBtn()
  },

  '#17 Search for Zip code': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    // search.closeHomeListing()
    search.searchZipCode()
  },

  '#74 Min/max min/max year built values': client => {
    /*
          Selecting minimum and maximum values for year built and active switch should show
          results only in green color
        */
    const search = client.page.search()

    search.openSearchFiltersSideBar()
    search.setYearBuilt()
    search.filterUpdate()
    //    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },

  '#76 School district filter': client => {
    /*
          Selecting value for school district and active switch should show results only in green color
        */
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    // search.closeHomeListing()

    search.openSearchFiltersSideBar()

    search.setSchoolDistrictFilter()
    search.filterUpdate()
    search.anyMarkerPresent()
  },

  '#67 No Pool filter': client => {
    /*
          Selecting the NO switch for pool and active switch should show results only in green color
        */
    const search = client.page.search()

    search.openSearchFiltersSideBar()
    search.chooseNoForPool()
    search.filterUpdate()
    //    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },

  '#68 Yes Pool filter': client => {
    /*
      Selecting the YES switch for pool and active switch should show results only in green color
    */
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    // search.closeHomeListing()

    search.openSearchFiltersSideBar()

    search.chooseYesForPool()
    search.filterUpdate()
    //    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },

  '#69 Either Pool filter': client => {
    /*
      Selecting the EITHER switch for pool and active switch should show results only in green color
    */
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.openSearchFiltersSideBar()
    search.chooseEitherForPool()
    search.filterUpdate()
    search.clusterVisible()
  },

  '#59 Search for 1+ Beds': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectOnePlusBedroomChoice()
    search.filterUpdate()
    search.clusterVisible()
    search.verifyBedrooms(1)
  },

  '#27 Search for Sold listings': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.toggleSoldSwitch() // Enable Sold
    search.filterUpdate()
    search.clusterVisible()
  },
  '#28 Search for 2+ Beds': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectTwoPlusBedroomChoice()
    search.filterUpdate()
    search.clusterVisible()
    search.verifyBedrooms(2)
  },

  '#60 Search for 3+ Beds': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectThreePlusBedroomChoice()
    search.filterUpdate()
    search.clusterVisible()
    search.verifyBedrooms(3)
  },

  '#63 Search for 1+ Baths': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectOnePlusBathroomChoice()
    search.filterUpdate()
    search.clusterVisible()
    search.verifyBathroomUpdated(1)
  },
  '#29 Search for 2+ Baths': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectTwoPlusBathroomChoice()
    search.filterUpdate()
    search.clusterVisible()
    search.allMarkersShouldBe('green')
    search.verifyBathroomUpdated(2)
  },

  '#77 Search for 1+ Garage': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectOnePlusGarageChoice()
    search.filterUpdate()
    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },

  '#78 Search for 2+ Garage': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectTwoPlusGarageChoice()
    search.filterUpdate()
    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },

  '#79 Search for 3+ Garage': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectThreePlusGarageChoice()
    search.filterUpdate()
    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },

  '#80 Search for 4+ Garage': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectFourPlusGarageChoice()
    search.filterUpdate()
    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },

  '#81 Search for 5+ Garage': client => {
    /*
      Selecting the garage +5 filter and active switch should show results only in green color
    */
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.selectFivePlusGarageChoice()
    search.filterUpdate()
    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },

  '#73 Min/max lot square footage': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    search.openSearchFiltersSideBar()
    search.setLotSquareFootage()
    search.filterUpdate()
    search.allMarkersShouldBe('green')
  },
  '#72 Town House, Condo and House Property Type Filter': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.openSearchFiltersSideBar()
    search.chooseCondoPropertyType()
    search.filterUpdate()
    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },
  '#25 Share Listing with an Email address': client => {
    /*
          A room should be created with that email address and the listing should appear in the room, there should be acknowledgment that the message was delivered
          Share a Listing with a Phone Number
        */
    const search = client.page.search()
    const sidebar = client.page.sidebar()
    const rooms = client.page.rooms()

    search.navigate()
    search.isPageReady()
    search.verifyListView()
    // Click on an item to view details
    search.isDetailVisible()
    search.shareListing(SEARCH_DATA.searchShareEmail)
    search.navigate()
    search.isPageReady()
    sidebar.goToRooms(false)
  },

  '#71 House Condo & House Property Type Filter': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.openSearchFiltersSideBar()
    search.chooseCondoPropertyType()
    search.filterUpdate()
    search.allMarkersShouldBe('green')
    search.clusterVisible()
  },


  '#75 Sub division filter': client => {
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    search.openSearchFiltersSideBar()
    search.setSubDivision()
    search.filterUpdate()
    search.anyMarkerPresent()
  },

  '#20 Create alert for myself': client => {
    /*
          Alert Saved layover should show up
          Created alert should appear in Alerts tab
          Its name should match the name we gave to it
        */
    const search = client.page.search()

    search.navigate()
    search.isPageReady()
    // Save a search
    search.saveSearch()
    search.navigate()
    search.isPageReady()

    // Verify search is saved
    search.verifySearchIsSaved()
  },

  '#21 Share Alert with an email address': client => {
    const search = client.page.search()
    const sidebar = client.page.sidebar()
    const rooms = client.page.rooms()

    search.navigate()
    search.isPageReady()

    // Save a search and pass true to share and false to use email for sharing
    search.saveSearch(true, false)

    // Verify search is saved
    search.verifySearchIsSaved()

    search.navigate()
    search.isPageReady()
    sidebar.goToRooms(false)
  },
  '#22 Share Alert with a Phone number': client => {
    const search = client.page.search()
    const sidebar = client.page.sidebar()
    const rooms = client.page.rooms()

    search.navigate()
    search.isPageReady()

    // Save a search and pass true to share and second true to use phone number for sharing
    search.saveSearch(true, true)

    // Verify search is saved
    search.verifySearchIsSaved()

    search.navigate()
    search.isPageReady()
    sidebar.goToRooms(true)
  },


  '#24 Share Listing with a Phone number': client => {
    const search = client.page.search()
    const sidebar = client.page.sidebar()
    const rooms = client.page.rooms()

    search.navigate()
    search.isPageReady()
    search.verifyListView()
    // Click on an item to view details
    search.isDetailVisible()
    search.shareListing(SEARCH_DATA.searchSharePhone)
    search.navigate()
    search.isPageReady()
    sidebar.goToRooms(true)
  }

  // till here

  // '#61 Search for 4+ Beds': function(client){
  //     const search = client.page.search()
  //     search.navigate()
  //     search.isPageReady()
  //
  //     search.openSearchFiltersSideBar()
  //     search.selectFourPlusBedroomChoice()
  //     search.filterUpdate()
  //     search.clusterVisible()
  //     search.verifyBedrooms(4)
  // },
  // '#62 Search for 5+ Beds': function(client){
  //     const search = client.page.search()
  //     search.navigate()
  //     search.isPageReady()
  //
  //     search.openSearchFiltersSideBar()
  //     search.selectFivePlusBedroomChoice()
  //     search.filterUpdate()
  //     search.clusterVisible()
  //     search.verifyBedrooms(5)
  // },


  // '#4 Current State Stays The Same When Changing Tabs' : function(client) {
  // 	const search = client.page.search()
  // 	search.navigate()
  // 	search.isPageReady()
  // 	search.clusterVisible()
  // 	search.stateOnChangingTabs()
  // },


  // '#64 Search for 3+ Baths': function(client){
  //     const search = client.page.search()
  //     search.navigate()
  //     search.isPageReady()
  //
  //     search.openSearchFiltersSideBar()
  //     search.selectThreePlusBathroomChoice()
  //     search.filterUpdate()
  //     search.clusterVisible()
  //     search.allMarkersShouldBe('green')
  //     search.verifyBathroomUpdated(3)
  // },
  //
  //  '#65 Search for 4+ Baths': function(client){
  //      const search = client.page.search()
  //      search.navigate()
  //      search.isPageReady()
  //
  //      search.openSearchFiltersSideBar()
  //      search.selectFourPlusBathroomChoice()
  //      search.filterUpdate()
  //      search.clusterVisible()
  //      search.allMarkersShouldBe('green')
  //      search.verifyBathroomUpdated(4)
  //  },
  //

// //  '#66 Search for 5+ Baths': function(client){
// //    /*
// //      Selecting the bathroom +5 filter and active switch should show results only in green color
// //    */
// //    // Verify Five Plus Bathroom Filter
// //    const search = client.page.search()
// //    search.selectFivePlusBathroomChoice()
// //    search.update()
// //    search.allMarkersShouldBe('green')
// //  },


//   '#70 House Property Type Filter': function(client) {
//     /*
//       Selecting the House property from property types and active switch should show results only in green color
//     */
//     const search = client.page.search()
//            search.navigate()
//            search.isPageReady()
//
//     search.openSearchFiltersSideBar()
//     search.chooseHousePropertyType()
//     search.update()
// //    search.allMarkersShouldBe('green')
//     search.clusterVisible()
//   },


  // '#23 Share Alert with a room': function(client) {
  //   const search = client.page.search()
  //
  //   search.navigate()
  //   search.isPageReady()
  //   search.closeHomeListing()
  //   search.closeFilters()
  //
  //   search.drawOnMap()
  //   // Save a search
  //   search.saveDrawSearch()
  //
  //   // Verify search is saved
  //   search.verifySearchIsSaved()
  // },


  // '#36 Add member to a group room with a phone number': function(client) {
  //   const search = client.page.search()
  //   const rooms = client.page.rooms()
  //   const sidebar = client.page.sidebar()
  //
  //   search.navigate()
  //   search.isPageReady()
  //   sidebar.goToRooms()
  //
  //   // Create a Group to show Add members link
  //   // rooms.deleteAllRooms()
  //
  //   rooms.clickCreateNewMessage()
  //   rooms.createMultipleRooms([ROOMS_DATA.room1, ROOMS_DATA.room2,
  //                              ROOMS_DATA.room3, ROOMS_DATA.room5])
  //   rooms.say((new Date()).toString())
  //
  //   // Add member to group by Phone Number and verify
  //   rooms.addMemberByPhoneToGroup(ROOMS_DATA.room4)
  // },


  //


  // '#26 Share Listing with a Room': function(client) {
  //   /*
  //     A room should be created with that email address and the listing should appear in the room, there should be acknowledgment that the message was delivered
  //     Share a Listing with a Phone Number
  //   */
  //   const search = client.page.search()
  //   const sidebar = client.page.sidebar()
  //   const rooms = client.page.rooms()
  //
  //   search.navigate()
  //   search.isPageReady()
  //   search.closeHomeListing()
  //
  //   sidebar.goToRooms()
  //
  //   rooms.deleteAllRooms()
  //   rooms.createFirstRoom(ROOMS_DATA.room5)
  //   rooms.say((new Date()).toString())
  //
  //   search.navigate()
  //   search.isPageReady()
  //   search.closeHomeListing()
  //
  //   search.toggleListView()
  //   search.isListingDisplayed()
  //
  //   // Click on an item to view details
  //   search.isDetailVisible()
  //
  //   search.shareListing(ROOMS_DATA.room5)
  //
  //   search.navigate()
  //   search.isPageReady()
  //
  //   sidebar.goToRooms()
  //
  //   rooms.verifyListingShared(ROOMS_DATA.room5)
  // },
}