import React, { useState, useEffect } from 'react';
import {
  ToastProvider,
  useToast,
  Badge,
  Input,
  Order,
  Product,
  StoreSettings,
  Banner,
  subscribeToOrders,
  updateOrderStatusInRTDB,
  updateOrderPaymentStatusInRTDB,
  subscribeToProducts,
  adminSignIn,
  adminSignOut,
  subscribeToAdminSession,
  updateProductInRTDB,
  addProductToRTDB,
  deleteProductFromRTDB,
  fetchStoreSettings,
  updateStoreSettingsInRTDB,
  subscribeToBanners,
  updateBannerInRTDB,
  BottomSheet,
  IconReceipt,
  IconBottle,
  IconTrending,
  IconSettings,
  IconPlus,
  IconEdit,
  IconDelete,
  IconClose,
  IconCheck,
  IconPhone,
  IconMapPin,
  IconCopy,
  IconUPI,
  IconCash,
  AnimatedBottle,
  AnimatedSparkle,
} from '@lucky/shared';

type AdminNavTab = 'orders' | 'products' | 'analytics' | 'settings';

function HyperMartAdmin() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<AdminNavTab>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'active' | 'delivered'>('all');
  
  // Store Settings & Banners (Editable from Admin)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    shopName: 'Lucky Wine & Liquor',
    isOpen: true,
    deliveryFee: 49,
    freeDeliveryAbove: 999,
    minOrder: 299,
    upiId: 'luckywine@upi',
    upiPayeeName: 'Lucky Wine Store',
    phone: '+91 98765 43210',
    pincodes: ['560001', '560002', '560025', '560034', '560038'],
    cutoffTime: '22:30',
    minAgeNotice: 'You must be 21+ years of age to purchase alcoholic beverages.',
  });

  // Promo Banner in User App (Editable from Admin)
  const [promoBanner, setPromoBanner] = useState({
    title: 'Happy Weekend',
    discount: '25% OFF',
    subtitle: '*for All Chilled Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=80',
    active: true,
  });

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    categoryId: 'cat_whiskey',
    price: 999,
    mrp: 1199,
    sizeMl: 750,
    abv: 40.0,
    stock: 20,
    description: '',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600',
    tags: 'Spirits, Popular',
  });

  // Realtime subscription for incoming orders
  useEffect(() => {
    const unsub = subscribeToOrders((liveOrders) => {
      setOrders(liveOrders ?? []);
    });
    return () => unsub();
  }, []);

  // Live catalog (edits from any device show up instantly) + store settings from RTDB
  useEffect(() => {
    const unsubProducts = subscribeToProducts((liveProducts) => {
      setProducts(liveProducts ?? []);
    });
    fetchStoreSettings().then((settings) => {
      if (settings) {
        setStoreSettings(settings);
      }
    });
    const unsubBanners = subscribeToBanners((banners) => {
      if (banners && banners.length > 0) {
        const b = banners[0];
        setPromoBanner({
          title: b.title || 'Happy Weekend',
          discount: b.subtitle || '25% OFF',
          subtitle: '*for All Chilled Drinks',
          imageUrl: b.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500',
          active: b.active ?? true,
        });
      }
    });
    return () => {
      unsubProducts();
      unsubBanners();
    };
  }, []);

  // Writes are confirmed by the live listeners; on failure we say so instead of faking success.
  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    const order = orders.find((o) => o.id === orderId);
    try {
      // A COD order counts as paid once it has been delivered
      const extra = status === 'delivered' && order?.paymentMethod === 'cod' ? { paymentStatus: 'paid' as const } : {};
      await updateOrderStatusInRTDB(orderId, status, extra);
      showToast(`Order #${orderId} marked as ${status.toUpperCase().replace(/_/g, ' ')}`, 'success');
    } catch (err) {
      console.error('Order status update failed:', err);
      showToast('Could not update the order. Check your connection and sign-in.', 'error');
    }
  };

  const handleVerifyUPI = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    try {
      if (order && order.status === 'placed') {
        await updateOrderStatusInRTDB(orderId, 'confirmed', { paymentStatus: 'paid' });
      } else {
        await updateOrderPaymentStatusInRTDB(orderId, 'paid');
      }
      showToast(`UPI payment verified for Order #${orderId}`, 'success');
    } catch (err) {
      console.error('UPI verification failed:', err);
      showToast('Could not verify the payment. Check your connection and sign-in.', 'error');
    }
  };

  const handlePaymentNotReceived = async (orderId: string) => {
    try {
      await updateOrderPaymentStatusInRTDB(orderId, 'failed');
      showToast(`Payment marked as not received for Order #${orderId}`, 'warning');
    } catch (err) {
      console.error('Marking payment failed did not save:', err);
      showToast('Could not update the payment. Check your connection and sign-in.', 'error');
    }
  };

  const handleToggleProductStock = async (product: Product) => {
    const updatedStock = product.stock > 0 ? 0 : 25;
    try {
      await updateProductInRTDB(product.id, { stock: updatedStock });
      showToast(`${product.name} stock set to ${updatedStock}`, 'info');
    } catch (err) {
      console.error('Stock update failed:', err);
      showToast('Could not update stock. Check your connection and sign-in.', 'error');
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: '',
      categoryId: 'cat_whiskey',
      price: 1200,
      mrp: 1400,
      sizeMl: 750,
      abv: 40.0,
      stock: 25,
      description: 'Finely crafted and matured in casks for rich flavor.',
      image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600',
      tags: 'Premium, Chilled',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      brand: p.brand,
      categoryId: p.categoryId,
      price: p.price,
      mrp: p.mrp,
      sizeMl: p.sizeMl,
      abv: p.abv || 40,
      stock: p.stock,
      description: p.description,
      image: p.images[0] || '',
      tags: p.tags?.join(', ') || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      showToast('Please enter a product name', 'warning');
      return;
    }

    if (editingProduct) {
      // Update existing
      const updates: Partial<Product> = {
        name: productForm.name,
        brand: productForm.brand,
        categoryId: productForm.categoryId,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        sizeMl: Number(productForm.sizeMl),
        abv: Number(productForm.abv),
        stock: Number(productForm.stock),
        description: productForm.description,
        images: [productForm.image],
        tags: productForm.tags.split(',').map((t) => t.trim()),
      };
      try {
        await updateProductInRTDB(editingProduct.id, updates);
        showToast(`Updated ${productForm.name}`, 'success');
      } catch (err) {
        console.error('Product update failed:', err);
        showToast('Could not save the product. Check your connection and sign-in.', 'error');
        return;
      }
    } else {
      // Add new product
      const newProd: Product = {
        id: `prod_${Date.now()}`,
        name: productForm.name,
        brand: productForm.brand || 'Lucky Spirits',
        categoryId: productForm.categoryId,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        sizeMl: Number(productForm.sizeMl),
        abv: Number(productForm.abv),
        stock: Number(productForm.stock),
        description: productForm.description,
        images: [productForm.image],
        tags: productForm.tags.split(',').map((t) => t.trim()),
        visible: true,
        featured: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      try {
        await addProductToRTDB(newProd);
        showToast(`Added ${newProd.name} to products!`, 'success');
      } catch (err) {
        console.error('Product add failed:', err);
        showToast('Could not add the product. Check your connection and sign-in.', 'error');
        return;
      }
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductFromRTDB(productId);
        showToast('Product removed from catalog', 'info');
      } catch (err) {
        console.error('Product delete failed:', err);
        showToast('Could not delete the product. Check your connection and sign-in.', 'error');
      }
    }
  };

  const handleSaveStoreSettings = async () => {
    try {
      await updateStoreSettingsInRTDB(storeSettings);
      showToast('Store settings saved', 'success');
    } catch (err) {
      console.error('Settings save failed:', err);
      showToast('Could not save settings. Check your connection and sign-in.', 'error');
    }
  };

  const handleSavePromoBanner = async () => {
    try {
      await updateBannerInRTDB('b1', {
        title: promoBanner.title,
        subtitle: promoBanner.discount,
        image: promoBanner.imageUrl,
        active: promoBanner.active,
      });
      showToast('Promo banner updated on customer app!', 'success');
    } catch (err) {
      console.error('Banner save failed:', err);
      showToast('Could not save the banner. Check your connection and sign-in.', 'error');
    }
  };

  const todayRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'placed' || o.paymentStatus === 'awaiting_verification' || o.paymentStatus === 'payment_submitted'
  ).length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'pending') return o.status === 'placed' || o.paymentStatus === 'awaiting_verification' || o.paymentStatus === 'payment_submitted';
    if (orderFilter === 'active') return o.status === 'confirmed' || o.status === 'packed' || o.status === 'out_for_delivery';
    if (orderFilter === 'delivered') return o.status === 'delivered';
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F4F9F9',
      color: '#1E293B',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '88px',
      boxSizing: 'border-box',
    }}>
      {/* 1. Header with Compact Safe Area Padding (Just 10-12px) */}
      <header
        className="app-header-safe"
        style={{
          backgroundColor: '#FFFFFF',
          paddingTop: 'max(env(safe-area-inset-top, 8px), 10px)',
          paddingBottom: '12px',
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E8F2F2',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AnimatedBottle size={26} color="#4AB7B6" glow />
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#4AB7B6',
              margin: 0,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '-0.3px',
            }}>
              Lucky<span style={{ color: '#FDAA5D' }}>Admin</span>
            </h1>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
              Live Store Manager
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => { void adminSignOut(); }}
          aria-label="Sign out"
          style={{
            backgroundColor: 'transparent',
            border: '1.5px solid #CBD5E1',
            color: '#64748B',
            borderRadius: '9999px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
        {/* Live Store Status Switch */}
        <button
          onClick={async () => {
            const next = !storeSettings.isOpen;
            try {
              await updateStoreSettingsInRTDB({ isOpen: next });
              setStoreSettings((s) => ({ ...s, isOpen: next }));
              showToast(next ? 'Store open & accepting orders' : 'Store paused', next ? 'success' : 'warning');
            } catch (err) {
              console.error('Store open/close failed:', err);
              showToast('Could not change store status. Check your connection and sign-in.', 'error');
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: storeSettings.isOpen ? '#E8F5F5' : '#FDECEC',
            border: `1.5px solid ${storeSettings.isOpen ? '#4AB7B6' : '#EA7173'}`,
            color: storeSettings.isOpen ? '#2C7372' : '#EA7173',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: storeSettings.isOpen ? '#4AB7B6' : '#EA7173',
          }} />
          <span>{storeSettings.isOpen ? 'Open' : 'Paused'}</span>
        </button>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main style={{ padding: '14px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                Orders Pipeline ({orders.length})
              </h3>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
              {[
                { id: 'all', label: `All (${orders.length})` },
                { id: 'pending', label: `Needs Action (${pendingOrdersCount})` },
                { id: 'active', label: 'In Transit' },
                { id: 'delivered', label: 'Delivered' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id as any)}
                  style={{
                    backgroundColor: orderFilter === f.id ? '#4AB7B6' : '#FFFFFF',
                    color: orderFilter === f.id ? '#FFFFFF' : '#64748B',
                    border: `1px solid ${orderFilter === f.id ? '#4AB7B6' : '#E2ECEC'}`,
                    borderRadius: '9999px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                <p style={{ margin: 0 }}>No orders in this status.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1px solid #E8F2F2',
                    padding: '16px',
                    boxShadow: '0 4px 16px rgba(74, 183, 182, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                        #{order.id}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px' }}>
                        &bull; {order.userName}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Badge status={order.status} size="sm" />
                      <Badge paymentStatus={order.paymentStatus} size="sm" />
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                    {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#64748B',
                    backgroundColor: '#F8FAFC',
                    padding: '8px 12px',
                    borderRadius: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconMapPin size={14} color="#64748B" />
                      <span>{order.address.line1}, {order.address.pincode}</span>
                    </div>
                    <a
                      href={`tel:${order.userPhone}`}
                      style={{
                        color: '#4AB7B6',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <IconPhone size={12} color="#4AB7B6" />
                      <span>{order.userPhone}</span>
                    </a>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '6px',
                    borderTop: '1px solid #F1F5F9',
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>Total Payable</span>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                      {order.utr && (
                        <div style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace', marginTop: '2px' }}>
                          UTR: {order.utr}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {order.paymentStatus === 'payment_submitted' && (
                        <button
                          onClick={() => handlePaymentNotReceived(order.id)}
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#EA7173',
                            border: '1.5px solid #EA7173',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Not received
                        </button>
                      )}

                      {(order.paymentStatus === 'awaiting_verification' || order.paymentStatus === 'payment_submitted') && (
                        <button
                          onClick={() => handleVerifyUPI(order.id)}
                          style={{
                            backgroundColor: '#FDAA5D',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(253, 170, 93, 0.4)',
                          }}
                        >
                          Verify UPI
                        </button>
                      )}

                      {order.status === 'placed' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          style={{
                            backgroundColor: '#4AB7B6',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(74, 183, 182, 0.35)',
                          }}
                        >
                          Confirm
                        </button>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'packed')}
                          style={{
                            backgroundColor: '#4AB7B6',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Mark Packed
                        </button>
                      )}

                      {order.status === 'packed' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'out_for_delivery')}
                          style={{
                            backgroundColor: '#4AB7B6',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Dispatch
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          style={{
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* TAB 2: PRODUCTS (Renamed from Catalog as requested) */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                  Product Catalog ({products.length})
                </h3>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Add, edit prices, or adjust stock counts</span>
              </div>

              <button
                onClick={openAddProductModal}
                style={{
                  backgroundColor: '#4AB7B6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(74, 183, 182, 0.35)',
                }}
              >
                <IconPlus size={16} color="#FFFFFF" />
                <span>Add Product</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    border: '1px solid #E8F2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{ width: '46px', height: '46px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <h5 style={{ fontSize: '13px', margin: '0 0 2px', color: '#1E293B' }}>{p.name}</h5>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        ₹{p.price.toLocaleString('en-IN')} &bull; {p.sizeMl}ml &bull; Stock: <strong>{p.stock}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleProductStock(p)}
                      style={{
                        backgroundColor: p.stock > 0 ? '#E8F5F5' : '#FDECEC',
                        color: p.stock > 0 ? '#2C7372' : '#EA7173',
                        border: `1px solid ${p.stock > 0 ? '#4AB7B6' : '#EA7173'}`,
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {p.stock > 0 ? 'In Stock' : 'Out'}
                    </button>

                    <button
                      onClick={() => openEditProductModal(p)}
                      aria-label="Edit product"
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconEdit size={14} color="#64748B" />
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      aria-label="Delete product"
                      style={{
                        backgroundColor: '#FDECEC',
                        border: '1px solid #EA7173',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconDelete size={14} color="#EA7173" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS (Top metric KPI cards only appear here as requested!) */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
              Store Sales &amp; Metrics
            </h3>

            {/* Metric KPI Cards (Only displayed here!) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid #E8F2F2',
                boxShadow: '0 4px 12px rgba(74, 183, 182, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Today's Sales
                </span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                  ₹{todayRevenue.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>
                  +18% Today
                </span>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid #E8F2F2',
                boxShadow: '0 4px 12px rgba(253, 170, 93, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Active Orders
                </span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#FDAA5D', fontFamily: "'Poppins', sans-serif" }}>
                  {orders.length}
                </span>
                <span style={{ fontSize: '10px', color: '#64748B' }}>
                  Live Dispatch
                </span>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid #E8F2F2',
                boxShadow: '0 4px 12px rgba(234, 113, 115, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Avg Order
                </span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#4AB7B6', fontFamily: "'Poppins', sans-serif" }}>
                  ₹{orders.length > 0 ? Math.round(todayRevenue / orders.length).toLocaleString('en-IN') : '0'}
                </span>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>
                  Healthy
                </span>
              </div>
            </div>

            {/* Payment Distribution */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '18px',
              border: '1px solid #E8F2F2',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Payment Breakdown</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{
                  flex: 1,
                  backgroundColor: '#F0FBFB',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #D1EBEB',
                }}>
                  <div style={{ fontSize: '11px', color: '#2C7372', fontWeight: 700 }}>Instant UPI</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>78%</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Settled instantly</div>
                </div>

                <div style={{
                  flex: 1,
                  backgroundColor: '#FFF9F2',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #FED7AA',
                }}>
                  <div style={{ fontSize: '11px', color: '#C2410C', fontWeight: 700 }}>Cash on Delivery</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>22%</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Doorstep collected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STORE & APP SETTINGS (Admin can edit all User App configurations) */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
              Customer App &amp; Store Controls
            </h3>

            {/* Section A: Customer App Promo Banner Editor */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '18px',
              border: '1px solid #E8F2F2',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                  Homepage Promo Banner
                </span>
                <span style={{ fontSize: '11px', color: '#4AB7B6', fontWeight: 700 }}>
                  Updates User App Instantly
                </span>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  Banner Title
                </label>
                <input
                  type="text"
                  value={promoBanner.title}
                  onChange={(e) => setPromoBanner({ ...promoBanner, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Discount Tag
                  </label>
                  <input
                    type="text"
                    value={promoBanner.discount}
                    onChange={(e) => setPromoBanner({ ...promoBanner, discount: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Banner Subtitle
                  </label>
                  <input
                    type="text"
                    value={promoBanner.subtitle}
                    onChange={(e) => setPromoBanner({ ...promoBanner, subtitle: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                onClick={handleSavePromoBanner}
                style={{
                  backgroundColor: '#FDAA5D',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save Promo Banner
              </button>
            </div>

            {/* Section B: Store & Payment Configuration */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '18px',
              border: '1px solid #E8F2F2',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                Store &amp; UPI Configuration
              </span>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  Store Display Name
                </label>
                <input
                  type="text"
                  value={storeSettings.shopName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, shopName: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Merchant UPI ID
                  </label>
                  <input
                    type="text"
                    value={storeSettings.upiId}
                    onChange={(e) => setStoreSettings({ ...storeSettings, upiId: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    UPI Payee Name
                  </label>
                  <input
                    type="text"
                    value={storeSettings.upiPayeeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, upiPayeeName: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={storeSettings.deliveryFee}
                    onChange={(e) => setStoreSettings({ ...storeSettings, deliveryFee: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Free Delivery Above (₹)
                  </label>
                  <input
                    type="number"
                    value={storeSettings.freeDeliveryAbove}
                    onChange={(e) => setStoreSettings({ ...storeSettings, freeDeliveryAbove: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveStoreSettings}
                style={{
                  backgroundColor: '#4AB7B6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(74, 183, 182, 0.3)',
                }}
              >
                Save Store Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. Product Add / Edit Bottom Sheet */}
      <BottomSheet
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Product Name *
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Brand
              </label>
              <input
                type="text"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
              >
                <option value="cat_whiskey">Spirits / Whisky</option>
                <option value="cat_beer">Beer / Lager</option>
                <option value="cat_wine">Fine Wine</option>
                <option value="cat_vodka">Vodka</option>
                <option value="cat_rum">Rum</option>
                <option value="cat_gin">Gin</option>
                <option value="cat_mixers">Mixers</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Price (₹)
              </label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                MRP (₹)
              </label>
              <input
                type="number"
                value={productForm.mrp}
                onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Stock
              </label>
              <input
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Size (ml)
              </label>
              <input
                type="number"
                value={productForm.sizeMl}
                onChange={(e) => setProductForm({ ...productForm, sizeMl: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                ABV %
              </label>
              <input
                type="number"
                step="0.1"
                value={productForm.abv}
                onChange={(e) => setProductForm({ ...productForm, abv: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Image URL
            </label>
            <input
              type="text"
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleSaveProduct}
            style={{
              backgroundColor: '#4AB7B6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            {editingProduct ? 'Save Product Changes' : 'Create Product'}
          </button>
        </div>
      </BottomSheet>

      {/* 4. Single Bottom Navigation Bar (No Sidebar, No Seeding Buttons!) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E8F2F2',
        padding: '8px 16px',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 12px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
      }}>
        {[
          { id: 'orders' as AdminNavTab, label: 'Orders', icon: <IconReceipt size={20} />, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined },
          { id: 'products' as AdminNavTab, label: 'Products', icon: <IconBottle size={20} /> },
          { id: 'analytics' as AdminNavTab, label: 'Analytics', icon: <IconTrending size={20} /> },
          { id: 'settings' as AdminNavTab, label: 'Settings', icon: <IconSettings size={20} /> },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                color: isSelected ? '#4AB7B6' : '#94A3B8',
                cursor: 'pointer',
                padding: '6px 12px',
                transition: 'all 120ms ease',
              }}
            >
              <div style={{
                position: 'relative',
                transform: isSelected ? 'scale(1.16)' : 'scale(1)',
                transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                {tab.icon}
                {tab.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    backgroundColor: '#EA7173',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '9px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: isSelected ? 800 : 500,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await adminSignIn(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(
        msg === 'NOT_ADMIN'
          ? 'This account is not an admin of the store.'
          : 'Sign-in failed. Check your email and password.'
      );
    } finally {
      setBusy(false);
    }
  };

  const field: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F4F9F9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      boxSizing: 'border-box',
    }}>
      <form
        onSubmit={submit}
        style={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #E8F2F2',
          boxShadow: '0 8px 24px rgba(74, 183, 182, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AnimatedBottle size={28} color="#4AB7B6" glow />
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#4AB7B6', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
            Lucky<span style={{ color: '#FDAA5D' }}>Admin</span>
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Sign in to manage the store.</p>
        <input
          type="email"
          autoComplete="username"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={field}
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={field}
        />
        {error && (
          <div role="alert" style={{ fontSize: '12px', fontWeight: 600, color: '#EA7173' }}>{error}</div>
        )}
        <button
          type="submit"
          disabled={busy}
          style={{
            padding: '13px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#4AB7B6',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function AuthGate() {
  const [session, setSession] = useState<'loading' | 'in' | 'out'>('loading');

  useEffect(() => subscribeToAdminSession(setSession), []);

  if (session === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F4F9F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatedBottle size={40} color="#4AB7B6" glow />
      </div>
    );
  }
  return session === 'in' ? <HyperMartAdmin /> : <AdminLogin />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthGate />
    </ToastProvider>
  );
}
