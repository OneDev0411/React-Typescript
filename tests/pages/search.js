const markers = [
  'red',
  'orange',
  'green'
]

module.exports = {
  url: function() {
    return this.api.launchUrl + '/dashboard/mls'
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
      selector: '#open_filters'
    },

    close_filters: {
      selector: '#close_filters'
    },

    sold_toggle: {
      selector: '.listing-map__filter-form>form>div>div:nth-child(1) .react-ios-switch-Switch-button'
    },

    active_toggle: {
      selector: '.listing-map__filter-form>form>div>div:nth-child(2) .react-ios-switch-Switch-button'
    },

    other_toggle: {
      selector: '.listing-map__filter-form>form>div>div:nth-child(3) .react-ios-switch-Switch-button'
    },

    open_house_toggle: {
      selector: '.listing-map__filter-form>form>div>div:nth-child(4) .react-ios-switch-Switch-button'
    },

    update: {
      selector: '.listing-map__filter-form button[type="Submit"]'
    },

    markers: {
      selector: '.map__listing-marker'
    },

    zoom_in: {
      selector: '.btn-group-vertical>button:first-child'
    }
  },

  commands: [
    {
      zip(zip) {
        this
          .click('@keywords')
          .setValue('@keywords', zip)

        this.api.keys([this.api.Keys.ENTER])
      },

      openFilters() {
        this.click('@open_filters')
      },

      closeFilters() {
        this.click('@close_filters')
      },

      ready() {
        this.waitForElementNotPresent('@loading', 10000) //Wait for loading to complete
      },

      toggle(selector) {
        this.waitForElementVisible(selector)
          .click(selector)
      },

      toggleSold() {
        this.toggle('@sold_toggle')
      },

      toggleActive() {
        this.toggle('@active_toggle')
      },

      toggleOthers() {
        this.toggle('@other_toggle')
      },

      toggleOpenHouse() {
        this.toggle('@open_house_toggle')
      },

      update() {
        this.click('@update')
        this.ready()
      },

      zoomIn() {
        this.click('@zoom_in')
        this.ready()
      },

      allMarkersShouldBe(color) {
        this.api.expect('.map__listing-marker.' + color).to.be.present

        markers.forEach(c => {
          if (color === c)
            return

          this.api.expect.element('.map__listing-marker.' + c).not.to.be.present
        })
      }
    }
  ]
};
