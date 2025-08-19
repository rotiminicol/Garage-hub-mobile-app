import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Search, Filter, MapPin, Star, Grid2x2 as Grid, List } from 'lucide-react-native';
import { router } from 'expo-router';

// Local listing assets for search results (unique, no repeats)
const listingAssets = [
  require('../../assets/listing-images/alex-suprun-AHnhdjyTNGM-unsplash.jpg'),
  require('../../assets/listing-images/alexandra-gorn-JIUjvqe2ZHg-unsplash.jpg'),
  require('../../assets/listing-images/avery-klein-JaXs8Tk5Iww-unsplash.jpg'),
  require('../../assets/listing-images/barthelemy-de-mazenod-DI7E79H3joQ-unsplash.jpg'),
  require('../../assets/listing-images/brandi-alexandra-MgJPU2da8jY-unsplash.jpg'),
  require('../../assets/listing-images/caleb-rogers-SGLh5-clL4E-unsplash.jpg'),
  require('../../assets/listing-images/claudio-poggio-FeK8zDytXDA-unsplash.jpg'),
  require('../../assets/listing-images/dillon-kydd-3Ignkeds3w8-unsplash.jpg'),
  require('../../assets/listing-images/jakob-rosen-JUkrwViCvyE-unsplash.jpg'),
  require('../../assets/listing-images/josh-mccausland-BBSk8kPRNw4-unsplash.jpg'),
  require('../../assets/listing-images/kam-idris-_HqHX3LBN18-unsplash.jpg'),
  require('../../assets/listing-images/keenan-dunn-Y0-OfYQMDlM-unsplash.jpg'),
  require('../../assets/listing-images/kenny-eliason-mGZX2MOPR-s-unsplash.jpg'),
  require('../../assets/listing-images/kevin-schmid-42MP7b-AJ-Q-unsplash.jpg'),
  require('../../assets/listing-images/kevin-wolf-3AbwSH1y9dc-unsplash.jpg'),
  require('../../assets/listing-images/marten-bjork-Z2EgLCJob40-unsplash.jpg'),
  require('../../assets/listing-images/naomi-hebert-MP0bgaS_d1c-unsplash.jpg'),
  require('../../assets/listing-images/outsite-co-R-LK3sqLiBw-unsplash.jpg'),
  require('../../assets/listing-images/point3d-commercial-imaging-ltd-SP4oH94qOCU-unsplash.jpg'),
  require('../../assets/listing-images/point3d-commercial-imaging-ltd-X_JXnSBKOO4-unsplash.jpg'),
  require('../../assets/listing-images/priscilla-du-preez-tjUD8rg38po-unsplash.jpg'),
  require('../../assets/listing-images/sean-foster-lcJ34i8m7cM-unsplash.jpg'),
  require('../../assets/listing-images/theo-TlWM_glSTw0-unsplash.jpg'),
  require('../../assets/listing-images/timothy-buck-psrloDbaZc8-unsplash.jpg'),
  require('../../assets/listing-images/viktor-theo-1rw3l343EDM-unsplash.jpg'),
  require('../../assets/listing-images/vivint-solar-HASgVRE48KY-unsplash.jpg'),
];

