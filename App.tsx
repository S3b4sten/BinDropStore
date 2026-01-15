
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import SellForm from './components/SellForm';
import CartDrawer from './components/CartDrawer';
import TransactionsPage from './components/TransactionsPage';
import PaymentModal from './components/PaymentModal';
import { Product, CartItem, Transaction } from './types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Retour client, emballage légèrement ouvert mais produit comme neuf. Qualité sonore exceptionnelle garantie.',
    originalPrice: 249,
    category: 'High-Tech',
    imageUrl: 'https://picsum.photos/id/2/800/800',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Boutique Alpha'
  },
  {
    id: '2',
    name: 'Robot Pâtissier KitchenAid',
    description: 'Modèle d\'exposition, parfait état de marche. Idéal pour pâtissiers amateurs et professionnels.',
    originalPrice: 499,
    category: 'Cuisine',
    imageUrl: 'https://picsum.photos/id/11/800/800',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'Chef Corner'
  },
  {
    id: '3',
    name: 'Tapis de Yoga Pro',
    description: 'Épais et antidérapant. Emballage carton abîmé lors de la livraison, produit intact.',
    originalPrice: 85,
    category: 'Sport',
    imageUrl: 'https://picsum.photos/id/33/800/800',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    sellerName: 'FitLife Store'
  },
  {
    id: '4',
    name: 'Lego Star Wars Millenium Falcon',
    description: 'Scellés intacts, petite griffure sur la boîte. Un classique pour tous les collectionneurs.',
    originalPrice: 160,
    category: 'Jeux',
    imageUrl: 'https://picsum.photos/id/44/800/800',
    createdAt: new Date().toISOString(),
    sellerName: 'Toy Palace'
  }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'transactions'>('home');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  const addProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  const addToCart = (product: Product, currentPrice: number) => {
    const newItem: CartItem = {
      ...product,
      currentPriceAtAddition: currentPrice
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirmed = () => {
    const total = cart.reduce((sum, item) => sum + item.currentPriceAtAddition, 0);
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      items: [...cart],
      total: total
    };
    setTransactions([newTx, ...transactions]);
    setCart([]);
    setIsPaymentModalOpen(false);
    setCurrentPage('transactions');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#062e1e] font-sans selection:bg-[#10b981] selection:text-white">
      <Navbar 
        onSellClick={() => setIsSellModalOpen(true)} 
        onCartClick={() => setIsCartOpen(true)}
        onTransactionsClick={() => setCurrentPage('transactions')}
        cartCount={cart.length}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {currentPage === 'home' ? (
          <>
            {/* Hero Section Bento Style - Ajustée */}
            <section className="mb-20 bg-[#062e1e] text-white p-10 md:p-16 lg:p-20 rounded-[3rem] border-4 border-[#062e1e] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-12 shadow-[0_12px_0_0_#10b981]">
              <div className="relative z-10 w-full md:w-3/5 text-left">
                <div className="bg-[#10b981] text-[#062e1e] inline-block px-6 py-2 rounded-xl text-sm font-black uppercase tracking-[0.2em] mb-8 border-2 border-[#062e1e]">
                  Économie Circulaire
                </div>
                <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none mb-8 uppercase">
                  LE PRIX CHUTE <br/> CHAQUE <span className="text-[#10b981] underline decoration-8 underline-offset-8">MATIN</span>
                </h2>
                <p className="text-white text-xl md:text-2xl font-bold mb-10 max-w-xl leading-relaxed opacity-90">
                  Le prix baisse de 1/7ème par jour jusqu'à trouver un acheteur. Craquerez-vous aujourd'hui ?
                </p>
                <div className="flex flex-wrap gap-6">
                  <button 
                    onClick={() => setIsSellModalOpen(true)}
                    className="bg-[#10b981] text-[#062e1e] px-10 py-5 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-white transition-all border-4 border-[#062e1e] shadow-[0_6px_0_0_#062e1e] active:shadow-none active:translate-y-1"
                  >
                    Vendre un objet
                  </button>
                </div>
              </div>
              
              <div className="w-full md:w-2/5 flex items-center justify-center lg:justify-end">
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 backdrop-blur-3xl rounded-[4rem] border-4 border-white/30 flex flex-col items-center justify-center text-center p-10 transform rotate-3 shadow-2xl">
                   <div className="text-7xl font-black text-[#10b981] leading-none mb-4">-85%</div>
                   <div className="text-sm font-black uppercase tracking-[0.3em] text-white">REMISE FINALE</div>
                </div>
              </div>
            </section>

            {/* Barre de Filtres */}
            <div className="flex items-center gap-6 mb-16 overflow-x-auto pb-6 no-scrollbar">
              <span className="text-sm font-black text-[#062e1e] uppercase tracking-widest bg-emerald-100 px-5 py-3 rounded-2xl border-2 border-[#062e1e]">Catégories:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-10 py-4 rounded-2xl text-base font-black transition-all border-2 ${
                    filter === cat 
                    ? 'bg-[#062e1e] text-white border-[#062e1e] shadow-[0_4px_0_0_#10b981]' 
                    : 'bg-white border-gray-200 text-[#062e1e] hover:border-[#062e1e]'
                  }`}
                >
                  {cat === 'All' ? 'TOUT VOIR' : cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Grille Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </>
        ) : (
          <TransactionsPage 
            transactions={transactions} 
            onBackToShop={() => setCurrentPage('home')} 
          />
        )}
      </main>

      <footer className="mt-32 border-t-4 border-[#062e1e] py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black italic tracking-tighter text-[#062e1e] mb-4">BINDROP</h1>
            <p className="text-gray-500 font-black uppercase text-sm tracking-widest">L'économie circulaire, radicale et équitable.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <a href="#" className="text-sm font-black uppercase tracking-widest text-[#062e1e] hover:underline decoration-2">Conditions</a>
            <a href="#" className="text-sm font-black uppercase tracking-widest text-[#062e1e] hover:underline decoration-2">Support</a>
            <a href="#" className="text-sm font-black uppercase tracking-widest text-[#062e1e] hover:underline decoration-2">FAQ</a>
          </div>
        </div>
      </footer>

      {isSellModalOpen && (
        <SellForm 
          onClose={() => setIsSellModalOpen(false)} 
          onAddProduct={addProduct} 
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onRemoveItem={(id) => setCart(cart.filter(i => i.id !== id))}
        onCheckout={handleCheckout}
      />

      {isPaymentModalOpen && (
        <PaymentModal 
          items={cart}
          total={cart.reduce((sum, item) => sum + item.currentPriceAtAddition, 0)}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirmPayment={handlePaymentConfirmed}
        />
      )}
    </div>
  );
};

export default App;
