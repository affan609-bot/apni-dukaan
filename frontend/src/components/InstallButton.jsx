import { useState, useEffect } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    const installed = () => {
      setIsInstalled(true);
      setShowInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installed);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:bottom-6 md:w-72">
      <div className="bg-navy-900 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-orange-500/30">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">Apni Dukaan Install Karo</p>
          <p className="text-xs text-gray-300">Phone pe app jaisa chalega</p>
        </div>
        <button
          onClick={handleInstall}
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
        >
          Install
        </button>
      </div>
    </div>
  );
}