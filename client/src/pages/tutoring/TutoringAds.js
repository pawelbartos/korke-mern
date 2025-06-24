import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { createPortal } from 'react-dom';
import { tutoringAPI } from '../../services/api';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
// import { SkeletonAdCard } from './SkeletonAdCard';

// This constant is moved to local storage key
const LOCAL_FAV_KEY = 'tutoring_favorites';

// Komponent karty ogłoszenia
const TutoringAdCard = ({ ad, user, onLike, isLiked }) => {
  return (
    <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow relative">
      <Link to={`/tutoring/${ad._id}`} className="flex flex-row gap-3 w-full">
        {/* Image */}
        <div className="w-24 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
          {(ad.images && ad.images.length > 0 && ad.images[0].url) ? (
            <img src={ad.images[0].url} alt={ad.title} className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400">Brak zdjęcia</span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">{ad.title}</h3>
          <p className="text-xs text-gray-600 mt-1">{ad.subject}</p>
          <div className="flex-grow"></div> {/* Spacer */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>{ad.location.type === 'online' ? 'Online' : ad.location.city}</span>
            <span className="font-semibold text-green-600">{ad.price.amount} zł/h</span>
          </div>
        </div>
      </Link>
      
      {/* Like Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLike(ad._id, e);
        }}
        className="absolute top-1.5 right-1.5 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
      >
        {isLiked ? (
          <BookmarkIconSolid className="h-4 w-4" style={{color: 'rgb(56 213 225)'}} />
        ) : (
          <BookmarkIcon className="h-4 w-4 text-gray-400" />
        )}
      </button>
    </div>
  );
};

// Custom Dropdown Component with better mobile support
const CustomDropdown = ({ 
  buttonText, 
  isActive, 
  items, 
  searchTerm, 
  onSearchChange, 
  onSelect, 
  placeholder,
  searchPlaceholder,
  selectedValue 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef(null);

  // Debug isOpen changes
  useEffect(() => {
    console.log('CustomDropdown isOpen changed:', isOpen, 'for', placeholder);
  }, [isOpen, placeholder]);

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Block body scroll on mobile popup open
  useEffect(() => {
    if (!document.body) return;
    
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      if (document.body) {
        document.body.style.overflow = '';
      }
    };
  }, [isMobile, isOpen]);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleButtonClick = () => {
    console.log('Button clicked, current isOpen:', isOpen);
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    console.log('Close button clicked');
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.value);
    onSearchChange(e.target.value);
  };

  const handleItemSelect = (item) => {
    console.log('Item selected:', item);
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left flex-shrink-0">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={`inline-flex items-center justify-center whitespace-nowrap gap-x-1.5 rounded-full px-3 py-2 sm:py-2.5 text-sm shadow-sm ring-1 ring-inset hover:bg-gray-100 transition-all duration-150 ${
          isActive ? 'ring-[#e1b438]' : 'ring-[#F1F1F1]'
        }`}
        style={{backgroundColor: '#F1F1F1', color: '#000000'}}
      >
        {buttonText}
      </button>

      {isOpen && (
        isMobile ? createPortal(
          <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50" onClick={handleClose}>
            <div 
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg overflow-hidden animate-slide-up"
              style={{ height: '65vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{placeholder}</h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleInputChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Items */}
              <div className="py-2 max-h-[50vh] overflow-y-auto">
                {filteredItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleItemSelect(item)}
                    className={`block w-full text-left px-4 py-3 text-base transition-colors ${
                      selectedValue === item 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        ) : createPortal(
          <div 
            className="fixed inset-0 z-[9999]" 
            onClick={handleClose}
          >
            <div 
              className="absolute bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md max-h-96 overflow-hidden"
              style={{
                top: buttonRef?.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : 0,
                left: buttonRef?.current ? Math.max(0, buttonRef.current.getBoundingClientRect().left) : 0,
                width: Math.min(256, window.innerWidth - 16),
                maxWidth: '256px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-3 border-b border-gray-200">
                <h3 className={`text-sm font-medium text-gray-900 ${searchPlaceholder ? 'pb-2 border-b border-gray-200' : ''}`}>{placeholder}</h3>
                {searchPlaceholder && (
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
              {/* Items */}
              <div className="py-1 max-h-80 overflow-y-auto">
                {filteredItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleItemSelect(item)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedValue === item 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
};

// Skeleton loading component
const SkeletonAdCard = () => (
  <div className="bg-white p-2 rounded-lg shadow-sm w-full relative animate-pulse">
    <div className="flex flex-row gap-3">
      {/* Image Placeholder */}
      <div className="w-28 h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
      
      {/* Content Placeholder */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mt-2"></div>
        <div className="flex-grow"></div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          {/* Removed price placeholder */}
        </div>
      </div>
    </div>
    {/* Removed bookmark placeholder */}
  </div>
);

// Calculate skeleton count based on screen size
const getSkeletonCount = () => {
  // Height of a single skeleton card (p-2 + h-20 = 8px padding + 80px height = 88px) plus gap (gap-2 = 8px)
  const skeletonCardHeight = 88 + 8; // px
  
  // Get viewport height and subtract header/filter heights
  const viewportHeight = window.innerHeight;
  const headerHeight = 120; // Approximate height for nav + filters
  const availableHeight = viewportHeight - headerHeight;
  
  // Calculate how many cards can fit and add 3 extra
  const cardCount = Math.ceil(availableHeight / skeletonCardHeight) + 3;
  
  return Math.max(5, cardCount); // Return at least 5 cards
};

const TutoringAds = () => {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie kategorie');
  const [selectedLocation, setSelectedLocation] = useState('Wszystkie lokalizacje');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortButtonRef = useRef(null);
  const mobileSortButtonRef = useRef(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState('Wszystkie ceny');
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const priceButtonRef = useRef(null);
  const mobilePriceButtonRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with current window width
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 1024;
      console.log('Initial isMobile state:', { windowWidth: window.innerWidth, mobile });
      return mobile;
    }
    return false;
  });
  
  // Pagination and infinite scroll state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [showMoreButton] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Price range options
  const priceRanges = [
    'Wszystkie ceny',
    'Do 50 zł',
    '50-80 zł',
    '80-120 zł',
    '120-200 zł',
    'Powyżej 200 zł'
  ];

  // Debounce search term
  useEffect(() => {
    if (searchTerm.length < 2) {
      setDebouncedSearchTerm('');
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load ads from API
  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true);
        const response = await tutoringAPI.getAds({ 
          limit: 100 // Load all ads at once for filtering
        });
        setAds(response.ads);
      } catch (error) {
        console.error('Error loading ads:', error);
        // On error, keep empty array
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, []);

  // Block body scroll when sort dropdown is open on mobile
  useEffect(() => {
    console.log('Sort dropdown useEffect:', { isMobile, showSortDropdown, documentBodyExists: !!document.body });
    
    if (!document.body) {
      console.log('Document body not available yet');
      return;
    }
    
    if (isMobile && showSortDropdown) {
      console.log('Blocking scroll for sort dropdown');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      console.log('Restoring scroll for sort dropdown');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      if (document.body) {
        console.log('Cleanup: restoring scroll for sort dropdown');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    };
  }, [isMobile, showSortDropdown]);

  // Block body scroll when price dropdown is open on mobile
  useEffect(() => {
    console.log('Price dropdown useEffect:', { isMobile, showPriceDropdown, documentBodyExists: !!document.body });
    
    if (!document.body) {
      console.log('Document body not available yet');
      return;
    }
    
    if (isMobile && showPriceDropdown) {
      console.log('Blocking scroll for price dropdown');
      document.body.style.overflow = 'hidden';
    } else {
      console.log('Restoring scroll for price dropdown');
      document.body.style.overflow = '';
    }
    return () => {
      if (document.body) {
        console.log('Cleanup: restoring scroll for price dropdown');
        document.body.style.overflow = '';
      }
    };
  }, [isMobile, showPriceDropdown]);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      console.log('Window resize:', { windowWidth: window.innerWidth, mobile });
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll blocking for mobile dropdowns
  const handleScroll = () => {
    // This function is referenced in the useEffect dependency array
    // but doesn't need to do anything specific here
  };

  useEffect(() => {
    // This useEffect handles scroll blocking for mobile dropdowns
    if (isMobile && (showSortDropdown || showPriceDropdown)) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobile, showSortDropdown, showPriceDropdown, handleScroll]);

  // Handle filter loading
  const handleFilterChange = (setter, value) => {
    setFilterLoading(true);
    setter(value);
    
    // Simulate loading delay for filters
    setTimeout(() => {
      setFilterLoading(false);
    }, 500); // A shorter delay for better UX
  };

  // Load user or local favorites
  useEffect(() => {
    if (user) {
      const loadFavorites = async () => {
        try {
          const response = await tutoringAPI.getFavorites();
          setFavorites(response.ads.map(ad => ad._id));
          // Sync localStorage favorites with backend
          const localFavs = JSON.parse(localStorage.getItem(LOCAL_FAV_KEY) || '[]');
          for (const adId of localFavs) {
            if (!response.ads.find(ad => ad._id === adId)) {
              await tutoringAPI.toggleFavorite(adId);
            }
          }
          localStorage.removeItem(LOCAL_FAV_KEY);
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      };
      loadFavorites();
    } else {
      // Not logged in: load from localStorage
      const localFavs = JSON.parse(localStorage.getItem(LOCAL_FAV_KEY) || '[]');
      setFavorites(localFavs);
    }
  }, [user]);

  // Toggle favorite
  const handleToggleFavorite = async (adId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (user) {
      try {
        const response = await tutoringAPI.toggleFavorite(adId);
        if (response.isFavorite) {
          setFavorites(prev => [...prev, adId]);
        } else {
          setFavorites(prev => prev.filter(id => id !== adId));
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    } else {
      // Not logged in: use localStorage
      let localFavs = JSON.parse(localStorage.getItem(LOCAL_FAV_KEY) || '[]');
      if (localFavs.includes(adId)) {
        localFavs = localFavs.filter(id => id !== adId);
      } else {
        localFavs.push(adId);
      }
      setFavorites(localFavs);
      localStorage.setItem(LOCAL_FAV_KEY, JSON.stringify(localFavs));
    }
  };

  // Check if ad is favorite
  const isFavorite = (adId) => {
    const result = favorites.includes(adId);
    if (showFavoritesOnly) {
      console.log(`isFavorite(${adId}): ${result}, favorites array:`, favorites);
    }
    return result;
  };

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Najnowsze' },
    { value: 'oldest', label: 'Najstarsze' },
    { value: 'price-low', label: 'Cena: od najniższej' },
    { value: 'price-high', label: 'Cena: od najwyższej' },
    { value: 'title-az', label: 'Tytuł: A-Z' },
    { value: 'title-za', label: 'Tytuł: Z-A' },
    { value: 'location-az', label: 'Lokalizacja: A-Z' },
    { value: 'location-za', label: 'Lokalizacja: Z-A' }
  ];

  // Get current sort option label
  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find(option => option.value === sortBy);
    return currentOption ? currentOption.label : 'Najnowsze';
  };

  // Sort function
  const sortAds = (adsToSort) => {
    const sortedAds = [...adsToSort];
    
    switch (sortBy) {
      case 'newest':
        return sortedAds.sort((a, b) => parseInt(b._id) - parseInt(a._id));
      case 'oldest':
        return sortedAds.sort((a, b) => parseInt(a._id) - parseInt(b._id));
      case 'price-low':
        return sortedAds.sort((a, b) => a.price.amount - b.price.amount);
      case 'price-high':
        return sortedAds.sort((a, b) => b.price.amount - a.price.amount);
      case 'title-az':
        return sortedAds.sort((a, b) => a.title.localeCompare(b.title, 'pl'));
      case 'title-za':
        return sortedAds.sort((a, b) => b.title.localeCompare(a.title, 'pl'));
      case 'location-az':
        return sortedAds.sort((a, b) => {
          const aLocation = a.location.type === 'online' ? 'Online' : a.location.city || '';
          const bLocation = b.location.type === 'online' ? 'Online' : b.location.city || '';
          return aLocation.localeCompare(bLocation, 'pl');
        });
      case 'location-za':
        return sortedAds.sort((a, b) => {
          const aLocation = a.location.type === 'online' ? 'Online' : a.location.city || '';
          const bLocation = b.location.type === 'online' ? 'Online' : b.location.city || '';
          return bLocation.localeCompare(aLocation, 'pl');
        });
      default:
        return sortedAds;
    }
  };

  // Filter ads based on all criteria
  const filteredAds = ads.filter(ad => {
    const matchesCategory = selectedCategory === 'Wszystkie kategorie' || ad.subject === selectedCategory;
    const matchesLocation = selectedLocation === 'Wszystkie lokalizacje' || 
      (ad.location.type === 'online' && selectedLocation === 'Online') ||
      (ad.location.city === selectedLocation);
    const matchesSearch = !debouncedSearchTerm || 
      ad.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    // Favorites filtering
    const matchesFavorites = !showFavoritesOnly || isFavorite(ad._id);
    
    // Debug logging for favorites filtering
    if (showFavoritesOnly) {
      console.log(`Ad ${ad._id} (${ad.title}): isFavorite=${isFavorite(ad._id)}, matchesFavorites=${matchesFavorites}`);
    }
    
    // Price filtering
    let matchesPrice = true;
    if (selectedPriceRange !== 'Wszystkie ceny') {
      switch (selectedPriceRange) {
        case 'Do 50 zł':
          matchesPrice = ad.price.amount <= 50;
          break;
        case '50-80 zł':
          matchesPrice = ad.price.amount >= 50 && ad.price.amount <= 80;
          break;
        case '80-120 zł':
          matchesPrice = ad.price.amount >= 80 && ad.price.amount <= 120;
          break;
        case '120-200 zł':
          matchesPrice = ad.price.amount >= 120 && ad.price.amount <= 200;
          break;
        case 'Powyżej 200 zł':
          matchesPrice = ad.price.amount > 200;
          break;
        default:
          matchesPrice = true;
      }
    }
    
    return matchesCategory && matchesLocation && matchesSearch && matchesFavorites && matchesPrice;
  });

  // Sort filtered ads
  const sortedAds = sortAds(filteredAds);
  const totalAds = sortedAds.length;

  // Paginate ads
  const displayedAds = sortedAds.slice(0, currentPage * itemsPerPage);
  const hasMore = displayedAds.length < totalAds;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLocation, debouncedSearchTerm, showFavoritesOnly, selectedPriceRange, sortBy]);

  // Categories and locations from ads
  const categories = ['Wszystkie kategorie', ...new Set(ads.map(ad => ad.subject))];
  const locations = ['Wszystkie lokalizacje', 'Online', ...new Set(ads.filter(ad => ad.location.city).map(ad => ad.location.city))];

  // Handle show favorites toggle
  const handleShowFavoritesToggle = () => {
    console.log('handleShowFavoritesToggle called');
    setShowFavoritesOnly(prev => {
      const newValue = !prev;
      console.log('Toggling showFavoritesOnly from', prev, 'to', newValue);
      console.log('Current favorites:', favorites);
      return newValue;
    });
  };

  // Handle show more
  const handleShowMore = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 1000);
  };

  // Skeleton cards for loading states
  const skeletonCards = Array.from({ length: getSkeletonCount() }, (_, index) => (
    <SkeletonAdCard key={`skeleton-${index}`} />
  ));

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F1F1F1'}}>
      {/* Filter Section - Full Width White Block - Mobile */}
      <div className="bg-white border-b border-[#E4E4E4] sticky top-[54px] z-[60] lg:hidden h-[54px]" style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        borderTop: '1px solid #E4E4E4',
      }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 overflow-x-auto h-full">
          <div className="flex items-center space-x-2 sm:space-x-3 h-full">
            {/* Filter Buttons - Inline */}
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto">
              {/* Categories Dropdown */}
              <CustomDropdown
                buttonText={selectedCategory}
                isActive={selectedCategory !== 'Wszystkie kategorie'}
                items={categories}
                searchTerm={categorySearchTerm}
                onSearchChange={(value) => setCategorySearchTerm(value)}
                onSelect={(value) => {
                  handleFilterChange(setSelectedCategory, value);
                  setCategorySearchTerm('');
                }}
                placeholder="Szukaj kategorii..."
                searchPlaceholder="Szukaj kategorii..."
                selectedValue={selectedCategory}
                key="mobile-categories"
              />

              {/* Locations Dropdown */}
              <CustomDropdown
                buttonText={selectedLocation}
                isActive={selectedLocation !== 'Wszystkie lokalizacje'}
                items={locations}
                searchTerm={locationSearchTerm}
                onSearchChange={(value) => setLocationSearchTerm(value)}
                onSelect={(value) => {
                  handleFilterChange(setSelectedLocation, value);
                  setLocationSearchTerm('');
                }}
                placeholder="Szukaj miasta..."
                searchPlaceholder="Szukaj miasta..."
                selectedValue={selectedLocation}
                key="mobile-locations"
              />

              {/* Sort Button - Matching other filter buttons style */}
              <div className="relative inline-block text-left flex-shrink-0">
                <button
                  ref={mobileSortButtonRef}
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className={`inline-flex items-center justify-center whitespace-nowrap gap-x-1.5 rounded-full px-3 py-2 sm:py-2.5 text-sm shadow-sm ring-1 ring-inset hover:bg-gray-100 transition-all duration-150 ${
                    sortBy !== 'newest' ? 'ring-[#e1b438]' : 'ring-[#F1F1F1]'
                  }`}
                  style={{backgroundColor: '#F1F1F1', color: '#000000'}}
                >
                  {getCurrentSortLabel()}
                </button>
                
                {showSortDropdown && mobileSortButtonRef.current && isMobile && createPortal(
                  <div 
                    className="fixed inset-0 z-[9999] bg-black bg-opacity-50" 
                    onClick={() => setShowSortDropdown(false)}
                  >
                    <div 
                      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg overflow-hidden animate-slide-up"
                      style={{ height: '65vh' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Sortuj według</h3>
                        <button
                          onClick={() => setShowSortDropdown(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Sort Options */}
                      <div className="py-2 max-h-[60vh] overflow-y-auto">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              handleFilterChange(setSortBy, option.value);
                              setShowSortDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-3 text-base transition-colors ${
                              sortBy === option.value 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Price Filter Dropdown - Matching other filter buttons style */}
              <div className="relative inline-block text-left flex-shrink-0">
                <button
                  ref={mobilePriceButtonRef}
                  onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                  className={`inline-flex items-center justify-center whitespace-nowrap gap-x-1.5 rounded-full px-3 py-2 sm:py-2.5 text-sm shadow-sm ring-1 ring-inset hover:bg-gray-100 transition-all duration-150 ${
                    selectedPriceRange !== 'Wszystkie ceny' ? 'ring-[#e1b438]' : 'ring-[#F1F1F1]'
                  }`}
                  style={{backgroundColor: '#F1F1F1', color: '#000000'}}
                >
                  {selectedPriceRange}
                </button>

                {showPriceDropdown && mobilePriceButtonRef.current && isMobile && createPortal(
                  <div 
                    className="fixed inset-0 z-[9999] bg-black bg-opacity-50" 
                    onClick={() => setShowPriceDropdown(false)}
                  >
                    <div 
                      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg overflow-hidden animate-slide-up"
                      style={{ height: '65vh' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Filtruj według ceny</h3>
                        <button
                          onClick={() => setShowPriceDropdown(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Price Range Options */}
                      <div className="py-2 max-h-[60vh] overflow-y-auto">
                        {priceRanges.map((range) => (
                          <button
                            key={range}
                            onClick={() => {
                              handleFilterChange(setSelectedPriceRange, range);
                              setShowPriceDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-3 text-base transition-colors ${
                              selectedPriceRange === range 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Moje zakładki Button */}
              <button
                onClick={handleShowFavoritesToggle}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-2 sm:py-2.5 text-sm shadow-sm ring-1 ring-inset hover:bg-gray-100 transition-all duration-150 ${
                  showFavoritesOnly ? 'ring-[#e1b438]' : 'ring-[#F1F1F1]'
                }`}
                style={{backgroundColor: '#F1F1F1', color: '#000000'}}
              >
                Moje zakładki
              </button>
              
              {/* Search Bar - Inlined */}
              <div className="flex-1 min-w-[200px] flex-shrink-0">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{color: '#000000'}} />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Szukaj ogłoszeń..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none hover:bg-gray-100 transition-colors placeholder-black ${
                      searchTerm ? 'border-[#e1b438]' : 'border-[#F1F1F1]'
                    } ${searchLoading ? 'pr-10' : ''}`}
                    style={{
                      backgroundColor: '#F1F1F1', 
                      color: '#000000', 
                      fontFamily: 'inherit', 
                      fontWeight: 'normal',
                      fontSize: '14px',
                      lineHeight: '1.25rem'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Original */}
      <div className="bg-white border-b border-[#E4E4E4] pt-1.5 pb-2 sm:pt-2 sm:pb-2 sticky top-[48px] z-[60] hidden lg:block" style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        borderTop: '1px solid #E4E4E4',
      }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 overflow-visible">
          <div className="flex items-center space-x-2 sm:space-x-3 py-2">
            {/* Filter Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-0">
              {/* Categories Dropdown */}
              <CustomDropdown
                buttonText={selectedCategory}
                isActive={selectedCategory !== 'Wszystkie kategorie'}
                items={categories}
                searchTerm={categorySearchTerm}
                onSearchChange={(value) => setCategorySearchTerm(value)}
                onSelect={(value) => {
                  handleFilterChange(setSelectedCategory, value);
                  setCategorySearchTerm('');
                }}
                placeholder="Szukaj kategorii..."
                searchPlaceholder="Szukaj kategorii..."
                selectedValue={selectedCategory}
                key="desktop-categories"
              />

              {/* Locations Dropdown */}
              <CustomDropdown
                buttonText={selectedLocation}
                isActive={selectedLocation !== 'Wszystkie lokalizacje'}
                items={locations}
                searchTerm={locationSearchTerm}
                onSearchChange={(value) => setLocationSearchTerm(value)}
                onSelect={(value) => {
                  handleFilterChange(setSelectedLocation, value);
                  setLocationSearchTerm('');
                }}
                placeholder="Szukaj miasta..."
                searchPlaceholder="Szukaj miasta..."
                selectedValue={selectedLocation}
                key="desktop-locations"
              />

              {/* Sort Button - Matching other filter buttons style */}
              <div className="relative inline-block text-left flex-shrink-0">
                <button
                  ref={sortButtonRef}
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className={`inline-flex items-center justify-center whitespace-nowrap gap-x-1.5 rounded-full px-3 py-2 sm:py-2.5 text-sm shadow-sm ring-1 ring-inset hover:bg-gray-100 transition-all duration-150 ${
                    sortBy !== 'newest' ? 'ring-[#e1b438]' : 'ring-[#F1F1F1]'
                  }`}
                  style={{backgroundColor: '#F1F1F1', color: '#000000'}}
                >
                  {getCurrentSortLabel()}
                </button>
                
                {showSortDropdown && sortButtonRef.current && window.innerWidth >= 1024 && createPortal(
                  <div 
                    className="fixed inset-0 z-[9999]" 
                    onClick={() => setShowSortDropdown(false)}
                  >
                    <div 
                      className="absolute bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md max-h-96 overflow-hidden"
                      style={{
                        top: sortButtonRef?.current ? sortButtonRef.current.getBoundingClientRect().bottom + 8 : 0,
                        left: sortButtonRef?.current ? Math.max(0, sortButtonRef.current.getBoundingClientRect().left) : 0,
                        width: Math.min(256, window.innerWidth - 16),
                        maxWidth: '256px'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Sortuj według</h3>
                      </div>
                      
                      {/* Sort Options */}
                      <div className="py-1 max-h-80 overflow-y-auto">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              handleFilterChange(setSortBy, option.value);
                              setShowSortDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                              sortBy === option.value 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Price Filter Dropdown - Matching other filter buttons style */}
              <div className="relative inline-block text-left flex-shrink-0">
                <button
                  ref={priceButtonRef}
                  onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                  className={`inline-flex items-center justify-center whitespace-nowrap gap-x-1.5 rounded-full px-3 py-2 sm:py-2.5 text-sm shadow-sm ring-1 ring-inset hover:bg-gray-100 transition-all duration-150 ${
                    selectedPriceRange !== 'Wszystkie ceny' ? 'ring-[#e1b438]' : 'ring-[#F1F1F1]'
                  }`}
                  style={{backgroundColor: '#F1F1F1', color: '#000000'}}
                >
                  {selectedPriceRange}
                </button>

                {showPriceDropdown && priceButtonRef.current && window.innerWidth >= 1024 && createPortal(
                  <div 
                    className="fixed inset-0 z-[9999]" 
                    onClick={() => setShowPriceDropdown(false)}
                  >
                    <div 
                      className="absolute bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md max-h-96 overflow-hidden"
                      style={{
                        top: priceButtonRef?.current ? priceButtonRef.current.getBoundingClientRect().bottom + 8 : 0,
                        left: priceButtonRef?.current ? Math.max(0, priceButtonRef.current.getBoundingClientRect().left) : 0,
                        width: Math.min(256, window.innerWidth - 16),
                        maxWidth: '256px'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Filtruj według ceny</h3>
                      </div>
                      
                      {/* Price Range Options */}
                      <div className="py-1 max-h-80 overflow-y-auto">
                        {priceRanges.map((range) => (
                          <button
                            key={range}
                            onClick={() => {
                              handleFilterChange(setSelectedPriceRange, range);
                              setShowPriceDropdown(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                              selectedPriceRange === range 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Moje zakładki Button */}
              <button
                onClick={handleShowFavoritesToggle}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-2 sm:py-2.5 text-sm shadow-sm ring-1 ring-inset hover:bg-gray-100 transition-all duration-150 ${
                  showFavoritesOnly ? 'ring-[#e1b438]' : 'ring-[#F1F1F1]'
                }`}
                style={{backgroundColor: '#F1F1F1', color: '#000000'}}
              >
                Moje zakładki
              </button>
            </div>
            
            {/* Search Bar - Flexible but with minimum width */}
            <div className="flex-1 min-w-[200px] sm:min-w-[300px] flex items-center">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{color: '#000000'}} />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Szukaj ogłoszeń..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 h-10 text-sm border rounded-full focus:outline-none hover:bg-gray-100 transition-colors box-border leading-none placeholder-black ${
                    searchTerm ? 'border-[#e1b438]' : 'border-[#F1F1F1]'
                  } ${searchLoading ? 'pr-10' : ''}`}
                  style={{
                    backgroundColor: '#F1F1F1', 
                    color: '#000000', 
                    fontFamily: 'inherit', 
                    fontWeight: 'normal',
                    fontSize: '14px',
                    lineHeight: '1.25rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutoring Ads List */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 pb-4">
        {/* Information Blocks */}
        <div className="text-sm text-black mb-2 overflow-x-auto whitespace-nowrap -mx-2 sm:-mx-4 px-2 sm:px-4">
            <div className="flex items-center space-x-4 py-1">
                <div className="inline-flex items-center flex-shrink-0">
                    <span className="h-2 w-2 bg-[#38D5E1] rounded-full mr-2"></span>
                    <span>Znaleziono {sortedAds.length} ogłoszeń</span>
                </div>
                <div className="inline-flex items-center flex-shrink-0">
                    <span className="h-2 w-2 bg-[#E1B438] rounded-full mr-2"></span>
                    <span>Jakiś inny tekst informacyjny</span>
                </div>
            </div>
        </div>

        {/* Mobile: Single column layout */}
        <div className="lg:hidden">
          {loading ? (
            <div className="flex flex-col gap-2">
              {skeletonCards}
            </div>
          ) : (filterLoading || searchLoading) ? (
            <div className="flex flex-col gap-2">
              {skeletonCards}
            </div>
          ) : sortedAds.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Brak ogłoszeń do wyświetlenia.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {displayedAds.map((ad) => (
                <TutoringAdCard key={ad._id} ad={ad} user={user} onLike={handleToggleFavorite} isLiked={isFavorite(ad._id)} />
              ))}
              
              {/* Show more button */}
              {showMoreButton && hasMore && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={handleShowMore}
                    disabled={loadingMore}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Ładowanie...
                      </div>
                    ) : (
                      `Pokaż więcej (${totalAds - displayedAds.length} pozostałych)`
                    )}
                  </button>
                </div>
              )}
              
              {/* Infinite scroll loading indicator */}
              {!showMoreButton && loadingMore && (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }, (_, index) => (
                    <SkeletonAdCard key={`loading-${index}`} />
                  ))}
                </div>
              )}
              
              {/* Show more loading skeleton */}
              {showMoreButton && loadingMore && (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }, (_, index) => (
                    <SkeletonAdCard key={`show-more-${index}`} />
                  ))}
                </div>
              )}
              
              {/* End of results */}
              {!hasMore && displayedAds.length > 0 && (
                <div className="text-center text-gray-500 py-4">
                  To wszystkie dostępne ogłoszenia
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop: Single column layout */}
        <div className="hidden lg:block">
          {loading ? (
            <div className="flex flex-col gap-2">
              {skeletonCards}
            </div>
          ) : (filterLoading || searchLoading) ? (
            <div className="flex flex-col gap-2">
              {skeletonCards}
            </div>
          ) : sortedAds.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Brak ogłoszeń do wyświetlenia.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {displayedAds.map((ad) => (
                <TutoringAdCard key={ad._id} ad={ad} user={user} onLike={handleToggleFavorite} isLiked={isFavorite(ad._id)} />
              ))}
              
              {/* Show more button */}
              {showMoreButton && hasMore && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={handleShowMore}
                    disabled={loadingMore}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Ładowanie...
                      </div>
                    ) : (
                      `Pokaż więcej (${totalAds - displayedAds.length} pozostałych)`
                    )}
                  </button>
                </div>
              )}
              
              {/* Infinite scroll loading indicator */}
              {!showMoreButton && loadingMore && (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }, (_, index) => (
                    <SkeletonAdCard key={`loading-${index}`} />
                  ))}
                </div>
              )}
              
              {/* Show more loading skeleton */}
              {showMoreButton && loadingMore && (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }, (_, index) => (
                    <SkeletonAdCard key={`show-more-${index}`} />
                  ))}
                </div>
              )}
              
              {/* End of results */}
              {!hasMore && displayedAds.length > 0 && (
                <div className="text-center text-gray-500 py-4">
                  To wszystkie dostępne ogłoszenia
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Create Ad */}
      {user && (
        <Link
          to="/tutoring/create"
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-50"
        >
          <PlusIcon className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
};

export default TutoringAds;