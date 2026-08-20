import { useState, useEffect, useCallback } from 'react';

export default function InstallPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const alreadyInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (alreadyInstalled) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setReady(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setShowPopup(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-6 text-center relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-lg"
          >
            ✕
          </button>
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-black text-orange-500">AD</span>
          </div>
          <h2 className="text-white text-xl font-bold">Apni Dukaan</h2>
          <p className="text-orange-100 text-sm mt-1">Halal Meat & Grocery Store</p>
        </div>

        <div className="p-6">
          <h3 className="text-gray-900 text-lg font-bold text-center mb-2">App Install Karo!</h3>
          <p className="text-gray-500 text-sm text-center mb-5">
            Phone pe app jaisa chalega. Fast aur offline bhi kaam karega!
          </p>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600 font-bold text-sm">✓</div>
              <span className="text-sm text-gray-600">Full screen app jaisa chalega</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600 font-bold text-sm">✓</div>
              <span className="text-sm text-gray-600">Phone pe icon ban jayega</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600 font-bold text-sm">✓</div>
              <span className="text-sm text-gray-600">Bohot fast load hoga</span>
            </div>
          </div>

          {ready ? (
            <button
              onClick={handleInstall}
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg"
            >
              Abhi Install Karo
            </button>
          ) : (
            <div className="text-center">
              <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-xl p-4 mb-3">
                <p className="text-orange-700 font-bold text-sm mb-1">Manual Install Karo:</p>
                <p className="text-gray-600 text-sm">Chrome mein <strong>3 dots (⋮)</strong> dabao → <strong>"Install App"</strong> ya <strong>"Add to Home Screen"</strong> select karo</p>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 rounded-xl transition-colors"
              >
                Samajh gaya
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors border-t"
        >
          Baad mein
        </button>
      </div>
    </div>
  );
}