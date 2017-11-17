import SEARCH_DATA from '../data/search'

module.exports = {
  url() {
    return `${this.api.launchUrl}/dashboard/mls`
  },

  sections: {
    pool: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(13) > div',
      elements: {
        yesButton: {
          selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(13) > div > label:nth-child(1)'
        },
        noButton: {
          selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(13) > div > label:nth-child(2)'
        },
        eitherButton: {
          selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(13) > div > label:nth-child(3)'
        }
      }
    },
    propertyTypes: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(4)',
      elements: {
        anyButton: {
          selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(7) > div.btn-group > button:nth-child(1)'
        },
        houseButton: {
          selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(7) > div.btn-group > button:nth-child(2)'
        },
        condoButton: {
          selector: 'div > label:nth-child(1) > span'
        },
        townHouseButton: {
          selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(7) > div.btn-group > button:nth-child(4)'
        }
      }
    },
    priceRange: {
      selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(6) > div:nth-child(2)',
      elements: {
        minInput: {
          selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div > input'
        },
        maxInput: {
          selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(2)'
        }
      }
    },
    squareFootage: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(11) > div',
      elements: {
        minInput: {
          selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(11) > div > div.c-min-max-inputs__min > input'
        },
        maxInput: {
          selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(11) > div > div.c-min-max-inputs__max > input'
        }
      }
    },
    lotSquareFootage: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(12) > div',
      elements: {
        minInput: {
          selector: 'div.c-min-max-inputs__min > input'
        },
        maxInput: {
          selector: 'div.c-min-max-inputs__max > input'
        }
      }
    },
    yearBuilt: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(14)',
      elements: {
        minInput: {
          selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(14) > div > div.c-min-max-inputs__min > input'
        },
        maxInput: {
          selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(14) > div > div.c-min-max-inputs__max > input'
        }
      }
    }
    //    homeListing: {
    //      selector: '.listing-panel__list-item',
    //      elements: {
    //        shareToField: {
    //          selector: '#react-select-6--value > div.Select-input > input'
    //        },
    //        shareButton: {
    //          selector: '.modal-800 button'
    //        }
    //      }
    //    }

  },

  elements: {
    loading: {
      selector: '#loading>div'
    },

    keywords: {
      selector: '#google_search'
    },

    filters: {
      selector: '.listing-map__filter-form'
    },

    open_filters: {
      selector: '.c-mls-toolbar__search-box__filter-btn'
    },

    close_filters: {
      selector: '.c-mls-toolbar__search-box__filter-btn.is-open'
    },

    sold_toggle: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(1) > div:nth-child(1) > div.c-filters-status > div.c-filters-status__right-side > div > label'
    },

    sold_menu: {
      selector: '.listing-map__filter-form>form>div:nth-child(1) i'
    },

    sold_custom_date: {
      selector: '.listing-map__filter-form>form>div:nth-child(1) button:nth-child(4)'
    },

    day_picker_prev: {
      selector: '.DayPicker-NavButton--prev'
    },

    second_week_first_day: {
      selector: '.listing-map__filter-form>form>div:nth-child(1) div.DayPicker-Month > div.DayPicker-Body > div:nth-child(2) > div:nth-child(1)'
    },

    active_toggle: {
      selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div'
    },

    other_toggle: {
      selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div'
    },

    open_house_toggle: {
      selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div'
    },

    update: {
      selector: '.c-filters__submit-btn'
    },

    markers: {
      selector: '.map__listing-marker'
    },

    zoom_in: {
      selector: '.btn-group-vertical>button:first-child'
    },

    homeListView: '.listing-map > nav > div:nth-child(4) > div.btn-group > button:nth-child(2)',
    homeGridView: '.listing-map > nav > div:nth-child(4) > div.btn-group > button:nth-child(3)',
    homeListItems: 'div.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > table > tbody > tr:nth-child(1)',
    favouriteButton: {
      selector: '#app > div > div:nth-child(1) > main > div > div:nth-child(2) > div > img'
    },
    shareButton: {
      selector: '#app > div > div:nth-child(1) > main > div > div:nth-child(2) > button'
    },
    closeDetailView: {
      selector: '#app > div > div:nth-child(1) > main > div > button'
    },
    saveSearchButton: {
      selector: '.c-panel__header__button'
    },
    nameAlertModal: {
      selector: '.modal-share-type'
    },
    nameAlertModalField: {
      selector: '#alertName'
    },
    saveForMeLink: {
      selector: '.c-create-alert-modal__footer.modal-footer > button:nth-child(1)'
    },
    saveAndShareButton: {
      selector: '.c-create-alert-modal__footer.modal-footer > button:nth-child(2)'
    },

    savedSearches: {
      selector: 'header > ul > li:nth-child(2) > a'
    },
    savedSearchFirstItem: {
      selector: 'div.c-alerts-list > div:nth-child(1) > div.c-alertList__item__info > h3'
    },
    modalAlertSaved: {
      selector: '.modal-alert-saved'
    },
    onePlusBedroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(6) > div > label:nth-child(2) > span'
    },
    twoPlusBedroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(6) > div > label:nth-child(3) > span'
    },
    threePlusBedroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(6) > div > label:nth-child(4) > span'
    },
    fourPlusBedroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(6) > div > label:nth-child(5) > span'
    },
    fivePlusBedroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(6) > div > label:nth-child(6) > span'
    },
    subDivision: {
      selector: '#react-select-8--value > div.Select-placeholder'
    },
    subDivisionField: {
      selector: '#react-select-4--value > div.Select-input > input'
    },
    clearSubDivisionField: {
      selector: '#react-select-4--value + span.Select-clear-zone > span'
    },

    onePlusBathroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(7) > div > label:nth-child(2) > span'
    },
    twoPlusBathroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(7) > div > label:nth-child(3) > span'
    },
    threePlusBathroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(7) > div > label:nth-child(4) > span'
    },
    fourPlusBathroomChoice: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(7) > div > label:nth-child(5) > span'
    },
    fivePlusBathroomChoice: {
      selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(10) > div.btn-group > button:nth-child(6)'
    },
    onePlusGarageSpace: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(8) > div > label:nth-child(2) > span'
    },
    twoPlusGarageSpace: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(8) > div > label:nth-child(3) > span'
    },
    threePlusGarageSpace: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(8) > div > label:nth-child(4) > span'
    },
    fourPlusGarageSpace: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(8) > div > label:nth-child(5) > span'
    },
    fivePlusGarageSpace: {
      selector: '.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(8) > div > label:nth-child(6) > span'
    },
    schoolDistrict: {
      selector: '#react-select-5--value > div.Select-placeholder'
    },
    closeHomeListingButton: {
      selector: '.listing-panel__button'
    },
    shareToField: {
      selector: '.modal-body > div > div.tags-container > input[type="text"]'
    },
    shareEmailClick: {
      selector: '.modal-body > div > div.sg-container > div > div > div.vcenter.col-md-8.col-sm-8.col-xs-8 > strong'
    },
    shareButtonHomeListing: {
      selector: '.c-create-alert-modal__footer.modal-footer > button'
    },
    closeShareDialog: {
      //      selector: '#app > main > div > div:nth-child(1) > div'
      selector: '#app > main > div > div:nth-child(1) > a.close'
    },

    homeViewFavouriteBtn: {
      //      selector: 'div.listing-panel > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > img'
      selector: 'div.l-listings__panel__container > div.c-panel__list-container > div > div:nth-child(1) > div > div.c-listing-card__favorite-heart > img'
    },

    homeViewBtn: {
      selector: 'div.listing-map > nav > div:nth-child(4) > div.btn-group > button:nth-child(3)'
    },

    areaInHomeListing: {
      selector: '.listing-panel__list-item > div:nth-child(3) > div'
    },

    noBedsInListing: {
      selector: 'div.listing-panel__list-item > div:nth-child(5) > div'
    },

    priceRangeMinInput: {
      //      selector: '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div > input'
      selector: 'div.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(3) > div > div.c-min-max-inputs__min > input'
    },
    priceRangeMaxInput: {
      selector: 'div.l-listings__map > div.c-filters.c-filters--isOpen > div > form > div:nth-child(2) > div:nth-child(3) > div > div.c-min-max-inputs__max > input'
    },

    firstHomeInGrid: {
      selector: '#app > div > div:nth-child(1) > main > div > div > div.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > div > div:nth-child(1) > div > div.c-listing-card__content-wrapper > h5'
    },
    secondHomeInGrid: {
      selector: '#app > div > main > div > div > div.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > div > div:nth-child(2) > div > div.c-listing-card__content-wrapper > h5'
    },
    thirdHomeInGrid: {
      selector: '#app > div > main > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3)'
    },

    firstBathInGrid: {
      selector: '.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > table > tbody > tr:nth-child(1) > td:nth-child(5)'
    },
    secondBathInGrid: {
      selector: 'div.listing-panel > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(4) > span:nth-child(2)'
    },
    thirdBathInGrid: {
      selector: 'div.listing-panel > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(4) > span:nth-child(2)'
    },

    firstBedInGrid: {
      selector: '.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > table > tbody > tr:nth-child(1) > td:nth-child(4)'
    },
    secondBedInGrid: {
      selector: '.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > table > tbody > tr:nth-child(2) > td:nth-child(4)'
    },
    thirdBedInGrid: {
      selector: '.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > table > tbody > tr:nth-child(3) > td:nth-child(4)'
    },

    firstZipInList: {
      selector: 'div.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > table > tbody > tr:nth-child(1) > td:nth-child(2)'
    },
    secondZipInList: {
      selector: 'div.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__list-container > table > tbody > tr:nth-child(2) > td:nth-child(2)'
    },
    thirdZipInList: {
      selector: 'div.listing-panel > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(3) > div'
    },

    drawMapTool: {
      selector: 'div.listing-map > nav > div:nth-child(3) > div:nth-child(2) > button'
    },

    loginLinkOnMap: {
      selector: '#app > div > main > div:nth-child(5) > div:nth-child(2) > a:nth-child(2)'
    },

    clusterMarker: {
      selector: '.cluster-marker'
    },

    firstClusterMarker: {
      selector: 'div.l-listings__map > div:nth-child(1) > div > div > div > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(3) > div > div > div:nth-child(1) > div'
    },

    listViewBtn: {
      selector: '.c-panels-switch.btn-group > button:nth-child(2) > svg'
    },

    listViewTable: {
      selector: '.l-listings__panel > div > div.l-listings__panel__container > div.c-panel__header > table'
    },

    mapViewBtn: {
      selector: 'div.l-listings__panel > div > div.c-panels-switch.btn-group > button:nth-child(1)'
    },

    gridViewBtn: {
      selector: 'div.l-listings__panel > div > div.c-panels-switch.btn-group > button:nth-child(3)'
    },

    listingsOnGrid: {
      selector: '.c-listings-panel--grid'
    },

    statusBar: {
      selector: '.c-mls-toolbar__status-bar'
    },

    savedListings: {
      selector: 'div > header > ul > li:nth-child(3)'
    },

    savedSearch: {
      selector: 'div > header > ul > li:nth-child(2)'
    },

    searchListings: {
      selector: 'div > header > ul > li:nth-child(1)'
    },

    listingSortDropDown: {
      selector: '#listings-sort-dropdown'
    },

    listingDropDownArea: {
      selector: 'span.c-panel__header__sorting__dropdown-wrapper > div > ul > li:nth-child(1) > a'
    },

    listingDropDownBedrooms: {
      selector: 'span.c-panel__header__sorting__dropdown-wrapper > div > ul > li:nth-child(2) > a'
    },

    listingDropDownBaths: {
      selector: 'span.c-panel__header__sorting__dropdown-wrapper > div > ul > li:nth-child(3) > a'
    },

    listingDropDownSqft: {
      selector: 'span.c-panel__header__sorting__dropdown-wrapper > div > ul > li:nth-child(4) > a'
    },

    listingDropDownPerSqft: {
      selector: 'span.c-panel__header__sorting__dropdown-wrapper > div > ul > li:nth-child(5) > a'
    },

    listingDropDownBuilt: {
      selector: 'span.c-panel__header__sorting__dropdown-wrapper > div > ul > li:nth-child(6) > a'
    },

    listingDropDownDistance: {
      selector: 'span.c-panel__header__sorting__dropdown-wrapper > div > ul > li:nth-child(7) > a'
	  },

    sideBarFirstListingBeds: {
		  selector: 'div.c-panel__list-container > div > div:nth-child(1) > div > div.c-listing-card__content-wrapper > div.c-listing-card__details > span:nth-child(1)'
	  },

    sideBarSecondListingBeds: {
		  selector: 'div.c-panel__list-container > div > div:nth-child(2) > div > div.c-listing-card__content-wrapper > div.c-listing-card__details > span:nth-child(1)'
	  },

    sidebarReverseOrder: {
	    selector: 'div.c-panel__header > div > div > div > label > input[type="checkbox"]'
    },

    listingCardTitle: {
	    selector: '.c-listing-card__title'
    },

    listingCardImage: {
	    selector: '.c-listing-card__inner:nth-of-type(1)'
    },

    searchInput: {
	    selector: '.c-mls-toolbar__search-box__field__input'
    },

    listingCardImageHref: {
	    selector: 'a[href*="/dashboard/mls/4b66a03c-962f-11e6-a70e-f23c91b0d077"]'
    },

    listingLink: {
    	selector: 'div.l-listings__panel__container > div.c-panel__list-container > div > div:nth-child(1) > div'
    },

    listingDetailImage: {
    	selector: '#app > div > div:nth-child(1) > main > div > div:nth-child(3) > div:nth-child(1) > div.listing-viewer__carousel.carousel.slide > div > div.listing-carousel__item.item.active > div:nth-child(2)'
    },

    listingDetailImageZoom: {
    	selector: '.page-.modal-open'
    },

    listingDetailPoolStatus: {
      selector: 'main > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div.col-sm-9 > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > span'
    },

    homeFifthListing: {
    	selector: 'div.l-listings__panel__container > div.c-panel__list-container > div > div:nth-child(5)'
    },
    firstListItems: {
    	selector: '.c-panel__list-container > table > tbody > tr:nth-child(1) > td.c-tableview__address-cell > div.c-tableview__address-cell__body'
    }

  },

  commands: [{
	  login(email, password) {
		  this.waitForElementVisible('@email').setValue('@email', email)
		  this.waitForElementVisible('@password').setValue('@password', password)
		  this.waitForElementVisible('@submit').click('@submit')

		  return this
	  },

	  checkForLogin(email, password) {
		  this.isPageReady()
		  found = false

		  this.waitForElementVisible('@loginLinkOnMap', SEARCH_DATA.pageWaitTimeout, false)
		  this.api.elements('css selector',
			  '#app > div > main > div:nth-child(5) > div:nth-child(2) > a:nth-child(2)',
			  (element) => {
				  console.log(element)
				  if (element['value'] === SEARCH_DATA.loginText) {
					  found = true
				  }
			  })

      //        this.getText(this.elements.loginLinkOnMap.selector, function(result){
      //          if (result.value === SEARCH_DATA.loginText){
      //            found = true
      //          }
      //        })
		  return found
	  },

	  zip(zip) {
		  this
			  .click('@keywords')
			  .setValue('@keywords', zip)

		  this.api.keys([this.api.Keys.ENTER])
		  this.isPageReady()
	  },

	  closeHomeListing() {
		  this.waitForElementVisible('@closeHomeListingButton')
			  .click('@closeHomeListingButton')
	  },

	  openSearchFiltersSideBar() {
		  this.waitForElementVisible('@open_filters')
		  this.click('@open_filters')
		  this.waitForElementVisible('@close_filters')
	  },

	  closeFilters() {
		  this.click('@close_filters')
	  },

	  isPageReady() {
		  this.waitForElementNotPresent('@loading', SEARCH_DATA.pageWaitTimeout) // Wait for loading to complete
	  },

	  toggle(selector) {
		  this.waitForElementVisible(selector)
			  .click(selector)
	  },

	  toggleSoldSwitch() {
		  this.waitForElementVisible('@sold_toggle')
		  this.click('@sold_toggle')
	  },

	  applySoldDateFilter() {
		  this.click('@sold_menu')
		  this.waitForElementVisible('@sold_custom_date')
		  this.click('@sold_custom_date')
		  this.waitForElementVisible('@day_picker_prev')

		  for (let i = 0; i < 30; i += 1) {
			  this.api.pause(SEARCH_DATA.pause500)
			  this.click('@day_picker_prev')
		  }

		  this.click('@second_week_first_day')
	  },

	  toggleActiveSwitch() {
		  this.toggle('@active_toggle')
	  },

	  toggleOthersSwitch() {
		  this.toggle('@other_toggle')
	  },
	  toggleListView() {
		  this.toggle('@homeListView')
	  },

	  toggleGridView() {
		  this.toggle('@homeGridView')
	  },

	  toggleOpenHouse() {
		  this.toggle('@open_house_toggle')
	  },

	  update() {
		  this.click('@update')
		  this.isPageReady()
	  },

	  zoomIn() {
		  for (let i = 0; i < 5; i++) {
			  this.click('@zoom_in')
			  this.isPageReady()
		  }
	  },

	  clusterVisible() {
		  this.api.expect.element(this.elements.clusterMarker.selector).to.be.present
    },

	  clusterNotVisible() {
		  this.api.expect.element(this.elements.clusterMarker.selector).not.be.present
	  },

	  clickFirstCluster() {
		  this.click('@firstClusterMarker')
	  },

	  clickMarker() {
		  this.click('.map__listing-marker')
      this.api.pause(2000)
    },

	  anyMarkerPresent() {
		  this.api.expect.element('.map__listing-marker').to.be.present
	  },

	  allMarkersShouldBe(color) {
		  this.api.expect.element(`.map__listing-marker.${color}`).to.be.present

      //        SEARCH_DATA.markers.forEach(c => {
      //          if (color === c)
      //            return
      //
      //          this.api.expect.element('.map__listing-marker.' + c).not.to.be.present
      //        })
	  },

	  isSideBarOpen() {
		  this.api.assert.cssClassPresent('.listing-map__filter-form', 'active--non-logged-in')
	  },

    buttonDisabled() {
      this.api.assert.cssProperty('.listing-map__filter-form>form> div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1)', 'color', 'rgba(130, 221, 0, 1)') // '#82dd00'
    },

	  buttonEnabled() {
      this.api.assert.cssProperty(
			  '.listing-map__filter-form > form > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2)',
			  'color',
			  'rgba(51, 51, 51, 1)')
	  },
	  isListingDisplayed() {
		  this.waitForElementVisible('@homeListItems')
		  this.api.expect.element('.listing-panel__list-item').to.be.present

		  return this
	  },

	  verifyBedrooms(value) {
      this.verifyListView()
      this.api.pause(20000)

      let self = this

      this.getText(this.elements.firstBedInGrid.selector, (result) => {
			  self.assert.ok(result.value >= value)
		  })
		  this.getText(this.elements.secondBedInGrid.selector, (result) => {
			  self.assert.ok(result.value >= value)
		  })
		  this.getText(this.elements.thirdBedInGrid.selector, (result) => {
			  self.assert.ok(result.value >= value)
		  })
	  },

	  isDetailVisible() {
		  this.click('@firstListItems')
		  this.waitForElementVisible('@favouriteButton', SEARCH_DATA.defaultWaitTime)
		  this.api.expect.element(this.elements.favouriteButton.selector).to.be.present

		  return this
	  },

	  isMainScreenVisibleAfterClose() {
		  this.click('@closeDetailView')
		  this.waitForElementVisible('@searchInput')
		  this.api.expect.element(this.elements.searchInput.selector).to.be.visible
	  },

	  saveSearch(share, usePhone) {
      this.click('@searchInput')
        .clearValue('@searchInput')
        .setValue('@searchInput', SEARCH_DATA.searchKeywords)
      this.api.keys([this.api.Keys.ENTER])
		  this.waitForElementVisible('@saveSearchButton')
		  this.click('@saveSearchButton')

		  this.waitForElementVisible('@nameAlertModalField')
		  this.click('@nameAlertModalField').setValue('@nameAlertModalField', SEARCH_DATA.searchKeywords)

		  if (share) {
			  this.click('@saveAndShareButton')
        this.waitForElementVisible('@shareToField')

        if (usePhone) {
          this.click('@shareToField')
            .setValue('@shareToField', SEARCH_DATA.searchSharePhone)
        } else {
          this.click('@shareToField')
            .setValue('@shareToField', SEARCH_DATA.searchShareEmail)
        }

        this.api.pause(8000)
        this.api.moveToElement('.modal-body > div > div.sg-container > div > div > div.vcenter.col-md-8.col-sm-8.col-xs-8 > strong', 0, 0) // 900 is X offset
          .mouseButtonClick(0)
        this.click('@shareButtonHomeListing')
        this.waitForElementPresent('@shareButtonHomeListing')
        this.api.pause(10000)
		  } else {
			  this.click('@saveForMeLink')
		  }

		  this.waitForElementNotPresent('@nameAlertModalField')
	  },

	  drawOnMap() {
		  this.zoomIn()
		  this.waitForElementVisible('@drawMapTool')
			  .click('@drawMapTool')
		  this.api.moveToElement('div.listing-map > nav > div:nth-child(3) > div:nth-child(4)', 100, 100)
		  this.api.mouseButtonDown(0)
		  this.api.pause(1000)
		  this.api.moveToElement('div.listing-map > nav > div:nth-child(3) > div:nth-child(4) > div:nth-child(2)', 500, 0)
		  this.api.pause(1000)
		  this.api.moveToElement('div.listing-map > nav > div:nth-child(3) > div:nth-child(4) > div:nth-child(2)', 500, 500)
		  this.api.pause(1000)
		  this.api.moveToElement('div.listing-map > nav > div:nth-child(3) > div:nth-child(4) > div:nth-child(2)', 700, 500)
		  this.api.pause(500)
		  this.api.moveToElement('div.listing-map > nav > div:nth-child(3) > div:nth-child(4) > div:nth-child(2)', 700, 200)
		  this.api.pause(500)
		  this.api.moveToElement('div.listing-map > nav > div:nth-child(3) > div:nth-child(4) > div:nth-child(2)', 500, 200)
		  this.api.pause(500)
		  this.api.moveToElement('div.listing-map > nav > div:nth-child(3) > div:nth-child(4) > div:nth-child(2)', 500, 500)
		  this.api.pause(500)
		  this.api.mouseButtonUp(0)
		  this.api.pause(5000)
	  },

	  saveDrawSearch() {
		  this.waitForElementVisible('@saveSearchButton')
		  this.click('@saveSearchButton')
		  this.waitForElementVisible('@nameAlertModal')
		  this.click('@nameAlertModalField').setValue('@nameAlertModalField', SEARCH_DATA.searchKeywords)
		  this.click('@saveForMeLink')
		  this.waitForElementNotPresent('@nameAlertModal')
	  },

	  searchZipCode() {
		  this.api.refresh()
		  // this.closeHomeListing()
		  // this.zoomIn()
		  this.click('@searchInput')
			  .clearValue('@searchInput')
			  .setValue('@searchInput', SEARCH_DATA.zipCode)
		  this.api.keys([this.api.Keys.ENTER])
		  this.isPageReady()
		  this.verifyListView()

		  let self = this

		  // this.waitForElementVisible('.listing-panel')
		  this.getText(this.elements.firstZipInList.selector, (result) => {
			  self.assert.ok(result.value == SEARCH_DATA.zipCode)
		  })
      this.getText(this.elements.secondZipInList.selector, (result) => {
			  self.assert.ok(result.value == SEARCH_DATA.zipCode)
		  })
	  },

	  verifySearchIsSaved() {
		  this.waitForElementVisible('@savedSearches')
		  this.click('@savedSearches')
		  this.waitForElementVisible('@savedSearchFirstItem')
			  .click('@savedSearchFirstItem')
		  this.api.expect.element(this.elements.savedSearchFirstItem.selector).text.to.equal(SEARCH_DATA.searchKeywords)
	  },

	  closeHomeDialog() {
		  this.waitForElementVisible('@closeShareDialog')
			  .click('@closeShareDialog')
	  },

	  shareListing(searchItem) {
		  this.click('@shareButton')
		  this.click('@shareToField')
			  .setValue('@shareToField', searchItem)
      this.api.pause(8000)
      this.api.moveToElement('.modal-body > div > div.sg-container > div > div > div.vcenter.col-md-8.col-sm-8.col-xs-8 > strong', 0, 0) // 900 is X offset
        .mouseButtonClick(0)
		  this.click('@shareButtonHomeListing')
		  this.waitForElementPresent('@shareButtonHomeListing')
      this.api.pause(10000)
    },

	  selectOnePlusBedroomChoice() {
		  this.waitForElementVisible('@onePlusBedroomChoice')
		  this.click('@onePlusBedroomChoice')
	  },

	  selectTwoPlusBedroomChoice() {
		  this.waitForElementVisible('@twoPlusBedroomChoice')
		  this.moveToElement('@twoPlusBedroomChoice', 0, 0)
        .api.mouseButtonClick(0)
      this.waitForElementVisible('@update')
    },

	  selectThreePlusBedroomChoice() {
		  this.waitForElementVisible('@threePlusBedroomChoice')
		  this.click('@threePlusBedroomChoice')
	  },

	  selectFourPlusBedroomChoice() {
		  this.waitForElementVisible('@fourPlusBedroomChoice')
		  this.click('@fourPlusBedroomChoice')
	  },

	  selectFivePlusBedroomChoice() {
		  this.waitForElementVisible('@fivePlusBedroomChoice')
		  this.click('@fivePlusBedroomChoice')
	  },

	  // Bathroom methods
	  selectOnePlusBathroomChoice() {
		  this.waitForElementVisible('@onePlusBathroomChoice')
		  this.click('@onePlusBathroomChoice')
	  },
	  selectTwoPlusBathroomChoice() {
		  this.waitForElementVisible('@twoPlusBathroomChoice')
		  this.click('@twoPlusBathroomChoice')
	  },

	  selectThreePlusBathroomChoice() {
		  this.waitForElementVisible('@threePlusBathroomChoice')
		  this.click('@threePlusBathroomChoice')
	  },

	  selectFourPlusBathroomChoice() {
		  this.waitForElementVisible('@fourPlusBathroomChoice')
		  this.click('@fourPlusBathroomChoice')
	  },

	  selectFivePlusBathroomChoice() {
		  this.waitForElementVisible('@subDivisionField')
		  this.click('@subDivisionField')
		  this.waitForElementVisible('@fivePlusBathroomChoice')
		  this.click('@fivePlusBathroomChoice')
	  },

	  setPrice() {
		  this.waitForElementVisible('@priceRangeMinInput')
		  this.setValue('@priceRangeMinInput', SEARCH_DATA.minPrice)
		  this.waitForElementVisible('@priceRangeMaxInput')
		  this.setValue('@priceRangeMaxInput', SEARCH_DATA.maxPrice)
	  },

	  verifyBathroomUpdated(value) {
      this.api.pause(20000)
      this.verifyListView()
      this.api.pause(20000)

      let self = this

      this.getText(this.elements.firstBathInGrid.selector, (result) => {
        self.assert.ok(result.value >= value)
      })
	  },

	  verifyPriceUpdated() {
		  this.verifyGridView()

		  let self = this

		  this.getText(this.elements.firstHomeInGrid.selector, (result) => {
        console.log('result.value is', result.value)

        let val = parseInt(result.value.toString().substring(2))
              console.log('val is', val)

			  if (val > SEARCH_DATA.minPrice) {
				  self.assert.ok(val > SEARCH_DATA.minPrice)
			  } else {
          self.assert.ok(val < SEARCH_DATA.maxPrice)
			  }
		  })
	  },

	  // Garage Methods
	  selectOnePlusGarageChoice() {
      this.waitForElementVisible('@onePlusGarageSpace')
      this.click('@onePlusGarageSpace')
	  },

	  selectTwoPlusGarageChoice() {
		  this.waitForElementVisible('@twoPlusGarageSpace')
      this.click('@twoPlusGarageSpace')
	  },

	  selectThreePlusGarageChoice() {
      this.waitForElementVisible('@threePlusGarageSpace')
      this.click('@threePlusGarageSpace')
	  },

	  selectFourPlusGarageChoice() {
		  this.waitForElementVisible('@fourPlusGarageSpace')
		  this.click('@fourPlusGarageSpace')
	  },

	  selectFivePlusGarageChoice() {
      this.waitForElementVisible('@fivePlusGarageSpace')
      this.click('@fivePlusGarageSpace')
	  },

	  // Pool Methods
	  chooseYesForPool() {
		  let poolSection = this.section.pool
		  let squareFootageSection = this.section.squareFootage

		  squareFootageSection.waitForElementVisible('@minInput')
		  squareFootageSection.click('@minInput')
		  poolSection.waitForElementVisible('@yesButton')
		  poolSection.click('@yesButton')
	  },

	  chooseNoForPool() {
		  let poolSection = this.section.pool
		  let squareFootageSection = this.section.squareFootage

		  squareFootageSection.waitForElementVisible('@minInput')
		  squareFootageSection.click('@minInput')
		  poolSection.waitForElementVisible('@noButton')
		  poolSection.click('@noButton')
	  },

	  chooseEitherForPool() {
		  let poolSection = this.section.pool
		  let squareFootageSection = this.section.squareFootage

		  squareFootageSection.waitForElementVisible('@minInput')
		  squareFootageSection.click('@minInput')
		  poolSection.waitForElementVisible('@eitherButton')
		  poolSection.click('@eitherButton')
	  },

	  // Property Types Methods
	  chooseHousePropertyType() {
		  let propertySection = this.section.propertyTypes

		  propertySection.waitForElementVisible('@houseButton')
			  .click('@houseButton')
	  },

	  chooseCondoPropertyType() {
		  let propertySection = this.section.propertyTypes

		  propertySection.waitForElementVisible('@condoButton')
			  .click('@condoButton')
	  },

	  chooseTownHousePropertyType() {
		  let propertySection = this.section.propertyTypes

		  propertySection.waitForElementVisible('@townHouseButton', 1000)
			  .click('@townHouseButton')
	  },

	  // Square Footage
	  setSquareFootage() {
		  let squareFootageSection = this.section.squareFootage

		  squareFootageSection.waitForElementVisible('@minInput')
		  squareFootageSection.click('@minInput')
			  .setValue('@minInput', SEARCH_DATA.squareFootageMinInput)
		  squareFootageSection.click('@maxInput')
			  .setValue('@maxInput', SEARCH_DATA.squareFootageMaxInput)
	  },

	  // Lot Square Footage
	  setLotSquareFootage() {
		  let lotSquareFootageSection = this.section.lotSquareFootage

		  lotSquareFootageSection.waitForElementVisible('@minInput')
		  lotSquareFootageSection.click('@minInput')
			  .setValue('@minInput', SEARCH_DATA.lotSquareFootageMinInput)
		  lotSquareFootageSection.click('@maxInput')
			  .setValue('@maxInput', SEARCH_DATA.lotSquareFootageMaxInput)
	  },
	  clearLotSquareFootage() {
		  let lotSquareFootageSection = this.section.lotSquareFootage

		  lotSquareFootageSection.click('@minInput')
			  .clearValue('@minInput')
		  lotSquareFootageSection.click('@maxInput')
			  .clearValue('@maxInput')
	  },

	  // Year Built
	  setYearBuilt() {
		  let yearBuiltSection = this.section.yearBuilt

		  yearBuiltSection.waitForElementVisible('@minInput')
		  yearBuiltSection.click('@minInput')
			  .setValue('@minInput', SEARCH_DATA.yearBuiltMinInput)
		  yearBuiltSection.click('@maxInput')
			  .setValue('@maxInput', SEARCH_DATA.yearBuiltMaxInput)
	  },

	  clearYearBuiltValues() {
		  let yearBuiltSection = this.section.yearBuilt

		  yearBuiltSection.click('@minInput')
			  .clearValue('@minInput')
		  yearBuiltSection.click('@maxInput')
			  .clearValue('@maxInput')
	  },

	  // Sub Division
	  setSubDivision() {
		  this.waitForElementVisible('@subDivisionField', 10000)
		  this.click('@subDivisionField')
			  .sendKeys('@subDivisionField', SEARCH_DATA.subDivisionField)
		  this.api.pause(SEARCH_DATA.pause1000)
		  this.sendKeys('@subDivisionField', SEARCH_DATA.tabKeyCode) // Pressing TAB key
		  this.waitForElementVisible('.Select-value-label')
	  },

	  // School Districts
	  setSchoolDistrictFilter() {
      //        this.waitForElementVisible('@clearSubDivisionField')
      //          .click('@clearSubDivisionField')
		  this.waitForElementVisible('@schoolDistrict')
			  .click('@schoolDistrict')
			  .setValue('@schoolDistrict', SEARCH_DATA.schoolDistrict)
		  this.api.pause(SEARCH_DATA.pause500)
		  this.sendKeys('@schoolDistrict', SEARCH_DATA.tabKeyCode) // Pressing TAB key
	  },

	  markFavourite() {
		  this.waitForElementVisible('@favouriteButton')

		  let currentImage = ''

		  this.getAttribute('@favouriteButton', 'src', (result) => {
			  currentImage = result.value
		  })
		  this.click('@favouriteButton')
		  this.getAttribute('@favouriteButton', 'src', function (result) {
			  this.assert.notEqual(currentImage, result.value)
		  })
	  },

	  toggleHomeView() {
		  this.toggle('@homeViewBtn')
	  },

	  markHomeViewFavouriteBtn() {
		  this.waitForElementVisible('@homeViewFavouriteBtn')

		  let currentImage = ''

		  this.getAttribute('@homeViewFavouriteBtn', 'src', (result) => {
			  currentImage = result.value
		  })
		  this.click('@homeViewFavouriteBtn')
		  this.getAttribute('@homeViewFavouriteBtn', 'src', function (result) {
			  this.assert.notEqual(currentImage, result.value)
		  })
	  },

	  verifyListView() {
      this.waitForElementVisible('@listViewBtn', 1000)
      this.click('@listViewBtn')
      this.waitForElementVisible('@listViewTable', 1000000)
		  this.assert.visible('@listViewTable')
	  },

	  verifyMapView() {
		  this.click('@mapViewBtn')
		  this.clusterVisible()
	  },

	  verifyGridView() {
		  this.click('@gridViewBtn')
		  this.assert.visible('@listingsOnGrid')
		  // this.api.expect.element(this.elements.listingsOnGrid.selector).to.be.present
	  },

	  stateOnChangingTabs() {
		  let statusVal = this.getText('@statusBar')

		  this.click('@savedSearch')
		  this.click('@savedListings')
		  this.click('@searchListings')

		  let statusValTwo = this.getText('@statusBar')

		  this.api.assert.equal(statusVal, statusValTwo)
	  },

	  sortSidePanelListingArea() {
		  this.api.pause(2000)
		  this.click('@listingSortDropDown').click('@listingDropDownArea')
		  this.api.expect.element(this.elements.listingSortDropDown.selector).text.to.equal(SEARCH_DATA.area)
	  },

	  sortSidePanelListingBedrooms() {
		  this.api.pause(2000)
		  this.click('@listingSortDropDown').click('@listingDropDownBedrooms')
		  this.api.expect.element(this.elements.listingSortDropDown.selector).text.to.equal(SEARCH_DATA.bedrooms)
	  },

	  sortSidePanelListingBaths() {
		  this.api.pause(2000)
		  this.click('@listingSortDropDown').click('@listingDropDownBaths')
		  this.api.expect.element(this.elements.listingSortDropDown.selector).text.to.equal(SEARCH_DATA.baths)
	  },

	  sortSidePanelListingSqft() {
		  this.api.pause(2000)
		  this.click('@listingSortDropDown').click('@listingDropDownSqft')
		  this.api.expect.element(this.elements.listingSortDropDown.selector).text.to.equal(SEARCH_DATA.sqft)
	  },

	  sortSidePanelListingPerSqft() {
		  this.api.pause(2000)
		  this.click('@listingSortDropDown').click('@listingDropDownPerSqft')
		  this.api.expect.element(this.elements.listingSortDropDown.selector).text.to.equal(SEARCH_DATA.perSqft)
	  },

	  sortSidePanelListingBuilt() {
		  this.api.pause(2000)
		  this.click('@listingSortDropDown').click('@listingDropDownBuilt')
		  this.api.expect.element(this.elements.listingSortDropDown.selector).text.to.equal(SEARCH_DATA.built)
	  },

	  sortSidePanelListingDistance() {
		  this.api.pause(2000)
		  this.click('@listingSortDropDown').click('@listingDropDownDistance')
		  this.api.expect.element(this.elements.listingSortDropDown.selector).text.to.equal(SEARCH_DATA.distnace)
	  },

	  searchMls() {
		  this.click('@searchInput')
			  .clearValue('@searchInput')
			  .setValue('@searchInput', SEARCH_DATA.mls)
		  this.api.keys([this.api.Keys.ENTER])
		  // this.isPageReady()
	  },

	  verifyListingWithMLS() {
      this.searchMls()

		  let self = this

		  this.waitForElementVisible('@listingSortDropDown')
		  this.api.expect.element(this.elements.listingCardTitle.selector).text.to.equal(SEARCH_DATA.mlsListingCardTitle)
	  },

	  verifyListingImage() {
		  this.waitForElementVisible('@listingSortDropDown')
		  this.api.pause(2000)
		  this.waitForElementVisible('@listingCardImage', 15000)
		  this.expect.element('@listingCardImage').to.have.css('background-image').which.equals(SEARCH_DATA.mlsImageUrl)
	  },

	  enlargeImage() {
		  this.searchMls()
		  this.waitForElementVisible('@listingSortDropDown', 20000)
      this.api.pause(2000)
      this.clickMarker()
		  this.waitForElementVisible('@listingDetailImage', 20000)
		  this.click('@listingDetailImage')
	  },

    verifyEnlargeImage() {
		  this.waitForElementVisible('@listingDetailImageZoom', 20000)
		  this.assert.visible('@listingDetailImageZoom')
	  },

	  scrollToFifthListing() {
		  this.waitForElementVisible('@homeFifthListing')
		  this.getLocationInView('@homeFifthListing')
			  .assert.visible('@homeFifthListing')
		  this.api.pause(20000)
	  },

	  filterUpdate() {
      this.click('@update')
    },

    checkPoolStatus() {
      this.api.pause(2000)
      this.clickMarker()
      this.api.pause(2000)
      this.waitForElementVisible('@listingDetailPoolStatus')
      this.api.expect.element(this.elements.listingDetailPoolStatus.selector).text.to.equal(SEARCH_DATA.noPool)
    }
  }
  ]
}
