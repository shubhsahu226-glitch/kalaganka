/**
 * Comprehensive Educational Info Modal ("What is the Samrat Yantra?").
 * Features 3 interactive tabs:
 * 1. What is it? (History & Monumental Architecture)
 * 2. How does it work? (Equinoctial Sundial Mechanics)
 * 3. Why is it different from my clock? (Longitude & Equation of Time)
 */

import React from 'react';
import { X, BookOpen, Compass, Clock, HelpCircle } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';

export function InfoModal() {
  const isInfoModalOpen = useKalaStore((state) => state.isInfoModalOpen);
  const closeInfoModal = useKalaStore((state) => state.closeInfoModal);
  const infoModalTab = useKalaStore((state) => state.infoModalTab);
  const setInfoModalTab = useKalaStore((state) => state.setInfoModalTab);

  if (!isInfoModalOpen) return null;

  const tabs = [
    { label: 'What is it?', icon: BookOpen },
    { label: 'How does it work?', icon: Compass },
    { label: 'Why does it differ from clocks?', icon: Clock }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-charcoal/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-heritage-card border-2 border-heritage-border rounded-2xl shadow-2xl max-w-3xl w-full p-6 md:p-8 relative flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-heritage-border pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-heritage-charcoal">
              What is the Samrat Yantra? · सम्राट यन्त्र
            </h3>
            <p className="text-xs text-heritage-secondary mt-0.5">
              The Supreme Astronomical Instrument of Jantar Mantar
            </p>
          </div>
          <button
            onClick={closeInfoModal}
            className="p-1.5 rounded-lg text-heritage-secondary hover:text-heritage-charcoal hover:bg-heritage-darkBorder/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-heritage-border mt-4">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = infoModalTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setInfoModalTab(idx)}
                className={`flex-1 py-3 px-2 text-xs md:text-sm font-serif font-semibold border-b-2 flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'border-heritage-terracotta text-heritage-terracotta bg-heritage-bg/50'
                    : 'border-transparent text-heritage-secondary hover:text-heritage-charcoal'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="overflow-y-auto py-5 pr-2 space-y-4 text-sm text-heritage-ink leading-relaxed">
          {infoModalTab === 0 && (
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-heritage-charcoal">
                Monumental Astronomy of Maharaja Sawai Jai Singh II
              </h4>
              <p>
                The <strong>Brihat Samrat Yantra</strong> ("Supreme Instrument") was constructed in 1734 CE in Jaipur, Rajasthan. It is the crowning jewel of the Jantar Mantar observatory, a UNESCO World Heritage site.
              </p>
              <p>
                Sawai Jai Singh II determined that portable brass instruments (such as astrolabes and armillary spheres) suffered from small scale, flexing, and atmospheric corrosion. By scaling up the instrument in red sandstone and white marble to a colossal 27 meters (90 feet) in height, he achieved unprecedented reading precision: <strong>2 seconds of time</strong>.
              </p>
              <div className="p-4 bg-heritage-bg border border-heritage-border rounded-xl">
                <h5 className="font-serif font-bold text-heritage-terracotta text-base mb-1">Architectural Anatomy</h5>
                <ul className="list-disc list-inside space-y-1 text-xs text-heritage-secondary">
                  <li><strong>Gnomon (शंकु):</strong> A 27-meter tall triangular sandstone ramp inclined at the local latitude (26.91°).</li>
                  <li><strong>Central Staircase:</strong> 166 steps leading up the hypotenuse to the top chhatri.</li>
                  <li><strong>Top Chhatri (छतरी):</strong> Octagonal cupola used for determining weather, monsoons, and celestial eclipses.</li>
                  <li><strong>Quadrants (फलक):</strong> Twin curved arcs of white Makrana marble with fine hour, minute, and second graduations.</li>
                </ul>
              </div>
            </div>
          )}

          {infoModalTab === 1 && (
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-heritage-charcoal">
                The Geometry of an Equinoctial Sundial
              </h4>
              <p>
                Most garden sundials are horizontal or vertical, which causes hour markings to be unevenly spaced and require complex trigonometric trigonometry to engrave.
              </p>
              <p>
                The Samrat Yantra is an <strong>equinoctial sundial</strong>. Its design aligns with celestial geometry in two ways:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm pl-2">
                <li>
                  <strong>Gnomon inclined at observer latitude:</strong> This ensures the shadow-casting edge is exactly parallel to Earth’s rotational axis and points to the North Celestial Pole (Polaris).
                </li>
                <li>
                  <strong>Curved quadrant scales parallel to the Equator:</strong> The marble quadrants are tilted at (90° − latitude) from the ground. Because Earth spins at a constant 360° per 24 hours, the Sun's shadow moves across these circular arcs at a completely uniform rate: <strong>15° every hour (1° every 4 minutes)</strong>.
                </li>
              </ol>
              <div className="p-3 bg-heritage-gold/10 border-l-4 border-heritage-gold rounded-r-lg text-xs italic">
                Morning shadow falls on the Eastern quadrant; at solar noon it touches the center noon line; afternoon shadow sweeps across the Western quadrant.
              </div>
            </div>
          )}

          {infoModalTab === 2 && (
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-heritage-charcoal">
                Why Doesn’t the Sundial Match Modern Civil Clocks?
              </h4>
              <p>
                The Samrat Yantra reads <strong>Local Apparent Solar Time</strong>. Your phone and wristwatch display <strong>Standard Civil Clock Time</strong> (such as Indian Standard Time - IST). The two differ by two scientific factors:
              </p>
              <div className="space-y-3">
                <div className="p-3.5 bg-heritage-bg border border-heritage-border rounded-xl">
                  <h5 className="font-serif font-bold text-heritage-terracotta text-sm mb-1">
                    1. Longitude Offset (देशान्तर संस्कार)
                  </h5>
                  <p className="text-xs text-heritage-secondary leading-relaxed">
                    Civil time is uniform across an entire timezone. IST is based on the meridian of Mirzapur at $82.5^\circ$ E. At Jaipur ($75.79^\circ$ E), the Sun crosses the meridian roughly <strong>26.8 minutes later</strong> than standard noon.
                  </p>
                </div>
                <div className="p-3.5 bg-heritage-bg border border-heritage-border rounded-xl">
                  <h5 className="font-serif font-bold text-heritage-gold-dark text-sm mb-1">
                    2. The Equation of Time (समय समीकरण)
                  </h5>
                  <p className="text-xs text-heritage-secondary leading-relaxed">
                    Earth's orbit around the Sun is slightly elliptical (eccentricity $\approx 0.0167$) and its rotational axis is tilted ($23.44^\circ$). As a result, apparent solar days vary in length throughout the seasons. The Equation of Time can add up to <strong>+16.4 minutes</strong> in November or subtract <strong>-14.2 minutes</strong> in February.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-heritage-border pt-4 flex justify-end">
          <button
            onClick={closeInfoModal}
            className="px-5 py-2 rounded-lg bg-heritage-charcoal text-heritage-marble font-medium text-xs hover:bg-heritage-ink transition-colors shadow"
          >
            Close Plaque
          </button>
        </div>
      </div>
    </div>
  );
}

