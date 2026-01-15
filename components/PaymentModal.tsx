
import React, { useState } from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils';

interface PaymentModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onConfirmPayment: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ items, total, onClose, onConfirmPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmPayment();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#062e1e]/90 backdrop-blur-md flex items-start justify-center overflow-y-auto p-0 md:p-6 lg:p-10">
      <div className="absolute inset-0 z-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-6xl h-auto min-h-full md:min-h-0 bg-white md:rounded-[3rem] border-4 border-[#062e1e] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-in zoom-in-95 duration-300 my-auto">
        
        {/* Panneau Récapitulatif - Défilement interne si nécessaire */}
        <aside className="w-full lg:w-5/12 bg-emerald-50 p-8 lg:p-12 border-b-4 lg:border-b-0 lg:border-r-4 border-[#062e1e] flex flex-col">
          <div className="mb-10">
            <div className="bg-[#062e1e] text-white inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Panier Sécurisé
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter text-[#062e1e]">RÉCAPITULATIF</h2>
          </div>

          <div className="space-y-4 mb-10 overflow-y-auto max-h-[400px] lg:max-h-none pr-2 custom-scrollbar">
            {items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-4 p-5 bg-white border-4 border-[#062e1e] rounded-3xl bento-shadow">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#062e1e] bg-gray-50">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-black text-[#062e1e] line-clamp-1 uppercase tracking-tight">{item.name}</p>
                  <p className="text-xl font-black text-[#10b981]">{formatCurrency(item.currentPriceAtAddition)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-6 pt-10 border-t-4 border-[#062e1e]">
            <div className="flex justify-between items-end text-[#062e1e]">
              <span className="text-xs font-black uppercase tracking-widest mb-1">Total à régler</span>
              <span className="text-5xl font-black tabular-nums leading-none">{formatCurrency(total)}</span>
            </div>
            <div className="bg-[#062e1e] text-[#10b981] p-6 rounded-3xl flex items-center gap-4 border-2 border-[#062e1e]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-black uppercase tracking-widest leading-tight">Paiement 100% sécurisé et protection</span>
            </div>
          </div>
        </aside>

        {/* Panneau Paiement - Formulaire avec défilement fluide */}
        <div className="w-full lg:w-7/12 p-8 lg:p-12 flex flex-col">
          <div className="mb-10">
            <h3 className="text-xs font-black text-[#10b981] uppercase tracking-[0.3em] mb-2 text-center lg:text-left">Transaction Éco</h3>
            <h2 className="text-4xl font-black italic tracking-tighter text-[#062e1e] text-center lg:text-left">INFOS PAIEMENT</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {['card', 'paypal', 'apple'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method as any)}
                className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === method 
                  ? 'bg-[#062e1e] text-white border-[#062e1e] shadow-[0_6px_0_0_#10b981]' 
                  : 'bg-white text-gray-400 border-gray-200 hover:border-[#062e1e] hover:text-[#062e1e]'
                }`}
              >
                <div className="text-xl font-black uppercase tracking-tighter">{method === 'card' ? 'CARTE' : method}</div>
              </button>
            ))}
          </div>

          {paymentMethod === 'card' ? (
            <form onSubmit={handlePayment} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Nom sur la carte</label>
                  <input 
                    type="text" 
                    placeholder="MARC DUPONT"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value.toUpperCase()})}
                    className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-black text-xl"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Numéro de carte</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-black text-2xl tracking-[0.2em]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Échéance</label>
                    <input 
                      type="text" 
                      placeholder="MM / AA"
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-black text-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      maxLength={3}
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                      className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-black text-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Les boutons d'action sont placés à la fin du flux du formulaire */}
              <div className="flex flex-col gap-4 pt-10 pb-6 lg:pb-0">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-8 bg-[#10b981] text-[#062e1e] rounded-[2.5rem] font-black uppercase text-2xl tracking-[0.1em] border-4 border-[#062e1e] shadow-[0_8px_0_0_#062e1e] hover:shadow-none hover:translate-y-2 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {isProcessing ? (
                    <div className="w-10 h-10 border-4 border-[#062e1e] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>CONFIRMER LE PAIEMENT</>
                  )}
                </button>
                
                {/* Le bouton annuler est ici, tout en bas */}
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full py-6 bg-white text-red-600 rounded-[2.5rem] font-black uppercase text-base tracking-widest border-4 border-red-600 hover:bg-red-50 transition-all active:scale-95"
                >
                  ANNULER LA TRANSACTION
                </button>
              </div>
            </form>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-gray-50 border-4 border-dashed border-[#062e1e] rounded-[3rem] space-y-8">
               <h4 className="text-4xl font-black text-[#062e1e] uppercase italic">REDIRECTION...</h4>
               <p className="font-bold text-gray-500 max-w-sm leading-relaxed text-lg">Transaction sécurisée via {paymentMethod.toUpperCase()}.</p>
               <button onClick={handlePayment} className="w-full py-8 bg-[#062e1e] text-white rounded-[2.5rem] font-black uppercase text-xl shadow-2xl hover:scale-105 transition-transform border-4 border-[#062e1e]">CONTINUER VERS {paymentMethod.toUpperCase()}</button>
               <button 
                  type="button"
                  onClick={onClose}
                  className="w-full py-6 bg-white text-red-600 rounded-[2.5rem] font-black uppercase text-base tracking-widest border-4 border-red-600 hover:bg-red-50 transition-all active:scale-95"
                >
                  ANNULER ET RETOURNER
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
