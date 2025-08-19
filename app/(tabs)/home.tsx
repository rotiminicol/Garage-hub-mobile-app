import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, SafeAreaView, Dimensions, FlatList } from 'react-native';
import { Search, Filter, Bell, MapPin, Star, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HomePage() {
  const categories = ['Real Estate', 'Apartment', 'House', 'Model'];
  const [selectedCategory, setSelectedCategory] = useState('Real Estate');
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const listingImages = [
    require('../../assets/listing-images/alex-suprun-AHnhdjyTNGM-unsplash.jpg'),
    require('../../assets/listing-images/alexandra-gorn-JIUjvqe2ZHg-unsplash.jpg'),
    require('../../assets/listing-images/point3d-commercial-imaging-ltd-jhJ6WIGW_80-unsplash.jpg'),
    require('../../assets/listing-images/point3d-commercial-imaging-ltd-SP4oH94qOCU-unsplash.jpg'),
    require('../../assets/listing-images/point3d-commercial-imaging-ltd-X_JXnSBKOO4-unsplash.jpg'),
    require('../../assets/listing-images/kenny-eliason-mGZX2MOPR-s-unsplash.jpg'),
    require('../../assets/listing-images/avery-klein-JaXs8Tk5Iww-unsplash.jpg'),
    require('../../assets/listing-images/barthelemy-de-mazenod-DI7E79H3joQ-unsplash.jpg'),
    require('../../assets/listing-images/brandi-alexandra-MgJPU2da8jY-unsplash.jpg'),
    require('../../assets/listing-images/caleb-rogers-SGLh5-clL4E-unsplash.jpg'),
  ];

  // Generate consistent listings with proper details
  const generateListings = (count, section) => {
    return Array.from({ length: count }, (_, index) => {
      const imageIndex = index % listingImages.length;
      const bedroomCount = Math.floor(Math.random() * 3 + 2);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const price = section === 'exclusive' ? 
        `${400 + Math.floor(Math.random() * 200)}` : 
        `${200 + Math.floor(Math.random() * 150)}`;
      
      return {
        id: `${section}-${index + 1}`,
        image: listingImages[imageIndex],
        price: price,
        title: `Luxury ${bedroomCount} Bedroom ${category}`,
        description: `Modern ${bedroomCount} bedroom property with spacious living areas, premium amenities, and secure parking`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 100 + 50),
        location: `Location ${index + 1}, City`,
        size: `${200 + Math.floor(Math.random() * 300)} sq ft`,
        bedrooms: bedroomCount,
        bathrooms: Math.floor(Math.random() * 2 + 1),
        amenities: ['Wi-Fi', 'Parking', 'Security', 'Air Conditioning', 'Furnished'],
        imageIndex: imageIndex // Store the image index for proper reference
      };
    });
  };

  const garageHubExclusive = generateListings(10, 'exclusive');
  const hubListings = generateListings(10, 'hub');

  const nigerianStates = [
    { state: 'Lagos', count: 150 },
    { state: 'Abuja (FCT)', count: 120 },
    { state: 'Rivers', count: 90 },
    { state: 'Kano', count: 80 },
    { state: 'Kaduna', count: 70 },
    { state: 'Oyo', count: 65 },
    { state: 'Enugu', count: 55 },
    { state: 'Cross River', count: 50 },
    { state: 'Akwa Ibom', count: 45 },
    { state: 'Delta', count: 40 },
  ].map((item, index) => ({
    ...item,
    id: `explore-${index + 1}`,
    image: listingImages[index % listingImages.length],
    location: `${item.state}, Nigeria`,
    title: `Premium Storage in ${item.state}`,
    price: `${100 + Math.floor(Math.random() * 200)}`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 100 + 50),
    description: `Secure storage facilities in ${item.state} with 24/7 access and premium features`,
    size: `${150 + Math.floor(Math.random() * 250)} sq ft`,
    imageIndex: index % listingImages.length
  }));

  const handleCardPress = (item) => {
    router.push({
      pathname: '/listingimagedetails',
      params: {
        id: item.id,
        title: item.title,
        price: item.price,
        location: item.location,
        rating: item.rating,
        description: item.description,
        size: item.size,
        bedrooms: item.bedrooms || 2,
        bathrooms: item.bathrooms || 1,
        reviews: item.reviews,
        imagesIdx: JSON.stringify([item.imageIndex]),
        amenities: JSON.stringify(item.amenities || ['Wi-Fi', 'Parking', 'Security'])
      }
    });
  };

  const handleExploreCardPress = (item) => {
    router.push('/search');
  };

  const renderListingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.largeGridItem}
      onPress={() => handleCardPress(item)}
    >
      <Image source={item.image} style={styles.largeGridImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gridGradient}
      />
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle}>{item.title}</Text>
        <View style={styles.gridLocation}>
          <MapPin size={10} color="#9ca3af" />
          <Text style={styles.gridLocationText}>{item.location}</Text>
        </View>
        <View style={styles.gridBottom}>
          <Text style={styles.gridPrice}>${item.price}/mo</Text>
          <View style={styles.gridRating}>
            <Star size={10} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.gridRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHubItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => handleCardPress(item)}
    >
      <Image source={item.image} style={styles.gridImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gridGradient}
      />
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle}>{item.title}</Text>
        <View style={styles.gridLocation}>
          <MapPin size={10} color="#9ca3af" />
          <Text style={styles.gridLocationText}>{item.location}</Text>
        </View>
        <View style={styles.gridBottom}>
          <Text style={styles.gridPrice}>${item.price}/mo</Text>
          <View style={styles.gridRating}>
            <Star size={10} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.gridRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStateItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.mediumGridItem}
      onPress={() => handleExploreCardPress(item)}
    >
      <Image source={item.image} style={styles.mediumGridImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gridGradient}
      />
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle}>{item.title}</Text>
        <View style={styles.gridLocation}>
          <MapPin size={10} color="#9ca3af" />
          <Text style={styles.gridLocationText}>{item.location}</Text>
        </View>
        <View style={styles.gridBottom}>
          <Text style={styles.stateCount}>{item.count} listings</Text>
          <View style={styles.gridRating}>
            <Star size={10} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.gridRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showFilters) setShowFilters(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topSpacer} />
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by location..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.filterButton} 
              onPress={toggleFilters}
            >
              <Filter size={20} color="#111111" />
              {showFilters && (
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownRow}>
                    <Text style={styles.dropdownText}>Price: Low to High</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownRow}>
                    <Text style={styles.dropdownText}>Price: High to Low</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownRow}>
                    <Text style={styles.dropdownText}>Rating: High to Low</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={toggleNotifications}
            >
              <Bell size={20} color="#111111" />
              {showNotifications && (
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownRow}>
                    <Text style={styles.dropdownText}>No new notifications</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Garage-Hub Exclusive Carousel - Larger Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Garage-Hub Exclusive</Text>
          </View>
          <FlatList
            data={garageHubExclusive}
            renderItem={renderListingItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToInterval={windowWidth - 40}
            decelerationRate="fast"
          />
        </View>

        {/* Hub Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hub</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={hubListings}
            renderItem={renderHubItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        {/* Explore Carousel - Medium Size Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore</Text>
          </View>
          <FlatList
            data={nigerianStates}
            renderItem={renderStateItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            snapToInterval={windowWidth - 40}
            decelerationRate="fast"
          />
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topSpacer: {
    height: 24,
  },
  bottomSpacer: {
    height: 48,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
    zIndex: 100,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  notificationButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    width: 180,
    zIndex: 1000,
  },
  dropdownRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownText: {
    color: '##111827',
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryTabActive: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  carouselContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  // Large cards for Garage-Hub Exclusive (about half the screen)
  largeGridItem: {
    width: windowWidth - 40,
    height: windowHeight * 0.45,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  largeGridImage: {
    width: '100%',
    height: '100%',
  },
  // Medium cards for Explore section
  mediumGridItem: {
    width: windowWidth * 0.7,
    height: windowHeight * 0.35,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediumGridImage: {
    width: '100%',
    height: '100%',
  },
  // Regular cards for Hub section
  gridItem: {
    width: (windowWidth - 52) / 2,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  gridInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  gridLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  gridLocationText: {
    fontSize: 12,
    color: '#d1d5db',
  },
  gridBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  gridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  gridRatingText: {
    fontSize: 10,
    color: '#ffffff',
  },
  stateCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
});