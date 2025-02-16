// src/types/vendor.js

/**
 * @typedef {'birthday' | 'daily' | 'special'} DealType
 */

/**
 * @typedef {'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'} DayOfWeek
 */

/**
 * @typedef {Object} BusinessHours
 * @property {string} open
 * @property {string} close
 */

/**
 * @typedef {Object} Deal
 * @property {string} description
 * @property {string} discount
 * @property {string[]} restrictions
 */

/**
 * @typedef {Deal & {
*   title: string,
*   startDate: Date,
*   endDate: Date
* }} SpecialDeal
*/

/**
* @typedef {Object} DailyDeals
* @property {Deal[]} monday
* @property {Deal[]} tuesday
* @property {Deal[]} wednesday
* @property {Deal[]} thursday
* @property {Deal[]} friday
* @property {Deal[]} saturday
* @property {Deal[]} sunday
*/

/**
* @typedef {Object} VendorDeals
* @property {Deal} birthday
* @property {DailyDeals} daily
* @property {SpecialDeal[]} special
*/

/**
* @typedef {Object} VendorLocation
* @property {string} address
* @property {Object} coordinates
* @property {number} coordinates.latitude
* @property {number} coordinates.longitude
*/

/**
* @typedef {Object} VendorContact
* @property {string} phone
* @property {string} email
* @property {Object} social
* @property {string} social.instagram
* @property {string} social.facebook
*/

/**
* @typedef {Object} Vendor
* @property {string} id
* @property {string} name
* @property {VendorLocation} location
* @property {VendorContact} contact
* @property {Object.<DayOfWeek, BusinessHours>} hours
* @property {VendorDeals} deals
* @property {boolean} isPartner
* @property {number} rating
* @property {Date} lastUpdated
*/

/**
* @typedef {Object} VendorSearchParams
* @property {DealType} dealType
* @property {number} maxDistance
* @property {number} maxResults
* @property {Object} [currentLocation]
* @property {number} currentLocation.latitude
* @property {number} currentLocation.longitude
*/

/**
* @typedef {Vendor & {
*   distance: number
* }} VendorWithDistance
*/

export const DAYS_OF_WEEK = [
 'monday',
 'tuesday',
 'wednesday',
 'thursday',
 'friday',
 'saturday',
 'sunday'
];

export const DEAL_TYPES = ['birthday', 'daily', 'special'];