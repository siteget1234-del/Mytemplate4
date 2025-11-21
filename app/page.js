'use client';

import { useState, useMemo } from 'react';
import { ShoppingCart, Search, Phone, Plus, X, Menu } from 'lucide-react';
import Link from 'next/link';

const PRODUCTS = [
  {
    id: 1,
    name: 'युरिया 46%',
    price: 270,
    description: 'झाडांसाठी जलद प्रभावी नायट्रोजन खत. वाढ, हिरवेपणा आणि उत्पादन वाढवण्यासाठी उपयुक्त.',
    category: 'पोषण'
  },
  {
    id: 2,
    name: 'हायब्रिड टोमॅटो बियाणे',
    price: 120,
    description: 'जाड, लाल आणि जास्त उत्पादन देणारी सुधारित हायब्रिड वाण. रोग प्रतिकारक आणि जलद अंकुरण.',
    category: 'बीज'
  },
  {
    id: 3,
    name: 'एनपीके 19-19-19',
    price: 190,
    description: 'संतुलित खत (N–P–K) जे फुलोरा, वाढ आणि उत्पन्न सुधारते. सर्व पिकांसाठी सुरक्षित आणि प्रभावी.',
    category: 'पोषण'
  },
  {
    id: 4,
    name: 'कॉन्फिडोर (कीटकनाशक)',
    price: 110,
    description: 'पांढरी माशी, लसूण, तुडतुडे यांसारख्या कीटकांवर जलद नियंत्रण. दीर्घकाळ प्रभाव राहतो.',
    category: 'संरक्षण'
  },
  // Demo products for बीज category
  {
    id: 5,
    name: 'हायब्रिड मिरची बियाणे',
    price: 150,
    description: 'तिखट आणि चवदार मिरची. उच्च उत्पादन आणि रोग प्रतिकारक वाण.',
    category: 'बीज'
  },
  {
    id: 6,
    name: 'कांदा बियाणे',
    price: 200,
    description: 'लाल कांद्याचे उत्तम दर्जाचे बियाणे. चांगली साठवणूक क्षमता.',
    category: 'बीज'
  },
  {
    id: 7,
    name: 'फुलकोबी बियाणे',
    price: 180,
    description: 'पांढर्‍या आणि घट्ट फुलकोबीसाठी. हिवाळ्यातील पीक.',
    category: 'बीज'
  },
  {
    id: 8,
    name: 'गाजर बियाणे',
    price: 140,
    description: 'लांब आणि गोड गाजरीसाठी उत्तम वाण. जलद वाढ.',
    category: 'बीज'
  },
  // Demo products for संरक्षण category
  {
    id: 9,
    name: 'मॅन्कोझेब फफुंदनाशक',
    price: 95,
    description: 'फफुंद रोगांवर प्रभावी नियंत्रण. टोमॅटो, द्राक्ष, भाजीपाला पिकांसाठी.',
    category: 'संरक्षण'
  },
  {
    id: 10,
    name: 'क्लोरोपायरीफॉस',
    price: 130,
    description: 'मातीतील किडे आणि इतर कीटकांवर नियंत्रण. दीर्घकाळ प्रभावी.',
    category: 'संरक्षण'
  },
  {
    id: 11,
    name: 'लॅम्बडा सायहॅलोथ्रिन',
    price: 145,
    description: 'अळ्या, पाकोळ्या आणि रस शोषक किडे यांवर प्रभावी.',
    category: 'संरक्षण'
  },
  {
    id: 12,
    name: 'इमामेक्टिन बेंझोएट',
    price: 160,
    description: 'फळवेधक अळ्यांवर विशेष प्रभावी. कमी डोस.',
    category: 'संरक्षण'
  },
  // Demo products for हार्डवेअर category
  {
    id: 13,
    name: 'ड्रिप इरिगेशन किट',
    price: 1500,
    description: 'पाणी बचत करणारी थेट पाणी देणारी यंत्रणा. 1 एकर साठी.',
    category: 'हार्डवेअर'
  },
  {
    id: 14,
    name: 'स्प्रेयर पंप',
    price: 2500,
    description: '16 लिटर हाताने चालवायचा स्प्रेयर. टिकाऊ प्लास्टिक.',
    category: 'हार्डवेअर'
  },
  {
    id: 15,
    name: 'कुदळ',
    price: 350,
    description: 'मजबूत लोखंडी कुदळ. लाकडी हँडल.',
    category: 'हार्डवेअर'
  },
  {
    id: 16,
    name: 'गार्डन होस पाईप',
    price: 450,
    description: '50 फूट लांब पाणी पाईप. UV संरक्षित.',
    category: 'हार्डवेअर'
  },
  {
    id: 17,
    name: 'वाटाणा कापणी चाकू',
    price: 280,
    description: 'धारदार स्टेनलेस स्टील. आरामदायक पकड.',
    category: 'हार्डवेअर'
  },
  // Demo products for पोषण category
  {
    id: 18,
    name: 'डीएपी खत',
    price: 320,
    description: 'फॉस्फेट युक्त खत. मुळांच्या वाढीसाठी उत्तम.',
    category: 'पोषण'
  },
  {
    id: 19,
    name: 'पोटॅश',
    price: 290,
    description: 'फळे आणि फुलांच्या गुणवत्ता सुधारते. पोटॅशियम युक्त.',
    category: 'पोषण'
  },
  {
    id: 20,
    name: 'सल्फर खत',
    price: 180,
    description: 'माती सुधारणा आणि सूक्ष्म पोषक तत्व. पिवळ्या रोगावर नियंत्रण.',
    category: 'पोषण'
  },
  {
    id: 21,
    name: 'झिंक सल्फेट',
    price: 150,
    description: 'झिंकची कमतरता भरून काढते. पानावर आणि मातीवर फवारणी.',
    category: 'पोषण'
  }
];

const CATEGORIES = [
  { name: 'बीज', icon: '🌱', slug: 'seeds' },
  { name: 'संरक्षण', icon: '🛡️', slug: 'protection' },
  { name: 'हार्डवेअर', icon: '🔧', slug: 'hardware' },
  { name: 'पोषण', icon: '🌿', slug: 'nutrition' }
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Advanced search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return PRODUCTS.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
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

      {/* Hero Section */}
      {!showSearch && !selectedCategory && (
        <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-3">खास ऑफर!</h2>
            <p className="text-lg md:text-xl text-emerald-100">सर्व उत्पादनांवर विशेष सूट</p>
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {!showSearch && !selectedCategory && (
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(category => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.name)}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center space-y-3"
              >
                <div className="text-5xl">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
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
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                ← परत
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {displayProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-emerald-600">₹{product.price}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>कार्टमध्ये जोडा</span>
                  </button>
                  <a
                    href="tel:8856983052"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
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

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">माझी कार्ट</h2>
              <button onClick={() => setShowCart(false)} className="hover:bg-emerald-600 p-2 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">तुमची कार्ट रिकामी आहे</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 flex-1">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-emerald-600 font-bold mb-2">₹{item.price}</p>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-300 hover:bg-gray-400 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                        <span className="ml-auto font-bold text-gray-800">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>एकूण:</span>
                  <span className="text-emerald-600">₹{totalAmount}</span>
                </div>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center space-x-2"
                >
                  <span>WhatsApp वर ऑर्डर करा</span>
                  <span>💬</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}