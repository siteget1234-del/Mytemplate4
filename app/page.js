'use client';

import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, Phone, Plus, X, ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PRODUCTS = [
  {
    id: 1,
    name: 'युरिया 46%',
    price: 270,
    description: 'झाडांसाठी जलद प्रभावी नायट्रोजन खत. वाढ, हिरवेपणा आणि उत्पादन वाढवण्यासाठी उपयुक्त.',
    category: 'पोषण',
    image: 'https://images.pexels.com/photos/21773935/pexels-photo-21773935.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'पेरणी नंतर 20-25 दिवसांनी आणि 45 दिवसांनी वापरा. प्रति एकर 50-60 किलो.',
    benefits: ['झपाट्याने वाढ', 'हिरवेपणा वाढवते', 'उच्च उत्पादन'],
    searchTerms: ['urea', 'yuriya', 'fertilizer', 'khate']
  },
  {
    id: 2,
    name: 'हायब्रिड टोमॅटो बियाणे',
    price: 120,
    description: 'जाड, लाल आणि जास्त उत्पादन देणारी सुधारित हायब्रिड वाण. रोग प्रतिकारक आणि जलद अंकुरण.',
    category: 'बीज',
    image: 'https://images.unsplash.com/photo-1513791053024-3b50799fdd7b?auto=format&fit=crop&w=400&q=80',
    usage: 'पेरणी: जून-जुलै. अंतर: 60×45 सेमी. 30-35 दिवसांत रोप तयार.',
    benefits: ['रोग प्रतिकारक', 'उच्च उत्पादन', 'बाजारपेठेत चांगली मागणी'],
    searchTerms: ['tomato', 'tamatar', 'tometo', 'bijane', 'seeds']
  },
  {
    id: 3,
    name: 'एनपीके 19-19-19',
    price: 190,
    description: 'संतुलित खत (N–P–K) जे फुलोरा, वाढ आणि उत्पन्न सुधारते. सर्व पिकांसाठी सुरक्षित आणि प्रभावी.',
    category: 'पोषण',
    image: 'https://images.unsplash.com/photo-1722044942164-9637e0452395?auto=format&fit=crop&w=400&q=80',
    usage: 'फवारणी: 5 ग्रॅम प्रति लिटर पाणी. मुळाला: 2-3 किलो प्रति एकर.',
    benefits: ['संतुलित पोषण', 'फुलोरा वाढवते', 'फळांची गुणवत्ता सुधारते'],
    searchTerms: ['npk', 'enpike', 'fertilizer', 'khate', 'poshan']
  },
  {
    id: 4,
    name: 'कॉन्फिडोर (कीटकनाशक)',
    price: 110,
    description: 'पांढरी माशी, लसूण, तुडतुडे यांसारख्या कीटकांवर जलद नियंत्रण. दीर्घकाळ प्रभाव राहतो.',
    category: 'संरक्षण',
    image: 'https://images.unsplash.com/photo-1760883652165-06d4db91e646?auto=format&fit=crop&w=400&q=80',
    usage: 'फवारणी: 0.5 मिली प्रति लिटर पाणी. सकाळी किंवा संध्याकाळी फवारा.',
    benefits: ['जलद नियंत्रण', '15-20 दिवस प्रभावी', 'कमी डोस'],
    searchTerms: ['confidor', 'konfidor', 'pesticide', 'keetaknashak', 'insecticide']
  },
  {
    id: 5,
    name: 'हायब्रिड मिरची बियाणे',
    price: 150,
    description: 'तिखट आणि चवदार मिरची. उच्च उत्पादन आणि रोग प्रतिकारक वाण.',
    category: 'बीज',
    image: 'https://images.unsplash.com/photo-1716267075248-2af6d8c9a283?auto=format&fit=crop&w=400&q=80',
    usage: 'पेरणी: मे-जून. अंतर: 45×45 सेमी. 80-90 दिवसांत पीक तयार.',
    benefits: ['तिखटपणा चांगला', 'दीर्घकाळ उत्पादन', 'बाजारात उच्च भाव'],
    searchTerms: ['chilli', 'mirchi', 'pepper', 'seeds', 'bijane']
  },
  {
    id: 6,
    name: 'कांदा बियाणे',
    price: 200,
    description: 'लाल कांद्याचे उत्तम दर्जाचे बियाणे. चांगली साठवणूक क्षमता.',
    category: 'बीज',
    image: 'https://images.unsplash.com/photo-1684039194121-426c3413bcf7?auto=format&fit=crop&w=400&q=80',
    usage: 'पेरणी: ऑक्टोबर-नोव्हेंबर. रोप लागवड: 45 दिवसांनी.',
    benefits: ['उच्च उत्पादन', 'चांगली साठवणूक', 'बाजारपेठेसाठी योग्य'],
    searchTerms: ['onion', 'kanda', 'pyaj', 'seeds', 'bijane']
  },
  {
    id: 7,
    name: 'फुलकोबी बियाणे',
    price: 180,
    description: 'पांढऱ्या आणि घट्ट फुलकोबीसाठी. हिवाळ्यातील पीक.',
    category: 'बीज',
    image: 'https://images.pexels.com/photos/7782091/pexels-photo-7782091.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'पेरणी: जुलै-ऑगस्ट. 60 दिवसांनी फुल तयार.',
    benefits: ['घट्ट फुल', 'हिवाळ्यासाठी योग्य', 'बाजारात मागणी'],
    searchTerms: ['cauliflower', 'fulkobi', 'phoolgobi', 'seeds']
  },
  {
    id: 8,
    name: 'गाजर बियाणे',
    price: 140,
    description: 'लांब आणि गोड गाजरीसाठी उत्तम वाण. जलद वाढ.',
    category: 'बीज',
    image: 'https://images.pexels.com/photos/10041305/pexels-photo-10041305.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'पेरणी: ऑक्टोबर-नोव्हेंबर. 90 दिवसांत तयार.',
    benefits: ['गोड चव', 'लांब गाजर', 'पौष्टिक'],
    searchTerms: ['carrot', 'gajar', 'gajjar', 'seeds', 'bijane']
  },
  {
    id: 9,
    name: 'मॅन्कोझेब फफुंदनाशक',
    price: 95,
    description: 'ففुंद रोगांवर प्रभावी नियंत्रण. टोमॅटो, द्राक्ष, भाजीपाला पिकांसाठी.',
    category: 'संरक्षण',
    image: 'https://images.unsplash.com/photo-1713952152768-5f28b8093166?auto=format&fit=crop&w=400&q=80',
    usage: 'फवारणी: 2 ग्रॅम प्रति लिटर पाणी.',
    benefits: ['फफुंद नियंत्रण', 'सुरक्षित', 'किफायतशीर'],
    searchTerms: ['mancozeb', 'mankojeb', 'fungicide', 'phaphundnashak']
  },
  {
    id: 10,
    name: 'क्लोरोपायरीफॉस',
    price: 130,
    description: 'मातीतील किडे आणि इतर कीटकांवर नियंत्रण. दीर्घकाळ प्रभावी.',
    category: 'संरक्षण',
    image: 'https://images.pexels.com/photos/4176561/pexels-photo-4176561.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'मातीत मिसळा: 4 लिटर प्रति एकर.',
    benefits: ['मातीतील किडे', 'दीर्घकाळ प्रभाव', 'अनेक पिकांसाठी'],
    searchTerms: ['chloropyrifos', 'kloropayriphos', 'pesticide']
  },
  {
    id: 11,
    name: 'लॅम्बडा सायहॅलोथ्रिन',
    price: 145,
    description: 'अळ्या, पाकोळ्या आणि रस शोषक किडे यांवर प्रभावी.',
    category: 'संरक्षण',
    image: 'https://images.pexels.com/photos/4750385/pexels-photo-4750385.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'फवारणी: 1 मिली प्रति लिटर.',
    benefits: ['जलद प्रभाव', 'अनेक कीटकांवर', 'कमी डोस'],
    searchTerms: ['lambda', 'lamda', 'insecticide', 'keetaknashak']
  },
  {
    id: 12,
    name: 'इमामेक्टिन बेंझोएट',
    price: 160,
    description: 'फळवेधक अळ्यांवर विशेष प्रभावी. कमी डोस.',
    category: 'संरक्षण',
    image: 'https://images.unsplash.com/photo-1760883652165-06d4db91e646?auto=format&fit=crop&w=400&q=80',
    usage: 'फवारणी: 0.4 ग्रॅम प्रति लिटर.',
    benefits: ['फळवेधक नियंत्रण', 'अत्यंत प्रभावी', 'सुरक्षित'],
    searchTerms: ['emamectin', 'imamektin', 'pesticide']
  },
  {
    id: 13,
    name: 'ड्रिप इरिगेशन किट',
    price: 1500,
    description: 'पाणी बचत करणारी थेट पाणी देणारी यंत्रणा. 1 एकर साठी.',
    category: 'हार्डवेअर',
    image: 'https://images.unsplash.com/photo-1640306107674-23b73a335f12?auto=format&fit=crop&w=400&q=80',
    usage: '1 एकर क्षेत्रासाठी. 50% पाणी बचत.',
    benefits: ['पाणी बचत', 'समान पाणी', 'उत्पादन वाढ'],
    searchTerms: ['drip', 'irrigation', 'pani', 'yantra']
  },
  {
    id: 14,
    name: 'स्प्रेयर पंप',
    price: 2500,
    description: '16 लिटर हाताने चालवायचा स्प्रेयर. टिकाऊ प्लास्टिक.',
    category: 'हार्डवेअर',
    image: 'https://images.pexels.com/photos/4176561/pexels-photo-4176561.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'कीटकनाशक आणि फफुंदनाशक फवारणीसाठी.',
    benefits: ['टिकाऊ', 'सोयीस्कर', 'समान फवारणी'],
    searchTerms: ['sprayer', 'pump', 'spray', 'favarani']
  },
  {
    id: 15,
    name: 'कुदळ',
    price: 350,
    description: 'मजबूत लोखंडी कुदळ. लाकडी हँडल.',
    category: 'हार्डवेअर',
    image: 'https://images.unsplash.com/photo-1537877853655-34bdcda5e833?auto=format&fit=crop&w=400&q=80',
    usage: 'जमीन खोदणी, निंदण काढणे.',
    benefits: ['मजबूत', 'टिकाऊ', 'आरामदायक'],
    searchTerms: ['kudal', 'spade', 'shovel', 'tool']
  },
  {
    id: 16,
    name: 'गार्डन होस पाईप',
    price: 450,
    description: '50 फूट लांब पाणी पाईप. UV संरक्षित.',
    category: 'हार्डवेअर',
    image: 'https://images.unsplash.com/photo-1523301551780-cd17359a95d0?auto=format&fit=crop&w=400&q=80',
    usage: 'बागेत पाणी देण्यासाठी.',
    benefits: ['लवचिक', 'टिकाऊ', 'UV प्रतिरोधक'],
    searchTerms: ['hose', 'pipe', 'pani', 'tube']
  },
  {
    id: 17,
    name: 'वाटाणा कापणी चाकू',
    price: 280,
    description: 'धारदार स्टेनलेस स्टील. आरामदायक पकड.',
    category: 'हार्डवेअर',
    image: 'https://images.pexels.com/photos/34768285/pexels-photo-34768285.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'भाज्या, फळे कापण्यासाठी.',
    benefits: ['धारदार', 'गंजरोधक', 'टिकाऊ'],
    searchTerms: ['knife', 'chakoo', 'cutter', 'blade']
  },
  {
    id: 18,
    name: 'डीएपी खत',
    price: 320,
    description: 'फॉस्फेट युक्त खत. मुळांच्या वाढीसाठी उत्तम.',
    category: 'पोषण',
    image: 'https://images.pexels.com/photos/21773935/pexels-photo-21773935.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'पेरणीच्या वेळी: 50 किलो प्रति एकर.',
    benefits: ['मुळे मजबूत', 'फुलोरा वाढ', 'उत्पादन वाढ'],
    searchTerms: ['dap', 'diep', 'fertilizer', 'khate']
  },
  {
    id: 19,
    name: 'पोटॅश',
    price: 290,
    description: 'फळे आणि फुलांच्या गुणवत्ता सुधारते. पोटॅशियम युक्त.',
    category: 'पोषण',
    image: 'https://images.unsplash.com/photo-1722044942164-9637e0452395?auto=format&fit=crop&w=400&q=80',
    usage: 'फुलोऱ्याच्या वेळी: 25-30 किलो प्रति एकर.',
    benefits: ['फळांची गुणवत्ता', 'रोग प्रतिकार', 'चव सुधारते'],
    searchTerms: ['potash', 'potash', 'fertilizer']
  },
  {
    id: 20,
    name: 'सल्फर खत',
    price: 180,
    description: 'माती सुधारणा आणि सूक्ष्म पोषक तत्व. पिवळ्या रोगावर नियंत्रण.',
    category: 'पोषण',
    image: 'https://images.pexels.com/photos/4750385/pexels-photo-4750385.jpeg?auto=compress&cs=tinysrgb&w=400',
    usage: 'मातीत मिसळा: 20-25 किलो प्रति एकर.',
    benefits: ['माती सुधारणा', 'pH नियंत्रण', 'रोग प्रतिकार'],
    searchTerms: ['sulphur', 'sulfur', 'gandhak', 'fertilizer']
  },
  {
    id: 21,
    name: 'झिंक सल्फेट',
    price: 150,
    description: 'झिंकची कमतरता भरून काढते. पानावर आणि मातीवर फवारणी.',
    category: 'पोषण',
    image: 'https://images.unsplash.com/photo-1722044942164-9637e0452395?auto=format&fit=crop&w=400&q=80',
    usage: 'फवारणी: 5 ग्रॅम प्रति लिटर. मातीत: 10 किलो प्रति एकर.',
    benefits: ['झिंक कमतरता दूर', 'वाढ सुधारते', 'पीक उत्पादन वाढ'],
    searchTerms: ['zinc', 'jink', 'sulphate', 'sulfate']
  }
];

