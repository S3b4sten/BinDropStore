
import React from 'react';

interface NavbarProps {
  onSellClick: () => void;
  onCartClick: () => void;
  onTransactionsClick: () => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onSellClick, onCartClick, onTransactionsClick, cartCount }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="bg-[#062e1e] p-2 rounded-lg text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-[#062e1e]">BINDROP</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onTransactionsClick}
            className="hidden md:flex text-[#062e1e] px-4 py-2 rounded-full font-bold text-sm hover:bg-emerald-50 transition-all items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Mes Achats</span>
          </button>

          <button 
            onClick={onSellClick}
            className="hidden sm:flex bg-[#ecfdf5] text-[#062e1e] px-5 py-2.5 rounded-full font-bold hover:bg-emerald-100 transition-all items-center gap-2 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Vendre</span>
          </button>

          <button 
            onClick={onCartClick}
            className="bg-[#062e1e] text-white p-2.5 rounded-full font-bold hover:bg-emerald-900 transition-all flex items-center justify-center relative shadow-lg active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-400 text-[#062e1e] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
