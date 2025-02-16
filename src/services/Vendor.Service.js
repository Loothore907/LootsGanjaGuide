// src/services/vendor.service.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data
const mockVendors = [
  {
    id: '1',
    name: 'Green Dreams',
    location: {
      address: '123 Main St, Anchorage, AK 99501',
      coordinates: {
        latitude: 61.217381,
        longitude: -149.863129
      }
    },
    contact: {
      phone: '907-555-0101',
      email: 'info@greendreams.com',
      social: {
        instagram: '@greendreamsak',
        facebook: 'greendreamsanchorage'
      }
    },
    hours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '00:00' },
      saturday: { open: '10:00', close: '00:00' },
      sunday: { open: '12:00', close: '20:00' }
    },
    deals: {
      birthday: {
        description: 'Birthday Special - 25% off entire purchase',
        discount: '25%',
        restrictions: ['Must show valid ID', 'Valid during birthday month']
      },
      daily: {
        monday: [{
          description: 'Munchie Monday',
          discount: '20% off all edibles',
          restrictions: ['While supplies last']
        }],
        tuesday: [{
          description: 'Terpene Tuesday',
          discount: '15% off concentrates',
          restrictions: []
        }],
        wednesday: [{
          description: 'Wax Wednesday',
          discount: 'BOGO 50% off concentrates',
          restrictions: ['Equal or lesser value']
        }],
        thursday: [{
          description: 'Thrifty Thursday',
          discount: '10% off entire purchase',
          restrictions: []
        }],
        friday: [{
          description: 'Friday Funday',
          discount: '$5 off prerolls',
          restrictions: ['Limit 5 per customer']
        }],
        saturday: [{
          description: 'Saturday Sessions',
          discount: '15% off glass and accessories',
          restrictions: []
        }],
        sunday: [{
          description: 'Sunday Funday',
          discount: 'Buy 2 get 1 free on house prerolls',
          restrictions: ['House brands only']
        }]
      },
      special: [{
        title: 'Spring Break Special',
        description: '20% off all products',
        discount: '20%',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-03-31'),
        restrictions: ['Cannot combine with other offers']
      }]
    },
    isPartner: true,
    rating: 4.8,
    lastUpdated: new Date('2025-02-15')
  },
  // Add more mock vendors here...
];

class VendorService {
  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d * 0.621371; // Convert to miles
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  async searchVendors({ dealType, maxDistance, maxResults, currentLocation }) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let filteredVendors = [...mockVendors];

      // Filter by deal type
      if (dealType === 'birthday') {
        filteredVendors = filteredVendors.filter(vendor => 
          vendor.deals.birthday && vendor.deals.birthday.discount
        );
      } else if (dealType === 'daily') {
        const today = new Date().toLocaleLowerCase();
        filteredVendors = filteredVendors.filter(vendor =>
          vendor.deals.daily[today] && vendor.deals.daily[today].length > 0
        );
      }

      // Add distance if location provided
      if (currentLocation) {
        filteredVendors = filteredVendors.map(vendor => ({
          ...vendor,
          distance: this.calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            vendor.location.coordinates.latitude,
            vendor.location.coordinates.longitude
          )
        })).filter(vendor => vendor.distance <= maxDistance);
      }

      // Sort by distance if available, otherwise by rating
      filteredVendors.sort((a, b) => {
        if (a.distance && b.distance) return a.distance - b.distance;
        return b.rating - a.rating;
      });

      // Limit results
      return filteredVendors.slice(0, maxResults);
    } catch (error) {
      console.error('Error searching vendors:', error);
      throw error;
    }
  }

  async getVendorById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockVendors.find(vendor => vendor.id === id);
    } catch (error) {
      console.error('Error getting vendor:', error);
      throw error;
    }
  }

  // Additional methods we'll need later
  async checkInAtVendor(vendorId, userId) {
    try {
      const timestamp = new Date().toISOString();
      // In real implementation, this would be a database call
      await AsyncStorage.setItem(`checkin_${vendorId}_${userId}`, timestamp);
      return { success: true, timestamp };
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  }

  async getVendorAnalytics(vendorId) {
    // Mock analytics data
    return {
      checkIns: 150,
      socialPosts: 75,
      routeVisits: 200,
      uniqueVisitors: 120,
      repeatVisitors: 30
    };
  }
}

export const vendorService = new VendorService();