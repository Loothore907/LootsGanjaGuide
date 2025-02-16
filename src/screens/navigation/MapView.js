// src/screens/navigation/MapView.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Linking, Platform } from 'react-native';
import { Text, Button, Card, Icon } from '@rneui/themed';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useAppState } from '../../context/AppStateContext';

const MapViewScreen = ({ navigation }) => {
  const { state } = useAppState();
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const currentVendor = state.journey.vendors[state.journey.currentVendorIndex];

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } catch (error) {
        setErrorMsg('Error getting location');
        console.error('Location error:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleArrival = () => {
    navigation.navigate('VendorCheckin');
  };

  const openInMaps = () => {
    const { latitude, longitude } = currentVendor.location.coordinates;
    const label = encodeURIComponent(currentVendor.name);
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };

  const getMapHTML = () => {
    if (!userLocation || !currentVendor) return '';
    
    const { latitude: userLat, longitude: userLong } = userLocation;
    const { latitude: vendorLat, longitude: vendorLong } = currentVendor.location.coordinates;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            #map { height: 100vh; width: 100vw; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
          <script>
            function initMap() {
              const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                center: { lat: ${(userLat + vendorLat) / 2}, lng: ${(userLong + vendorLong) / 2} }
              });

              const userMarker = new google.maps.Marker({
                position: { lat: ${userLat}, lng: ${userLong} },
                map: map,
                title: 'Your Location'
              });

              const vendorMarker = new google.maps.Marker({
                position: { lat: ${vendorLat}, lng: ${vendorLong} },
                map: map,
                title: '${currentVendor.name}'
              });
            }
            initMap();
          </script>
        </body>
      </html>
    `;
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centeredContainer}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        source={{ html: getMapHTML() }}
        javaScriptEnabled={true}
      />

      <Card containerStyle={styles.infoCard}>
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{currentVendor.name}</Text>
          <Text style={styles.distance}>
            {currentVendor.distance.toFixed(1)} miles away
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Open in Maps"
            icon={{
              name: "directions",
              type: "material",
              size: 20,
              color: "white"
            }}
            onPress={openInMaps}
            containerStyle={styles.actionButton}
          />
          
          <Button
            title="I've Arrived"
            icon={{
              name: "check-circle",
              type: "material",
              size: 20,
              color: "white"
            }}
            onPress={handleArrival}
            containerStyle={styles.actionButton}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    margin: 0,
    borderRadius: 10,
  },
  vendorInfo: {
    marginBottom: 15,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  distance: {
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default MapViewScreen;