// Twinkling stars (black on white) like splash
const StarTwinkle = ({ x, y, size, delay, duration }: any) => {
  const v = useSharedValue(0);
  useEffect(() => { v.value = withTiming(1, { duration }); }, []);
  const s = useAnimatedStyle(() => ({ opacity: 0.25 + 0.75 * v.value }));
  return <Animated.Text style={[{ position: 'absolute', left: x, top: y, fontSize: size, color: '#111111' }, s]}>✦</Animated.Text>;
};
const StarsLayer = () => {
  const stars = Array.from({ length: 40 }).map((_, i) => ({
    x: Math.random() * 1000,
    y: Math.random() * 1800,
    size: 8 + Math.random() * 6,
    delay: Math.floor(Math.random() * 1200),
    duration: 1400 + Math.floor(Math.random() * 1400),
  }));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s, i) => <StarTwinkle key={i} {...s} />)}
    </View>
  );
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const filterHeight = useSharedValue(0);

  const toggleFilters = () => {
    const next = !showFilters;
    setShowFilters(next);
    filterHeight.value = withTiming(next ? 220 : 0, { duration: 220 });
  };

  const filterStyle = useAnimatedStyle(() => ({
    height: filterHeight.value,
    opacity: filterHeight.value / 220,
  }));

  const listings = [
    {
      id: 1,
      title: 'Luxury Downtown Storage',
      location: 'Manhattan, NY',
      price: 180,
      rating: 4.9,
      size: '300 sq ft',
      image: 'https://images.pexels.com/photos/271808/pexels-photo-271808.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 2,
      title: 'Premium Garage Space',
      location: 'Brooklyn, NY',
      price: 140,
      rating: 4.8,
      size: '250 sq ft',
      image: 'https://images.pexels.com/photos/1756826/pexels-photo-1756826.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 3,
      title: 'Secure Storage Unit',
      location: 'Queens, NY',
      price: 120,
      rating: 4.7,
      size: '200 sq ft',
      image: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 4,
      title: 'Spacious Warehouse Unit',
      location: 'Bronx, NY',
      price: 220,
      rating: 4.6,
      size: '400 sq ft',
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 5,
      title: 'Climate Controlled Storage',
      location: 'Jersey City, NJ',
      price: 160,
      rating: 4.8,
      size: '250 sq ft',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 6,
      title: 'Business Storage Facility',
      location: 'Hoboken, NJ',
      price: 200,
      rating: 4.7,
      size: '350 sq ft',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 7,
      title: '24/7 Access Storage',
      location: 'Newark, NJ',
      price: 130,
      rating: 4.5,
      size: '200 sq ft',
      image: 'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 8,
      title: 'Vehicle Storage',
      location: 'Long Island, NY',
      price: 250,
      rating: 4.9,
      size: '500 sq ft',
      image: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 9,
      title: 'Document Storage',
      location: 'Staten Island, NY',
      price: 90,
      rating: 4.6,
      size: '100 sq ft',
      image: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 10,
      title: 'Wine Cellar Storage',
      location: 'Westchester, NY',
      price: 300,
      rating: 4.9,
      size: '200 sq ft',
      image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 11,
      title: 'RV Storage Lot',
      location: 'Upstate, NY',
      price: 180,
      rating: 4.7,
      size: '600 sq ft',
      image: 'https://images.pexels.com/photos/2363/france-country-home-house.jpg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 12,
      title: 'Boat Storage',
      location: 'Long Beach, NY',
      price: 220,
      rating: 4.8,
      size: '400 sq ft',
      image: 'https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 13,
      title: 'Furniture Storage',
      location: 'Queens, NY',
      price: 150,
      rating: 4.6,
      size: '300 sq ft',
      image: 'https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 14,
      title: 'Art Storage',
      location: 'Manhattan, NY',
      price: 280,
      rating: 4.9,
      size: '200 sq ft',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 15,
      title: 'Business Inventory Storage',
      location: 'Brooklyn, NY',
      price: 200,
      rating: 4.7,
      size: '400 sq ft',
      image: 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const [filtered, setFiltered] = useState(listings);

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setFiltered(listings); return; }
    setFiltered(listings.filter(l => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)));
  };

  const applyFilter = (key: string) => {
    let arr = [...filtered];
    switch (key) {
      case 'priceAsc': arr.sort((a,b)=>a.price-b.price); break;
      case 'priceDesc': arr.sort((a,b)=>b.price-a.price); break;
      case 'ratingDesc': arr.sort((a,b)=>b.rating-a.rating); break;
      default: break;
    }
    setFiltered(arr);
    toggleFilters();
  };

  const GridItem = ({ item, onPress, imgSrc }: { item: any; onPress: () => void; imgSrc: any }) => (
    <TouchableOpacity style={styles.gridItem} onPress={onPress}>
      <Image source={imgSrc} style={styles.gridImage} />
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

  const ListItem = ({ item, onPress, imgSrc }: { item: any; onPress: () => void; imgSrc: any }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <Image source={imgSrc} style={styles.listImage} />
      <View style={styles.listContent}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <View style={styles.listLocation}>
          <MapPin size={12} color="#9ca3af" />
          <Text style={styles.listLocationText}>{item.location}</Text>
        </View>
        <Text style={styles.listSize}>{item.size}</Text>
        <View style={styles.listBottom}>
          <Text style={styles.listPrice}>${item.price}/month</Text>
          <View style={styles.listRating}>
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.listRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <StarsLayer />
        <View style={styles.header}>
          <Text style={styles.title}>Explore Storage</Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TouchableOpacity onPress={handleSearch}>
                <Search size={20} color="#9ca3af" />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by location..."
                placeholderTextColor="#6b7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
              <Filter size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.filtersDropdown, filterStyle]}>
          <View style={styles.dropdownContent}>
            <TouchableOpacity style={styles.dropdownRow} onPress={() => applyFilter('priceAsc')}>
              <Text style={styles.dropdownText}>Price: Low to High</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownRow} onPress={() => applyFilter('priceDesc')}>
              <Text style={styles.dropdownText}>Price: High to Low</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownRow} onPress={() => applyFilter('ratingDesc')}>
              <Text style={styles.dropdownText}>Rating: High to Low</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.controls}>
          <Text style={styles.resultsText}>{filtered.length} storage spaces found</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity 
              style={[styles.toggleButton, viewMode === 'grid' && styles.activeToggle]}
              onPress={() => setViewMode('grid')}
            >
              <Grid size={16} color={viewMode === 'grid' ? '#000' : '#6b7280'} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
              onPress={() => setViewMode('list')}
            >
              <List size={16} color={viewMode === 'list' ? '#000' : '#6b7280'} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {viewMode === 'grid' ? (
            <View style={styles.grid}>
              {filtered.map((item, index) => (
                <GridItem
                  key={item.id}
                  item={item}
                  imgSrc={listingAssets[index % listingAssets.length]}
                  onPress={() =>
                    router.push({
                      pathname: '/listingimagedetails',
                      params: {
                        id: String(item.id),
                        title: item.title,
                        price: String(item.price),
                        location: item.location,
                        rating: String(item.rating),
                        imagesIdx: JSON.stringify([index % listingAssets.length])
                      }
                    })
                  }
                />
              ))}
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((item, index) => (
                <ListItem
                  key={item.id}
                  item={item}
                  imgSrc={listingAssets[index % listingAssets.length]}
                  onPress={() =>
                    router.push({
                      pathname: '/listingimagedetails',
                      params: {
                        id: String(item.id),
                        title: item.title,
                        price: String(item.price),
                        location: item.location,
                        rating: String(item.rating),
                        imagesIdx: JSON.stringify([index % listingAssets.length])
                      }
                    })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersDropdown: {
    marginHorizontal: 20,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  dropdownContent: { paddingVertical: 8 },
  dropdownRow: { paddingHorizontal: 12, paddingVertical: 12 },
  dropdownText: { color: '#111827', fontSize: 14 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsText: {
    color: '#6b7280',
    fontSize: 14,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#fbbf24',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    gap: 12,
    paddingBottom: 100,
  },
  gridItem: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
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
  list: {
    gap: 16,
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  listImage: {
    width: 120,
    height: 100,
  },
  listContent: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 8,
  },
  listLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  listLocationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  listSize: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  listBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  listRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listRatingText: {
    fontSize: 12,
    color: '#111111',
  },
});