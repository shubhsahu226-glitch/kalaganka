
/**
 * KalaGanaka Root Application Component.
 * Integrates Museum Guide, Live 3D Simulator, Solar Positioning Hooks,
 * and Heritage Modals.
 */

import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { MuseumGuide } from './components/guide/MuseumGuide';
import { SimulatorView } from './components/layout/SimulatorView';
import { ShadowReadingLoupe } from './components/loupe/ShadowReadingLoupe';
import { InfoModal } from './components/info/InfoModal';
import { useSolarPosition } from './hooks/useSolarPosition';
import { useLiveClock } from './hooks/useLiveClock';
import { useKalaStore } from './store/useKalaStore';

export default function App() {
  // Activate automatic solar calculation hook with debouncing
  useSolarPosition();

  // Activate live clock simulation ticker
  useLiveClock();

  const activeAppView = useKalaStore((state) => state.activeAppView);

  return (
    <div className="min-h-screen flex flex-col bg-heritage-bg text-heritage-ink font-sans selection:bg-heritage-gold/25 selection:text-heritage-charcoal">
      {/* Top Museum Navigation Header */}
      <Header />

      {/* Main View: Museum Guide vs 3D Simulator */}
      <main className="flex-1 flex flex-col">
        {activeAppView === 'GUIDE' ? (
          <MuseumGuide />
        ) : (
          <SimulatorView />
        )}
      </main>

      {/* Global Modals */}
      <ShadowReadingLoupe />
      <InfoModal />
    </div>
  );
}

