'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Store, Package, Image as ImageIcon, User, LogOut, Save, Plus, X, Edit2, Trash2, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Shop Data
  const [shopData, setShopData] = useState({
    shop_name: '',
    shop_number: '',
    shop_address: '',
    products: [],
    banners: []
  });

  // Product Form
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });
  const [editingProduct, setEditingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Banner Form
  const [bannerForm, setBannerForm] = useState({
    id: '',
    title: '',
    subtitle: '',
    bg: 'from-emerald-600 to-emerald-800'
  });
  const [editingBanner, setEditingBanner] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      await fetchShopData(currentUser.id);
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchShopData = async (adminId) => {
    try {
      const { data, error } = await supabase
        .from('shop_data')
        .select('*')
        .eq('admin_id', adminId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setShopData({
          id: data.id,
          shop_name: data.shop_name || '',
          shop_number: data.shop_number || '',
          shop_address: data.shop_address || '',
          products: data.products || [],
          banners: data.banners || []
        });
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSaveShopInfo = async () => {
    if (!shopData.shop_name || !shopData.shop_number || !shopData.shop_address) {
      showMessage('error', 'Please fill all shop information fields');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        admin_id: user.id,
        shop_name: shopData.shop_name,
        shop_number: shopData.shop_number,
        shop_address: shopData.shop_address,
        products: shopData.products,
        banners: shopData.banners,
        updated_at: new Date().toISOString()
      };

      if (shopData.id) {
        const { error } = await supabase
          .from('shop_data')
          .update(dataToSave)
          .eq('id', shopData.id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('shop_data')
          .insert([dataToSave])
          .select()
          .single();
        
        if (error) throw error;
        setShopData(prev => ({ ...prev, id: data.id }));
      }

      showMessage('success', 'Shop information saved successfully!');
    } catch (error) {
      console.error('Error saving shop info:', error);
      showMessage('error', 'Failed to save shop information');
    } finally {
      setSaving(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setProductForm(prev => ({ ...prev, image: imageUrl }));
      showMessage('success', 'Image uploaded successfully!');
    } catch (error) {
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      showMessage('error', 'Please fill all required product fields');
      return;
    }

    setSaving(true);
    try {
      const newProduct = {
        id: editingProduct ? productForm.id : uuidv4(),
        name: productForm.name,
        price: parseFloat(productForm.price),
        description: productForm.description,
        category: productForm.category,
        image: productForm.image
      };

      let updatedProducts;
      if (editingProduct) {
        updatedProducts = shopData.products.map(p => 
          p.id === productForm.id ? newProduct : p
        );
      } else {
        updatedProducts = [...shopData.products, newProduct];
      }

      const { error } = await supabase
        .from('shop_data')
        .update({ products: updatedProducts, updated_at: new Date().toISOString() })
        .eq('admin_id', user.id);

      if (error) throw error;

      setShopData(prev => ({ ...prev, products: updatedProducts }));
      setProductForm({ id: '', name: '', price: '', description: '', category: '', image: '' });
      setEditingProduct(false);
      showMessage('success', editingProduct ? 'Product updated!' : 'Product added successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      showMessage('error', 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = (product) => {
    setProductForm(product);
    setEditingProduct(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setSaving(true);
    try {
      const updatedProducts = shopData.products.filter(p => p.id !== productId);

      const { error } = await supabase
        .from('shop_data')
        .update({ products: updatedProducts, updated_at: new Date().toISOString() })
        .eq('admin_id', user.id);

      if (error) throw error;

      setShopData(prev => ({ ...prev, products: updatedProducts }));
      showMessage('success', 'Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      showMessage('error', 'Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBanner = async () => {
    if (!bannerForm.title || !bannerForm.subtitle) {
      showMessage('error', 'Please fill all banner fields');
      return;
    }

    setSaving(true);
    try {
      const newBanner = {
        id: editingBanner ? bannerForm.id : uuidv4(),
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        bg: bannerForm.bg
      };

      let updatedBanners;
      if (editingBanner) {
        updatedBanners = shopData.banners.map(b => 
          b.id === bannerForm.id ? newBanner : b
        );
      } else {
        updatedBanners = [...shopData.banners, newBanner];
      }

      const { error } = await supabase
        .from('shop_data')
        .update({ banners: updatedBanners, updated_at: new Date().toISOString() })
        .eq('admin_id', user.id);

      if (error) throw error;

      setShopData(prev => ({ ...prev, banners: updatedBanners }));
      setBannerForm({ id: '', title: '', subtitle: '', bg: 'from-emerald-600 to-emerald-800' });
      setEditingBanner(false);
      showMessage('success', editingBanner ? 'Banner updated!' : 'Banner added successfully!');
    } catch (error) {
      console.error('Error saving banner:', error);
      showMessage('error', 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleEditBanner = (banner) => {
    setBannerForm(banner);
    setEditingBanner(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    setSaving(true);
    try {
      const updatedBanners = shopData.banners.filter(b => b.id !== bannerId);

      const { error } = await supabase
        .from('shop_data')
        .update({ banners: updatedBanners, updated_at: new Date().toISOString() })
        .eq('admin_id', user.id);

      if (error) throw error;

      setShopData(prev => ({ ...prev, banners: updatedBanners }));
      showMessage('success', 'Banner deleted successfully!');
    } catch (error) {
      console.error('Error deleting banner:', error);
      showMessage('error', 'Failed to delete banner');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-emerald-100">{user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center space-x-2"
              >
                <Store className="w-4 h-4" />
                <span>View Shop</span>
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-xl animate-fade-in ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-semibold`}>
          {message.text}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'bg-emerald-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'shop' 
                ? 'bg-emerald-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Store className="w-5 h-5" />
            <span>Shop Info</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'products' 
                ? 'bg-emerald-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Products ({shopData.products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'banners' 
                ? 'bg-emerald-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Banners ({shopData.banners.length})</span>
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Management</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={user?.id || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> To change your email or password, please use Supabase authentication settings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Shop Info Tab */}
        {activeTab === 'shop' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Name *</label>
                <input
                  type="text"
                  value={shopData.shop_name}
                  onChange={(e) => setShopData(prev => ({ ...prev, shop_name: e.target.value }))}
                  placeholder="Enter shop name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Phone Number *</label>
                <input
                  type="tel"
                  value={shopData.shop_number}
                  onChange={(e) => setShopData(prev => ({ ...prev, shop_number: e.target.value }))}
                  placeholder="Enter phone number (e.g., 917385311748)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Address *</label>
                <textarea
                  value={shopData.shop_address}
                  onChange={(e) => setShopData(prev => ({ ...prev, shop_address: e.target.value }))}
                  placeholder="Enter complete shop address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSaveShopInfo}
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Shop Information'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add/Edit Product Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Enter category"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {uploadingImage && (
                      <div className="flex items-center space-x-2 text-emerald-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                        <span className="text-sm">Uploading image...</span>
                      </div>
                    )}
                    {productForm.image && (
                      <div className="relative w-32 h-32">
                        <img src={productForm.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddProduct}
                    disabled={saving || uploadingImage}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}</span>
                  </button>
                  {editingProduct && (
                    <button
                      onClick={() => {
                        setProductForm({ id: '', name: '', price: '', description: '', category: '', image: '' });
                        setEditingProduct(false);
                      }}
                      className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">All Products</h3>
              {shopData.products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products added yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shopData.products.map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                      <img 
                        src={product.image || 'https://via.placeholder.com/200x150?text=No+Image'} 
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-bold text-gray-800 mb-1">{product.name}</h4>
                      <p className="text-emerald-600 font-bold text-lg mb-2">₹{product.price}</p>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <p className="text-xs text-gray-500 mb-3">Category: {product.category}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition flex items-center justify-center space-x-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Add/Edit Banner Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Title *</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter banner title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Subtitle *</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Enter banner subtitle"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background Gradient</label>
                  <select
                    value={bannerForm.bg}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, bg: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="from-emerald-600 to-emerald-800">Emerald</option>
                    <option value="from-green-600 to-green-800">Green</option>
                    <option value="from-teal-600 to-teal-800">Teal</option>
                    <option value="from-blue-600 to-blue-800">Blue</option>
                    <option value="from-purple-600 to-purple-800">Purple</option>
                    <option value="from-pink-600 to-pink-800">Pink</option>
                    <option value="from-red-600 to-red-800">Red</option>
                    <option value="from-orange-600 to-orange-800">Orange</option>
                  </select>
                </div>
                {/* Preview */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                  <div className={`h-32 bg-gradient-to-br ${bannerForm.bg} text-white rounded-lg flex flex-col items-center justify-center`}>
                    <h3 className="text-2xl font-bold mb-1">{bannerForm.title || 'Banner Title'}</h3>
                    <p className="text-white/90">{bannerForm.subtitle || 'Banner Subtitle'}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddBanner}
                    disabled={saving}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{saving ? 'Saving...' : editingBanner ? 'Update Banner' : 'Add Banner'}</span>
                  </button>
                  {editingBanner && (
                    <button
                      onClick={() => {
                        setBannerForm({ id: '', title: '', subtitle: '', bg: 'from-emerald-600 to-emerald-800' });
                        setEditingBanner(false);
                      }}
                      className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Banners List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">All Banners</h3>
              {shopData.banners.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No banners added yet</p>
              ) : (
                <div className="space-y-4">
                  {shopData.banners.map(banner => (
                    <div key={banner.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                      <div className={`h-32 bg-gradient-to-br ${banner.bg} text-white rounded-lg flex flex-col items-center justify-center mb-4`}>
                        <h3 className="text-2xl font-bold mb-1">{banner.title}</h3>
                        <p className="text-white/90">{banner.subtitle}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBanner(banner)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition flex items-center justify-center space-x-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}