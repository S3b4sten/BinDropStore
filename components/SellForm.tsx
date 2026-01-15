
import React, { useState, useRef, useEffect } from 'react';
import { getAIListingHelp } from '../services/geminiService';
import { Product } from '../types';

interface SellFormProps {
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const SellForm: React.FC<SellFormProps> = ({ onClose, onAddProduct }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Camera/Upload, 2: AI Analyzing, 3: Edit/Confirm
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [details, setDetails] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    seller: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/jpeg');
        setImageBase64(data);
        stopCamera();
        handleAIAnalysis(data);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result as string;
        setImageBase64(data);
        handleAIAnalysis(data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalysis = async (imgData: string) => {
    setStep(2);
    setLoading(true);
    try {
      const suggestion = await getAIListingHelp(imgData);
      setDetails({
        name: suggestion.name,
        price: suggestion.suggestedPrice,
        description: suggestion.description,
        category: suggestion.category,
        seller: ''
      });
      setStep(3);
    } catch (error) {
      console.error(error);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: details.name,
      imageUrl: imageBase64 || 'https://picsum.photos/400/400',
      originalPrice: details.price,
      description: details.description,
      category: details.category,
      createdAt: new Date().toISOString(),
      sellerName: details.seller || 'Anonyme'
    };
    onAddProduct(newProduct);
    onClose();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-0 md:p-10">
      <div className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl bg-white md:rounded-[3rem] border-4 border-[#062e1e] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-500">
        
        {/* Header - No persistent close button here */}
        <div className="p-8 border-b-4 border-[#062e1e] flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter text-[#062e1e]">MISE EN VENTE</h2>
            <p className="text-xs text-[#10b981] font-black uppercase tracking-[0.2em]">
              {step === 1 ? "ÉTAPE 1: CAPTURE" : step === 2 ? "ANALYSE ÉCO-IA..." : "ÉTAPE 2: INFOS & PRIX"}
            </p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar">
          {step === 1 && (
            <div className="flex flex-col h-full bg-black relative min-h-[500px]">
              <div className="relative flex-grow flex items-center justify-center bg-black overflow-hidden aspect-[3/4]">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    <p className="text-xl font-black mb-8">DÉMARRAGE DE LA CAMÉRA...</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#10b981] text-[#062e1e] border-2 border-[#062e1e] px-10 py-5 rounded-2xl font-black text-lg uppercase shadow-[0_4px_0_0_#062e1e]"
                    >
                      TÉLÉVERSER UNE PHOTO
                    </button>
                  </div>
                )}
                
                <div className="absolute inset-8 border-4 border-white/20 rounded-[3rem] pointer-events-none flex items-center justify-center">
                   <div className="w-20 h-20 border-t-4 border-l-4 border-[#10b981] absolute top-0 left-0 rounded-tl-[3rem]"></div>
                   <div className="w-20 h-20 border-t-4 border-r-4 border-[#10b981] absolute top-0 right-0 rounded-tr-[3rem]"></div>
                   <div className="w-20 h-20 border-b-4 border-l-4 border-[#10b981] absolute bottom-0 left-0 rounded-bl-[3rem]"></div>
                   <div className="w-20 h-20 border-b-4 border-r-4 border-[#10b981] absolute bottom-0 right-0 rounded-br-[3rem]"></div>
                </div>
              </div>

              <div className="p-10 bg-white flex items-center justify-around border-t-4 border-[#062e1e] relative z-10">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 bg-emerald-50 rounded-3xl border-2 border-[#062e1e] hover:bg-emerald-100 transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#062e1e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>

                <button 
                  onClick={capturePhoto}
                  disabled={!isCameraActive}
                  className="w-24 h-24 bg-[#062e1e] rounded-full flex items-center justify-center border-4 border-[#10b981] shadow-2xl active:scale-90 transition-transform disabled:bg-gray-200"
                >
                  <div className="w-16 h-16 bg-[#10b981] rounded-full border-4 border-[#062e1e]"></div>
                </button>

                <button 
                  onClick={onClose}
                  className="p-5 bg-red-50 rounded-3xl border-2 border-red-600 hover:bg-red-100 transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-32 px-10 text-center space-y-10">
              <div className="relative">
                <div className="w-32 h-32 border-8 border-emerald-100 border-t-[#062e1e] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-[#10b981] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-black italic tracking-tight text-[#062e1e] mb-4">ANALYSE EN COURS...</h3>
                <p className="text-lg text-gray-500 max-w-sm mx-auto font-bold uppercase tracking-widest">L'IA identifie votre objet pour un prix optimal.</p>
              </div>
              
              {imageBase64 && (
                <div className="w-56 h-56 rounded-[3rem] overflow-hidden border-8 border-emerald-50 shadow-2xl rotate-3">
                  <img src={imageBase64} alt="Captured" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="p-10 space-y-10 animate-in slide-in-from-right duration-500">
               <div className="flex items-center gap-6 bg-emerald-50 p-8 rounded-[2.5rem] border-4 border-[#062e1e] bento-shadow">
                <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img src={imageBase64 || ''} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#062e1e] leading-tight mb-2 uppercase">{details.name || "Nouveau"}</h4>
                  <span className="bg-[#10b981] text-[#062e1e] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 border-[#062e1e] inline-block">
                    {details.category}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Prix de revente (€)</label>
                    <input 
                      type="number" 
                      value={details.price}
                      onChange={(e) => setDetails({...details, price: Number(e.target.value)})}
                      className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-black text-2xl text-[#062e1e]"
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="block text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Catégorie</label>
                      <input 
                        type="text" 
                        value={details.category}
                        onChange={(e) => setDetails({...details, category: e.target.value})}
                        className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-black text-xl text-[#062e1e]"
                      />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Titre de l'objet</label>
                  <input 
                    type="text" 
                    value={details.name}
                    onChange={(e) => setDetails({...details, name: e.target.value})}
                    className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-black text-xl text-[#062e1e]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Description Éco-responsable</label>
                  <textarea 
                    rows={4}
                    value={details.description}
                    onChange={(e) => setDetails({...details, description: e.target.value})}
                    className="w-full px-8 py-6 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-bold text-lg leading-relaxed text-[#062e1e]"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-[#062e1e] uppercase tracking-widest ml-2">Nom du vendeur / Boutique</label>
                  <input 
                    type="text" 
                    value={details.seller}
                    onChange={(e) => setDetails({...details, seller: e.target.value})}
                    placeholder="Vendeur Anonyme"
                    className="w-full px-8 py-5 rounded-[2rem] border-4 border-[#062e1e] bg-white focus:ring-8 focus:ring-emerald-500/10 outline-none font-black text-xl text-[#062e1e]"
                  />
                </div>

                <div className="flex flex-col gap-4 pt-10 pb-10">
                  <button 
                    type="submit"
                    className="w-full py-8 bg-[#10b981] text-[#062e1e] rounded-[2.5rem] font-black uppercase text-xl tracking-[0.2em] border-4 border-[#062e1e] shadow-[0_8px_0_0_#062e1e] hover:shadow-none hover:translate-y-2 transition-all active:scale-95"
                  >
                    LANCER LA VENTE ÉCO
                  </button>
                  
                  {/* Cancel button relocated here, not accessible at all times */}
                  <button 
                    type="button"
                    onClick={onClose}
                    className="w-full py-6 bg-white text-red-600 rounded-[2.5rem] font-black uppercase text-base tracking-widest border-4 border-red-600 hover:bg-red-50 transition-all"
                  >
                    ANNULER ET FERMER
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellForm;
