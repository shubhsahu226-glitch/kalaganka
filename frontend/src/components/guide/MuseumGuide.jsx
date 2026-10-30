/**
 * Museum Heritage Scroll Guide.
 * 10-exhibit scroll-driven educational narrative introducing KalaGanaka,
 * the astronomical heritage of Maharaja Sawai Jai Singh II, and the physics of the Samrat Yantra.
 */

import React from 'react';
import { ArrowDown, Compass, Sun, Clock, Eye, Sparkles, ChevronRight } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';

export function MuseumGuide() {
  const setActiveAppView = useKalaStore((state) => state.setActiveAppView);
  const openLoupe = useKalaStore((state) => state.openLoupe);

  const exhibits = [
    {
      id: 'exhibit-01',
      badge: 'EXHIBIT 01 · प्रवेश',
      title: 'KalaGanaka · कालगणक',
      subtitle: 'Interactive Indian Timekeeping & Astronomy Lab',
      tagline: 'See Indian time, not just read about it.',
      content: (
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <p className="font-serif text-lg md:text-xl text-heritage-secondary italic leading-relaxed">
            "कालः सृजति भूतानि कालः संहरति प्रजाः"
            <br />
            <span className="text-sm not-italic text-heritage-muted mt-1 block">
              Time creates all beings, and Time sustains them.
            </span>
          </p>
          <div className="gold-divider w-48 my-2" />
          <p className="text-sm md:text-base text-heritage-ink leading-relaxed">
            Welcome to the digital revival of classical Indian observational astronomy.
            Step into the 18th-century stone observatories of Rajasthan and discover how celestial
            geometry turns sunlight into micro-precision timekeeping.
          </p>
          <div className="pt-4 animate-bounce text-heritage-gold flex flex-col items-center gap-1.5">
            <span className="text-xs uppercase tracking-widest font-mono text-heritage-secondary">Scroll to enter</span>
            <ArrowDown size={18} />
          </div>
        </div>
      )
    },
    {
      id: 'exhibit-02',
      badge: 'EXHIBIT 02 · आधार',
      title: 'What is KalaGanaka?',
      subtitle: 'The Three Pillars of Indian Celestial Horology',
      content: (
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="museum-plaque p-6 rounded-xl hover:shadow-heritage-hover transition-all">
            <div className="w-10 h-10 rounded-full bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mb-4">
              <Compass size={22} />
            </div>
            <h4 className="font-serif text-lg font-bold text-heritage-charcoal mb-1">1. देश · Location</h4>
            <p className="text-xs text-heritage-secondary leading-relaxed">
              Every sundial is bound to its terrestrial coordinates. The gnomon’s tilt must match the exact latitude of the observer to mirror Earth’s rotational axis.
            </p>
          </div>

          <div className="museum-plaque p-6 rounded-xl hover:shadow-heritage-hover transition-all">
            <div className="w-10 h-10 rounded-full bg-heritage-gold/15 text-heritage-gold flex items-center justify-center mb-4">
              <Sun size={22} />
            </div>
            <h4 className="font-serif text-lg font-bold text-heritage-charcoal mb-1">2. सूर्य · Sun Position</h4>
            <p className="text-xs text-heritage-secondary leading-relaxed">
              As the Sun moves along the ecliptic, its altitude and azimuth dictate the solar hour angle, driving the true apparent solar day.
            </p>
          </div>

          <div className="museum-plaque p-6 rounded-xl hover:shadow-heritage-hover transition-all">
            <div className="w-10 h-10 rounded-full bg-heritage-charcoal/10 text-heritage-charcoal flex items-center justify-center mb-4">
              <Clock size={22} />
            </div>
            <h4 className="font-serif text-lg font-bold text-heritage-charcoal mb-1">3. छाया · Shadow Time</h4>
            <p className="text-xs text-heritage-secondary leading-relaxed">
              The moving edge of the shadow reads out Local Apparent Solar Time on curved marble scales, resolved into hours, minutes, and traditional Ghatis.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'exhibit-03',
      badge: 'EXHIBIT 03 · इतिहास',
      title: 'Enter Jantar Mantar',
      subtitle: 'The Stone Observatories of Sawai Jai Singh II (1734 CE)',
      content: (
        <div className="max-w-3xl mx-auto text-sm md:text-base text-heritage-ink space-y-4 text-justify">
          <p>
            In the early 18th century, astronomer-king <strong>Maharaja Sawai Jai Singh II</strong> realized that small brass astrolabes and handheld quadrants suffered from mechanical wear, thermal expansion, and human reading error.
          </p>
          <p>
            To achieve absolute astronomical certitude, he constructed monumental masonry instruments (*yantras*) at Jaipur, Delhi, Ujjain, Varanasi, and Mathura. Foremost among them was the <strong>Brihat Samrat Yantra</strong>—the "Supreme Instrument"—standing 27 meters tall in Jaipur.
          </p>
          <div className="p-4 bg-heritage-gold/10 border-l-4 border-heritage-gold rounded-r-lg my-3 font-serif text-heritage-charcoal italic">
            "Large stone instruments do not shake with the wind, nor do their graduations warp with heat. They are eternal mirrors of the heavens."
          </div>
        </div>
      )
    },
    {
      id: 'exhibit-04',
      badge: 'EXHIBIT 04 · यन्त्र परिचय',
      title: 'Meet the Samrat Yantra',
      subtitle: 'The World’s Largest Equinoctial Sundial',
      content: (
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-sm md:text-base text-heritage-ink">
            The Samrat Yantra is an <strong>equinoctial (equatorial) sundial</strong>. Unlike horizontal garden sundials with non-linear hour spacing, an equinoctial sundial has its reading scales parallel to Earth’s equator, resulting in perfectly uniform circular time graduations of <strong>15 degrees per hour</strong>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-heritage-bg border border-heritage-border rounded-lg text-center">
              <span className="text-xs text-heritage-secondary block">Height</span>
              <span className="font-serif font-bold text-base text-heritage-charcoal">27 Meters</span>
            </div>
            <div className="p-3 bg-heritage-bg border border-heritage-border rounded-lg text-center">
              <span className="text-xs text-heritage-secondary block">Quadrant Radius</span>
              <span className="font-serif font-bold text-base text-heritage-charcoal">15.1 Meters</span>
            </div>
            <div className="p-3 bg-heritage-bg border border-heritage-border rounded-lg text-center">
              <span className="text-xs text-heritage-secondary block">Graduation Precision</span>
              <span className="font-serif font-bold text-base text-heritage-charcoal">2 Seconds</span>
            </div>
            <div className="p-3 bg-heritage-bg border border-heritage-border rounded-lg text-center">
              <span className="text-xs text-heritage-secondary block">UNESCO Status</span>
              <span className="font-serif font-bold text-base text-heritage-charcoal">World Heritage</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'exhibit-05',
      badge: 'EXHIBIT 05 · शंकु',
      title: 'The Gnomon',
      subtitle: 'The Shadow-Casting Ramp Aligned with Earth’s Axis',
      content: (
        <div className="max-w-3xl mx-auto space-y-4 text-sm md:text-base text-heritage-ink">
          <p>
            The massive central wall of the Samrat Yantra is called the <strong>Gnomon (शंकु)</strong>.
            Its hypotenuse ramp is aligned strictly on the local North–South meridian line.
          </p>
          <p>
            Crucially, the ramp is tilted above the ground at an angle equal to the <strong>observer’s geographic latitude</strong> ($\approx 26.91^\circ$ at Jaipur). By pointing directly toward the North Celestial Pole (near Polaris), the gnomon edge becomes a physical extension of Earth's rotational axis in space.
          </p>
        </div>
      )
    },
    {
      id: 'exhibit-06',
      badge: 'EXHIBIT 06 · फलक',
      title: 'The Curved Marble Quadrants',
      subtitle: 'Parallel to Earth’s Celestial Equator',
      content: (
        <div className="max-w-3xl mx-auto space-y-4 text-sm md:text-base text-heritage-ink">
          <p>
            Flanking the gnomon to the East and West are two giant arcs of white Makrana marble.
            These arcs are inclined at (90° − latitude) from the ground, placing them strictly <strong>parallel to Earth’s equatorial plane</strong>.
          </p>
          <p>
            Because the Sun appears to revolve uniformly around the celestial equator, its shadow sweeps across the marble quadrants at a constant rate:
            <strong> 1 hour = 15° · 1 minute = 15 arcminutes · 4 seconds = 1 arcminute</strong>.
          </p>
        </div>
      )
    },
    {
      id: 'exhibit-07',
      badge: 'EXHIBIT 07 · छाया गति',
      title: 'The Shadow’s Daily Journey',
      subtitle: 'From Morning Dawn to Twilight Dusk',
      content: (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-heritage-bg border border-heritage-border rounded-xl">
              <span className="text-xs uppercase text-heritage-secondary font-mono">Morning (06:00 – 12:00)</span>
              <h5 className="font-serif font-bold text-lg text-heritage-terracotta mt-1">Eastern Quadrant</h5>
              <p className="text-xs text-heritage-secondary mt-2">Sun rises in the East; shadow falls on the Western face of the gnomon onto the East marble arc.</p>
            </div>
            <div className="p-4 bg-heritage-bg border-2 border-heritage-gold rounded-xl shadow-sm">
              <span className="text-xs uppercase text-heritage-gold-dark font-mono">Solar Noon (12:00)</span>
              <h5 className="font-serif font-bold text-lg text-heritage-charcoal mt-1">Center Noon Line</h5>
              <p className="text-xs text-heritage-secondary mt-2">Sun culminates on the meridian; shadow touches the center base line directly under the gnomon.</p>
            </div>
            <div className="p-4 bg-heritage-bg border border-heritage-border rounded-xl">
              <span className="text-xs uppercase text-heritage-secondary font-mono">Afternoon (12:00 – 18:00)</span>
              <h5 className="font-serif font-bold text-lg text-heritage-terracotta mt-1">Western Quadrant</h5>
              <p className="text-xs text-heritage-secondary mt-2">Sun moves into the Western sky; shadow sweeps up the Western marble arc until sunset.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'exhibit-08',
      badge: 'EXHIBIT 08 · सूक्ष्म मापन',
      title: 'Reading Seconds from Stone',
      subtitle: 'The 6-Second Scale Loupe',
      content: (
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <p className="text-sm md:text-base text-heritage-ink">
            On smaller sundials, reading seconds is impossible due to the soft penumbra of the Sun’s disk. But at Jaipur’s colossal scale, the shadow travels <strong>4 mm every minute</strong>!
          </p>
          <div className="pt-2">
            <button
              onClick={openLoupe}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-heritage-charcoal text-heritage-marble font-medium text-sm hover:bg-heritage-ink transition-colors shadow-md"
            >
              <Eye size={16} /> Open Shadow Reading Loupe (🔍)
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'exhibit-09',
      badge: 'EXHIBIT 09 · समय भेद',
      title: 'Sundial Time vs. Modern Clock Time',
      subtitle: 'Why Doesn’t the Yantra Match My Watch?',
      content: (
        <div className="max-w-3xl mx-auto space-y-4 text-sm md:text-base text-heritage-ink">
          <p>
            Visitors to Jantar Mantar often notice their watches differ from the stone reading by 10 to 40 minutes. This is not an error! It reflects two profound astronomical facts:
          </p>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-heritage-bg border border-heritage-border rounded-lg">
              <h5 className="font-serif font-bold text-heritage-terracotta text-base mb-1">1. Longitude Correction</h5>
              <p className="text-xs text-heritage-secondary leading-relaxed">
                Indian Standard Time (IST) is based on the meridian of Mirzapur ($82.5^\circ$ E). Jaipur is at $75.79^\circ$ E—about $6.7^\circ$ west. Since Earth rotates $1^\circ$ every 4 minutes, Jaipur solar noon occurs $\approx 26.8$ minutes after standard IST noon!
              </p>
            </div>
            <div className="p-4 bg-heritage-bg border border-heritage-border rounded-lg">
              <h5 className="font-serif font-bold text-heritage-gold-dark text-base mb-1">2. Equation of Time (EoT)</h5>
              <p className="text-xs text-heritage-secondary leading-relaxed">
                Because Earth’s orbit around the Sun is elliptical and its axis is tilted by $23.44^\circ$, solar days are not exactly equal throughout the year. The Equation of Time varies from $+16.4$ min to $-14.2$ min.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'exhibit-10',
      badge: 'EXHIBIT 10 · प्रयोग',
      title: 'Enter the Live Simulator',
      subtitle: 'Step into the 3D Astronomical Laboratory',
      content: (
        <div className="max-w-xl mx-auto text-center space-y-6">
          <p className="text-sm md:text-base text-heritage-ink leading-relaxed">
            Ready to explore? Orient the gnomon to your city, scrub through time-lapses, inspect the 6-second scale graduations, and experience the timeless precision of Indian horology.
          </p>
          <button
            onClick={() => setActiveAppView('SIMULATOR')}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-heritage-terracotta text-white font-serif text-lg font-bold hover:bg-heritage-terracottaDark transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Enter Live Simulator <ChevronRight size={20} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="w-full bg-heritage-bg py-16 px-4 md:px-8 space-y-24">
      {exhibits.map((exhibit, index) => (
        <section
          key={exhibit.id}
          id={exhibit.id}
          className="max-w-4xl mx-auto scroll-mt-24 border border-heritage-border/60 bg-heritage-card/60 rounded-2xl p-8 md:p-12 shadow-heritage-card transition-all"
        >
          {/* Exhibit Badge Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-heritage-terracotta font-semibold bg-heritage-terracotta/10 px-3 py-1 rounded-full border border-heritage-terracotta/20 mb-3">
              {exhibit.badge}
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-heritage-charcoal">
              {exhibit.title}
            </h2>
            <h3 className="text-xs md:text-sm text-heritage-secondary mt-1 font-medium">
              {exhibit.subtitle}
            </h3>
            {exhibit.tagline && (
              <p className="text-xs text-heritage-gold font-serif italic mt-2">
                {exhibit.tagline}
              </p>
            )}
            <div className="gold-divider w-32 my-4" />
          </div>

          {/* Exhibit Body Content */}
          <div>{exhibit.content}</div>
        </section>
      ))}
    </div>
  );
}

