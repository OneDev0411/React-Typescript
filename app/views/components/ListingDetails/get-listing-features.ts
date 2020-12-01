import listingUtils from 'utils/listing'
import { numberToUSD } from 'utils/number-to-usd'

export const valueToString = (
  value,
  isCurrency = false,
  formatNumber = true
) => {
  if (value == null || value.length === 0) {
    return 'N/A'
  }

  if (typeof value === 'number' && value > 0) {
    if (isCurrency) {
      return numberToUSD(value)
    }

    if (formatNumber) {
      return value.toLocaleString()
    }
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : 'N/A'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return value
}

interface Item {
  label: string
  value: string
}

export interface Feature {
  title: string
  items: Item[]
}

export function getListingFeatures(listing: IListing): Feature[] {
  const property = listing.property

  return [
    {
      title: 'Cost Breakdown',
      items: [
        {
          label: 'Price/sqt',
          value: valueToString(
            listing.price /
              Math.floor(
                listingUtils.metersToFeet(listing.property.square_meters)
              ),
            true
          )
        },
        {
          label: 'Unexempt Taxes',
          value: valueToString(listing.unexempt_taxes, true)
        },
        {
          label: 'HOA Fee',
          value: valueToString(listing.association_fee, true)
        },
        {
          label: 'HOA Frequency',
          value: valueToString(listing.association_fee_frequency)
        },
        {
          label: 'HOA Includes',
          value: valueToString(listing.association_fee_includes)
        }
      ]
    },
    {
      title: 'Schools',
      items: [
        {
          label: 'School District',
          value: valueToString(property.school_district)
        },
        {
          label: 'Elementary School',
          value: valueToString(property.elementary_school_name)
        },
        {
          label: 'Middle School',
          value: valueToString(property.middle_school_name)
        },
        {
          label: 'Junior High School',
          value: valueToString(property.junior_high_school_name)
        },
        {
          label: 'Senior High School',
          value: valueToString(property.senior_high_school_name)
        }
      ]
    },
    {
      title: 'Amenities & Utilities',
      items: [
        {
          label: 'Pool',
          value: valueToString(property.pool_yn)
        },
        {
          label: 'Pool Features',
          value: valueToString(property.pool_features)
        },
        {
          label: 'Handicap Amenities',
          value: valueToString(property.handicap_yn)
        },
        {
          label: 'Heating/Cooling',
          value: valueToString(property.heating)
        },
        {
          label: 'Others',
          value: valueToString(property.utilities)
        }
      ]
    },
    {
      title: 'Key Facts',
      items: [
        {
          label: 'Year Built',
          value: valueToString(property.year_built, false, false)
        },
        {
          label: 'Style of House',
          value: valueToString(property.architectural_style)
        },
        {
          label: 'Subdivition',
          value: valueToString(property.subdivision_name)
        },
        {
          label: 'Acres',
          value: valueToString(property.lot_size_area)
        },
        {
          label: 'Stories',
          value: valueToString(property.number_of_stories)
        },
        {
          label: 'Possession',
          value: valueToString(listing.possession)
        },
        {
          label: 'Days On Market',
          value: valueToString(listingUtils.getDaysOnMarket(listing))
        },
        {
          label: 'Current Days On Market',
          value: valueToString(listingUtils.getCurrentDaysOnMarket(listing))
        }
      ]
    },

    {
      title: 'Interior Features',
      items: [
        {
          label: 'Interior',
          value: valueToString(property.interior_features)
        },
        {
          label: 'Flooring',
          value: valueToString(property.flooring)
        },
        {
          label: 'Dining Areas',
          value: valueToString(property.number_of_dining_areas)
        },
        {
          label: 'Appliances',
          value: valueToString(property.appliances_yn)
        },
        {
          label: 'Furnished',
          value: valueToString(property.furnished_yn)
        },
        {
          label: 'Alarm/Security',
          value: valueToString(property.security_features)
        }
      ]
    },
    {
      title: 'Exterior Features',
      items: [
        {
          label: 'Construction',
          value: valueToString(property.construction_materials)
        },
        {
          label: 'Foundation',
          value: valueToString(property.foundation_details)
        },
        {
          label: 'Roof',
          value: valueToString(property.roof)
        },
        {
          label: 'Fenced Yard',
          value: valueToString(property.fenced_yard_yn)
        }
      ]
    },
    {
      title: 'Parking',
      items: [
        {
          label: 'Covered Parking Spaces',
          value: valueToString(property.parking_spaces_covered_total)
        },
        {
          label: 'Parking Features',
          value: valueToString(property.parking_features)
        }
      ]
    }
  ]
}
