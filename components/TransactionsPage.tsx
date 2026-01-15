
import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils';

interface TransactionsPageProps {
  transactions: Transaction[];
  onBackToShop: () => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onBackToShop }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter text-[#062e1e]">MES ACHATS</h2>
          <p className="text-gray-500 font-medium">Historique de vos contributions à l'économie circulaire.</p>
        </div>
        <button 
          onClick={onBackToShop}
          className="bg-emerald-50 text-[#062e1e] px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la boutique
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-20 text-center shadow-sm">
          <div className="bg-[#ecfdf5] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#062e1e]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune transaction pour le moment</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Vos futurs achats éco-responsables apparaîtront ici une fois confirmés.</p>
          <button 
            onClick={onBackToShop}
            className="bg-[#062e1e] text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Commencer mon shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-100">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Date de commande</span>
                    <span className="font-bold text-[#062e1e]">{new Date(tx.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">ID Commande</span>
                    <span className="font-mono text-xs text-emerald-600">#{tx.id.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Total Payé</span>
                    <span className="text-xl font-black text-[#062e1e]">{formatCurrency(tx.total)}</span>
                  </div>
                  <div className="bg-[#062e1e] text-[#ecfdf5] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    Eco-Impact +{tx.items.length * 5} pts
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tx.items.map((item, idx) => (
                    <div key={`${tx.id}-${idx}`} className="flex items-center gap-4 group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-700">{formatCurrency(item.currentPriceAtAddition)}</span>
                          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