const CATEGORIES = [
  { name: 'बीज', icon: '🌱', slug: 'seeds' },
  { name: 'संरक्षण', icon: '🛡️', slug: 'protection' },
  { name: 'हार्डवेअर', icon: '🔧', slug: 'hardware' },
  { name: 'पोषण', icon: '🌿', slug: 'nutrition' }
];

const BANNERS = [
  {
    id: 1,
    title: 'खास ऑफर!',
    subtitle: 'सर्व उत्पादनांवर विशेष सूट',
    bg: 'from-emerald-600 to-emerald-800'
  },
  {
    id: 2,
    title: 'नवीन आगमन!',
    subtitle: 'हायब्रिड बियाणे आता उपलब्ध',
    bg: 'from-green-600 to-green-800'
  },
  {
    id: 3,
    title: 'मोफत डिलिव्हरी!',
    subtitle: '₹1000 च्या ऑर्डरवर मोफत घरपोच',
    bg: 'from-teal-600 to-teal-800'
  }
];

// Transliteration mapping (English to Devanagari)
const TRANSLITERATION_MAP = {
  'urea': 'युरिया',
  'yuriya': 'युरिया',
  'tomato': 'टोमॅटो',
  'tamatar': 'टोमॅटो',
  'tometo': 'टोमॅटो',
  'npk': 'एनपीके',
  'enpike': 'एनपीके',
  'confidor': 'कॉन्फिडोर',
  'konfidor': 'कॉन्फिडोर',
  'chilli': 'मिरची',
  'mirchi': 'मिरची',
  'onion': 'कांदा',
  'kanda': 'कांदा',
  'pyaj': 'कांदा',
  'seeds': 'बियाणे',
  'bijane': 'बियाणे',
  'fertilizer': 'खत',
  'khate': 'खत',
  'pesticide': 'कीटकनाशक',
  'keetaknashak': 'कीटकनाशक',
  'insecticide': 'कीटकनाशक'
};

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Auto-slide banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Advanced search with transliteration
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    
    // Check if query matches transliteration
    const transliteratedQuery = TRANSLITERATION_MAP[query] || query;
    
    return PRODUCTS.filter(product => {
      const matchesName = product.name.toLowerCase().includes(query) || 
                          product.name.toLowerCase().includes(transliteratedQuery);
      const matchesDescription = product.description.toLowerCase().includes(query) ||
                                 product.description.toLowerCase().includes(transliteratedQuery);
      const matchesCategory = product.category.toLowerCase().includes(query) ||
                              product.category.toLowerCase().includes(transliteratedQuery);
      const matchesSearchTerms = product.searchTerms?.some(term => 
        term.toLowerCase().includes(query) ||
        query.includes(term.toLowerCase())
      );
      
      return matchesName || matchesDescription || matchesCategory || matchesSearchTerms;
    });
  }, [searchQuery]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const generateWhatsAppMessage = () => {
    let message = 'हे खरेदी करायचे आहे:\n\n';
    cart.forEach((item, index) => {
      message += `${index + 1}) ${item.name} - ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    message += `\nएकूण: ₹${totalAmount}`;
    return encodeURIComponent(message);
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      alert('कृपया प्रथम उत्पादने कार्टमध्ये जोडा!');
      return;
    }
    const whatsappUrl = `https://wa.me/918856983052?text=${generateWhatsAppMessage()}`;
    window.open(whatsappUrl, '_blank');
  };

  const featuredProducts = PRODUCTS.slice(0, 4);
  const categoryProducts = selectedCategory 
    ? PRODUCTS.filter(p => p.category === selectedCategory)
    : null;

  const displayProducts = showSearch && searchQuery 
    ? searchResults 
    : categoryProducts 
    ? categoryProducts 
    : featuredProducts;

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Product Detail Modal
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-emerald-700 text-white sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="flex items-center space-x-2 hover:bg-emerald-600 px-3 py-2 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>परत</span>
              </button>
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-emerald-600 rounded-full transition"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Product Detail */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h1>
                <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {selectedProduct.category}
                </span>
              </div>
              
              <div className="text-3xl font-bold text-emerald-600 mb-6">₹{selectedProduct.price}</div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">वर्णन:</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                </div>
                
                {selectedProduct.usage && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">वापर:</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.usage}</p>
                  </div>
                )}
                
                {selectedProduct.benefits && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">फायदे:</h3>
                    <ul className="space-y-2">
                      {selectedProduct.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2 text-gray-600">
                          <span className="text-emerald-600 mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setShowCart(true);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>कार्टमध्ये जोडा</span>
                </button>
                <a
                  href="tel:8856983052"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center"
                >
                  <Phone className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3" onClick={() => { setSelectedCategory(null); setShowSearch(false); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>
              <div className="text-4xl">🌾</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">श्री गणेश कृषी केंद्र</h1>
                <p className="text-xs md:text-sm text-emerald-100">जि. नाशिक</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-emerald-600 rounded-full transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="उत्पादन शोधा (Search Products)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                  setSelectedCategory(null);
                }}
                onFocus={() => setShowSearch(true)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Banner Carousel */}
      {!showSearch && !selectedCategory && (
        <section className="relative overflow-hidden bg-emerald-700">
          <div className="relative h-56 md:h-72">
            {BANNERS.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className={`h-full bg-gradient-to-br ${banner.bg} text-white flex flex-col items-center justify-center px-4`}>
                  <h2 className="text-3xl md:text-5xl font-bold mb-3 text-center">{banner.title}</h2>
                  <p className="text-lg md:text-xl text-white/90 text-center">{banner.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Banner Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {BANNERS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentBanner ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
          
          {/* Arrow buttons */}
          <button
            onClick={() => setCurrentBanner((currentBanner - 1 + BANNERS.length) % BANNERS.length)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/30 p-2 rounded-full transition z-20"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setCurrentBanner((currentBanner + 1) % BANNERS.length)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/30 p-2 rounded-full transition z-20"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </section>
      )}

      {/* Categories */}
      {!showSearch && !selectedCategory && (
        <section className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.name)}
                className="bg-white p-3 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 active:scale-95 flex flex-col items-center space-y-1"
              >
                <div className="text-3xl">{category.icon}</div>
                <h3 className="text-xs font-semibold text-gray-800 text-center leading-tight">{category.name}</h3>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6">
          {showSearch && searchQuery ? (
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                शोध निकाल ({searchResults.length})
              </h2>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                सर्व उत्पादने पहा
              </button>
            </div>
          ) : selectedCategory ? (
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{selectedCategory}</h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-1"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>परत</span>
              </button>
            </div>
          ) : (
            <h2 className="text-2xl font-bold text-gray-800">खास उत्पादने</h2>
          )}
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">कोणतेही उत्पादन सापडले नाही</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-lg font-bold text-emerald-600">₹{product.price}</p>
                  </div>
                  
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center space-x-1 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>जोडा</span>
                    </button>
                    <a
                      href="tel:8856983052"
                      onClick={(e) => e.stopPropagation()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      {!showSearch && !selectedCategory && (
        <footer className="bg-emerald-700 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <h3 className="text-xl font-bold mb-4">आमच्याशी संपर्क साधा</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-red-400">📍</span>
                <p>आ. पो. – पिंपळगाव बसवंत, ता. निफाड,</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-400">📍</span>
                <p>जि. नाशिक, महाराष्ट्र – ४२२२०९</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-400">📞</span>
                <a href="tel:8856983052" className="hover:text-emerald-200">फोन: 8856983052</a>
              </div>
            </div>
            <div className="border-t border-emerald-600 mt-6 pt-6 text-center text-emerald-200">
              <p>© 2025 श्री गणेश कृषी केंद्र. सर्व हक्क राखीव.</p>
            </div>
          </div>
        </footer>
      )}

      {/* Enhanced Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">माझी कार्ट</h2>
                <p className="text-sm text-emerald-100">{cartItemCount} वस्तू</p>
              </div>
              <button onClick={() => setShowCart(false)} className="hover:bg-emerald-600 p-2 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-semibold">तुमची कार्ट रिकामी आहे</p>
                  <p className="text-gray-400 text-sm mt-2">उत्पादने जोडा आणि खरेदी सुरू करा</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-800 text-sm leading-tight">{item.name}</h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 ml-2 p-1 hover:bg-red-50 rounded transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-emerald-600 font-bold text-lg mb-2">₹{item.price}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="bg-white hover:bg-gray-200 w-7 h-7 rounded-md flex items-center justify-center font-bold text-gray-700 transition"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-bold text-gray-800 w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white w-7 h-7 rounded-md flex items-center justify-center font-bold transition"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="font-bold text-gray-800 text-lg">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 bg-white p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>एकूण वस्तू:</span>
                    <span className="font-semibold">{cartItemCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-2xl font-bold">
                    <span className="text-gray-800">एकूण:</span>
                    <span className="text-emerald-600">₹{totalAmount}</span>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span className="text-lg">WhatsApp वर ऑर्डर करा</span>
                  <span className="text-xl">💬</span>
                </button>
                <p className="text-center text-xs text-gray-500">आम्ही लवकरच तुमच्याशी संपर्क साधू</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}