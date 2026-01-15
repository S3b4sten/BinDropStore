
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { calculateCurrentPrice, formatCurrency, getDayCount } from '../utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, currentPrice: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [currentPrice, setCurrentPrice] = useState(calculateCurrentPrice(product.originalPrice, product.createdAt));
  const day = getDayCount(product.createdAt);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(calculateCurrentPrice(product.originalPrice, product.createdAt));
    }, 60000);
    return () => clearInterval(timer);
  }, [product]);

  const discountPercent = Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100);

  return (
    <article className="group bg-white rounded-3xl border-2 border-[#062e1e] overflow-hidden flex flex-col h-full bento-shadow bento-shadow-hover transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100 border-b-2 border-[#062e1e]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white border-2 border-[#062e1e] px-4 py-2 rounded-full text-base font-black text-[#062e1e] shadow-sm">
          JOUR {day}
        </div>
        {discountPercent > 0 && (
          <div className="absolute bottom-4 left-4 bg-[#10b981] text-[#062e1e] border-2 border-[#062e1e] px-5 py-3 rounded-2xl text-xl font-black uppercase tracking-widest shadow-lg">
            -{discountPercent}%
          </div>
        )}
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="inline-block bg-emerald-50 text-[#062e1e] border-2 border-emerald-200 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-tighter">
            {product.category}
          </span>
        </div>
        <h3 className="text-2xl font-black text-[#062e1e] mb-4 leading-tight line-clamp-2">{product.name}</h3>
        <p className="text-gray-700 text-base font-medium mb-8 line-clamp-3 flex-grow leading-relaxed">
          {product.description}
        </p>
        
        <div className="bg-emerald-50/50 border-2 border-dashed border-[#10b981] rounded-3xl p-5 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 line-through text-lg font-bold">{formatCurrency(product.originalPrice)}</span>
            <div className="text-right">
              <span className="block text-xs text-[#10b981] font-black uppercase mb-1 tracking-widest">PRIX DU JOUR</span>
              <span className="text-4xl font-black text-[#062e1e] tabular-nums">{formatCurrency(currentPrice)}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => onAddToCart(product, currentPrice)}
          aria-label={`Ajouter ${product.name} au panier`}
          className="w-full py-5 bg-[#062e1e] text-white rounded-[2rem] font-black uppercase text-base tracking-widest hover:bg-[#0c4a31] active:translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-[#062e1e]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          AJOUTER AU PANIER
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
