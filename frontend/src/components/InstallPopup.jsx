import { useState, useEffect } from 'react';

export default function InstallPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const alreadyInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const wasDismissed = localStorage.getItem('install_dismissed');

    if (alreadyInstalled || wasDismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPopup(true), 1500);
    };

    const installed = () => {
      setShowPopup(false);
      setDeferredPrompt(null);
      localStorage.removeItem('install_dismissed');
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installed);

    if (!deferredPrompt) {
      setTimeout(() => {
        if (!localStorage.getItem('install_dismissed')) {
          setShowPopup(true);
        }
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPopup(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
    setDismissed(true);
    localStorage.setItem('install_dismissed', 'true');
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (!showPopup || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-in">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-center relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
            Phone pe app jaisa chalega. Fast, offline bhi kaam karega!
          </p>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Full screen app jaisa chalega</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Phone pe icon ban jayega</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Load time bohot fast</span>
            </div>
          </div>

          {!isIOS ? (
            <button
              onClick={handleInstall}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-lg transition-colors shadow-lg shadow-orange-500/30"
            >
              Abhi Install Karo
            </button>
          ) : (
            <div className="text-center">
              <button
                onClick={handleDismiss}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-lg transition-colors shadow-lg shadow-orange-500/30"
              >
                samajh gaya
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Safari mein <strong>Share</strong> button dabao → <strong>"Add to Home Screen"</strong> select karo
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Abhi nahi, baad mein
        </button>
      </div>
    </div>
  );
}