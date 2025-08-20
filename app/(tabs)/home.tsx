import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, SafeAreaView, Dimensions, FlatList } from 'react-native';
import { Search, Filter, Bell, MapPin, Star, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { useUI } from '@/contexts/UIProvider';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HomePage() {
  const ui = useUI();
  const categories = ['All Storage', 'Small Garage', 'Large Garage', 'Secure Storage'];
  const [selectedCategory, setSelectedCategory] = useState('All Storage');
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Use the full asset list and avoid repeats across sections to keep images/details consistent
  const listingImages = [
    require('../../assets/listing-images/aldo-festevole-l-URrPJLp8w-unsplash.jpg'),
    require('../../assets/listing-images/alex-suprun-AHnhdjyTNGM-unsplash.jpg'),
    require('../../assets/listing-images/alex-suprun-d304gprGG5k-unsplash.jpg'),
    require('../../assets/listing-images/alexandra-gorn-JIUjvqe2ZHg-unsplash.jpg'),
    require('../../assets/listing-images/arlind-photography-XW38h9JRL_I-unsplash.jpg'),
    require('../../assets/listing-images/avery-klein-JaXs8Tk5Iww-unsplash.jpg'),
    require('../../assets/listing-images/barthelemy-de-mazenod-DI7E79H3joQ-unsplash.jpg'),
    require('../../assets/listing-images/brandi-alexandra-MgJPU2da8jY-unsplash.jpg'),
    require('../../assets/listing-images/caleb-rogers-SGLh5-clL4E-unsplash.jpg'),
    require('../../assets/listing-images/claudio-poggio-FeK8zDytXDA-unsplash.jpg'),
    require('../../assets/listing-images/claudio-schwarz-07r4q_MX6ik-unsplash.jpg'),
    require('../../assets/listing-images/dillon-kydd-3Ignkeds3w8-unsplash.jpg'),
    require('../../assets/listing-images/dillon-kydd-XGvwt544g8k-unsplash.jpg'),
    require('../../assets/listing-images/estefania-ruiz-m1kvhaIw3-8-unsplash.jpg'),
    require('../../assets/listing-images/jakob-rosen-JUkrwViCvyE-unsplash.jpg'),
    require('../../assets/listing-images/jose-rago-LNlJ0WZHiEs-unsplash.jpg'),
    require('../../assets/listing-images/josh-mccausland-BBSk8kPRNw4-unsplash.jpg'),
    require('../../assets/listing-images/kam-idris-_HqHX3LBN18-unsplash.jpg'),
    require('../../assets/listing-images/kate-trifo-iXSD1nM_qQo-unsplash.jpg'),
    require('../../assets/listing-images/keenan-dunn-Y0-OfYQMDlM-unsplash.jpg'),
    require('../../assets/listing-images/kellen-riggin-JZ_HBh_l8F8-unsplash.jpg'),
    require('../../assets/listing-images/kenny-eliason-mGZX2MOPR-s-unsplash.jpg'),
    require('../../assets/listing-images/kevin-schmid-42MP7b-AJ-Q-unsplash.jpg'),
    require('../../assets/listing-images/kevin-wolf-3AbwSH1y9dc-unsplash.jpg'),
    require('../../assets/listing-images/mad-visual-hAZGSiPkfGY-unsplash.jpg'),
    require('../../assets/listing-images/marten-bjork-Z2EgLCJob40-unsplash.jpg'),
    require('../../assets/listing-images/meg-ikvL3QiH9AY-unsplash.jpg'),
    require('../../assets/listing-images/naomi-hebert-MP0bgaS_d1c-unsplash.jpg'),
    require('../../assets/listing-images/outsite-co-R-LK3sqLiBw-unsplash.jpg'),
    require('../../assets/listing-images/point3d-commercial-imaging-ltd-jhJ6WIGW_80-unsplash.jpg'),
    require('../../assets/listing-images/point3d-commercial-imaging-ltd-SP4oH94qOCU-unsplash.jpg'),
    require('../../assets/listing-images/point3d-commercial-imaging-ltd-X_JXnSBKOO4-unsplash.jpg'),
    require('../../assets/listing-images/priscilla-du-preez-tjUD8rg38po-unsplash.jpg'),
    require('../../assets/listing-images/ryunosuke-kikuno-pyZM2RYCwKE-unsplash.jpg'),
    require('../../assets/listing-images/sean-foster-lcJ34i8m7cM-unsplash.jpg'),
    require('../../assets/listing-images/steve-johnson-S0j-5wSN3YQ-unsplash.jpg'),
    require('../../assets/listing-images/theo-TlWM_glSTw0-unsplash.jpg'),
    require('../../assets/listing-images/timothy-buck-psrloDbaZc8-unsplash.jpg'),
    require('../../assets/listing-images/viktor-theo-1rw3l343EDM-unsplash.jpg'),
    require('../../assets/listing-images/vivint-solar-HASgVRE48KY-unsplash.jpg'),
    require('../../assets/listing-images/yucel-moran-iYtsRY32szw-unsplash.jpg'),
  ];

  // Deterministic listings mapped from assets to keep cards and details aligned
  const buildListingsFromAssets = (assets: any[], section: 'exclusive' | 'hub', startIndex: number) => {
    const locations = [
      'Victoria Island, Lagos',
      'Ikoyi, Lagos',
      'Lekki, Lagos',
      'Abuja Central',
      'Garki, Abuja',
      'Port Harcourt',
      'Kano City',
      'Ibadan',
      'Enugu',
      'Calabar'
    ];
    return assets.map((_, i) => {
      const idx = startIndex + i;
      const category = categories[(idx) % categories.length];
      const storageSize = 120 + (idx % 12) * 10;
      const base = section === 'exclusive' ? 140 : 90;
      const price = base + (idx % 8) * 10;
      const rating = 4 + ((idx % 10) / 20);
      return {
        id: `${section}-${idx + 1}`,
        image: assets[i],
        price,
        title: `${category} Space ${storageSize} sq ft`,
        description: `Secure ${category.toLowerCase()} with ${storageSize} sq ft, 24/7 access, and premium security features`,
        rating: parseFloat(rating.toFixed(1)),
        reviews: 60 + (idx % 120),
        location: locations[idx % locations.length],
        size: `${storageSize} sq ft`,
        access: (idx % 2 === 0) ? '24/7 Access' : 'Scheduled Access',
        amenities: ['Security Cameras', 'Climate Control', 'Lighting', 'Shelving', 'Lockable'],
        imageIndex: idx,
        category,
      };
    });
  };

  // Split the master image list into non-overlapping sections
  const exclusiveAssets = listingImages.slice(0, 12);
  const hubAssets = listingImages.slice(12, 24);
  const exploreAssets = listingImages.slice(24, 36);

  const allGarageHubExclusive = buildListingsFromAssets(exclusiveAssets, 'exclusive', 0);
  const allHubListings = buildListingsFromAssets(hubAssets, 'hub', 12);

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
    image: exploreAssets[index % exploreAssets.length],
    location: `${item.state}, Nigeria`,
    title: `Storage Space in ${item.state}`,
    price: 50 + Math.floor(Math.random() * 100),
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
    reviews: Math.floor(Math.random() * 100 + 50),
    description: `Secure storage facilities in ${item.state} with 24/7 access and premium features`,
    size: `${150 + Math.floor(Math.random() * 250)} sq ft`,
    imageIndex: 24 + (index % exploreAssets.length),
    category: 'All Storage'
  }));

  // Filter and sort listings based on search, category, and sort option
  type Listing = ReturnType<typeof generateListings>[number];
  const filterListings = (listings: Listing[]) => {
    let filtered = listings;

    // Filter by category
    if (selectedCategory !== 'All Storage') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort listings
    switch (sortOption) {
      case 'price-low':
        filtered.sort((a: Listing, b: Listing) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a: Listing, b: Listing) => b.price - a.price);
        break;
      case 'rating-high':
        filtered.sort((a: Listing, b: Listing) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  };

  const garageHubExclusive = useMemo(() => filterListings(allGarageHubExclusive), [
    allGarageHubExclusive, selectedCategory, searchQuery, sortOption
  ]);

  const hubListings = useMemo(() => filterListings(allHubListings), [
    allHubListings, selectedCategory, searchQuery, sortOption
  ]);

  const handleCardPress = (item: any) => {
    ui.showLoader('Loading details...');
    setTimeout(() => ui.hideLoader(), 500);
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
        access: item.access || '24/7 Access',
        reviews: item.reviews,
        imagesIdx: JSON.stringify([item.imageIndex]),
        amenities: JSON.stringify(item.amenities || ['Security Cameras', 'Climate Control', 'Lighting'])
      }
    });
  };

  const handleExploreCardPress = (item: any) => {
    router.push('/search');
  };

  const handleSeeAllPress = (): void => {
    router.push('/search');
  };

  const handleSortOptionPress = (option: string) => {
    setSortOption(option);
    setShowFilters(false);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const renderListingItem = ({ item }: { item: any }) => (
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

  const renderHubItem = ({ item }: { item: any }) => (
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

  const renderStateItem = ({ item }: { item: any }) => (
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
              placeholder="Search storage by location..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, showFilters && styles.activeButton]} 
              onPress={toggleFilters}
            >
              <Filter size={20} color={showFilters ? "#ffffff" : "#111111"} />
              {showFilters && (
                <View style={styles.dropdown}>
                  <TouchableOpacity 
                    style={[styles.dropdownRow, sortOption === 'price-low' && styles.activeDropdownRow]}
                    onPress={() => handleSortOptionPress('price-low')}
                  >
                    <Text style={[styles.dropdownText, sortOption === 'price-low' && styles.activeDropdownText]}>
                      Price: Low to High
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.dropdownRow, sortOption === 'price-high' && styles.activeDropdownRow]}
                    onPress={() => handleSortOptionPress('price-high')}
                  >
                    <Text style={[styles.dropdownText, sortOption === 'price-high' && styles.activeDropdownText]}>
                      Price: High to Low
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.dropdownRow, sortOption === 'rating-high' && styles.activeDropdownRow]}
                    onPress={() => handleSortOptionPress('rating-high')}
                  >
                    <Text style={[styles.dropdownText, sortOption === 'rating-high' && styles.activeDropdownText]}>
                      Rating: High to Low
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownRow}
                    onPress={() => handleSortOptionPress('')}
                  >
                    <Text style={styles.dropdownText}>Clear Sorting</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.notificationButton, showNotifications && styles.activeButton]}
              onPress={toggleNotifications}
            >
              <Bell size={20} color={showNotifications ? "#ffffff" : "#111111"} />
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

        {/* Search Results Indicator */}
        {searchQuery.trim() && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsText}>
              Showing results for "{searchQuery}" in {selectedCategory}
            </Text>
          </View>
        )}

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
              onPress={() => handleCategoryPress(category)}
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
            <Text style={styles.resultCount}>({garageHubExclusive.length} listings)</Text>
          </View>
          {garageHubExclusive.length > 0 ? (
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
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No {selectedCategory} listings found matching "{searchQuery}"
              </Text>
            </View>
          )}
        </View>

        {/* Hub Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hub</Text>
            <View style={styles.sectionHeaderRight}>
              <Text style={styles.resultCount}>({hubListings.length} listings)</Text>
              <TouchableOpacity onPress={handleSeeAllPress}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>
          {hubListings.length > 0 ? (
            <FlatList
              data={hubListings}
              renderItem={renderHubItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No {selectedCategory} listings found matching "{searchQuery}"
              </Text>
            </View>
          )}
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

        {/* Footer */}
        <View style={styles.footerAlt}>
          <View style={styles.footerBrandAlt}>
            <Image source={require('../../assets/house.png')} style={styles.footerLogo} resizeMode="contain" />
            <Text style={styles.footerBrandTextAlt}>GarageHub</Text>
          </View>
          <View style={styles.footerLinksAlt}>
            <TouchableOpacity><Text style={styles.footerLinkAlt}>Privacy</Text></TouchableOpacity>
            <Text style={styles.footerSeparatorAlt}>·</Text>
            <TouchableOpacity><Text style={styles.footerLinkAlt}>Terms</Text></TouchableOpacity>
          </View>
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
    paddingBottom: 16,
  },
  topSpacer: {
    height: 24,
  },
  bottomSpacer: {
    height: 8,
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
  activeButton: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
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
  activeDropdownRow: {
    backgroundColor: '#F3F4F6',
  },
  dropdownText: {
    color: '#111827',
    fontSize: 14,
  },
  activeDropdownText: {
    fontWeight: '600',
    color: '#1F2937',
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchResultsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
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
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  resultCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  noResultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
  largeGridItem: {
    width: windowWidth - 40,
    height: windowHeight * 0.42,
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
  mediumGridItem: {
    width: windowWidth * 0.68,
    height: windowHeight * 0.32,
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
  gridItem: {
    width: (windowWidth - 52) / 2,
    height: 220,
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
  footer: {
    marginTop: 40,
    paddingTop: 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  footerAlt: {
    marginTop: 40,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerBrandAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLogo: {
    width: 24,
    height: 24,
  },
  footerBrandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  footerBrandTextAlt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLinksAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerLinkAlt: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerSeparator: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footerSeparatorAlt: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footerCopyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingBottom: 16,
  },
});