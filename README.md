# KalaGanaka (कालगणक)

KalaGanaka is an interactive Indian timekeeping and astronomy lab that brings the Samrat Yantra of Jantar Mantar into a realistic 3D web simulator. Users select their exact location, date, and time; the app calculates the Sun’s position and casts a physically accurate shadow on the Yantra. The shadow is read as local solar time and compared with modern clock time, clearly explaining the difference. A Museum Heritage scroll guide helps learners understand the gnomon, quadrants, latitude alignment, and shadow movement. A Shadow Reading Loupe lets users inspect the quadrant scale at hour, minute, and second-level precision. Future modules will add a Kala Clock and Tithi Calculator, making KalaGanaka a complete platform for traditional Indian astronomy


### *Interactive Indian Timekeeping & Astronomy Lab*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20(JavaScript)-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20%2F%20R3F-black?logo=threedotjs)](https://threejs.org/)
[![astronomy-engine](https://img.shields.io/badge/Astronomy-astronomy--engine-orange)](https://github.com/cosinekitty/astronomy)
[![Design](https://img.shields.io/badge/Design-Museum%20Heritage-C45138)](#design-system--aesthetics)

---

## 🏛️ Project Overview

**KalaGanaka** (*The Time Reckoner*) is an interactive digital twin and educational astronomy laboratory celebrating ancient Indian celestial science and horology through modern web technologies.

The inaugural module is the **Samrat Yantra Live Solar-Time Simulator**: a physically authentic, 3D architectural digital twin of the supreme equinoctial sundial (**Brihat Samrat Yantra**) erected in 1734 CE by **Maharaja Sawai Jai Singh II** at Jantar Mantar, Jaipur (a UNESCO World Heritage site).

### Key Capabilities
- **Global Latitude Dynamic Gnomon**: The 3D gnomon inclination dynamically matches any observer's latitude worldwide, illustrating how equinoctial sundials must be tailored to their location.
- **Physical 3D Shadow Casting**: Calculates the exact topocentric solar altitude and azimuth using high-precision astronomical algorithms (`astronomy-engine`) and casts authentic 3D geometry shadows onto curved marble quadrant scales.
- **Micro-Precision Shadow Loupe**: Magnifies the quadrant contact point down to 6-second scale graduations with an estimated uncertainty readout ($\pm 3$ seconds).
- **Dual Time Reconciliation**: Displays side-by-side comparisons of **Local Apparent Solar Time (LAST)**, traditional Indian units (**Ghatis, Palas, Vipalas**), and modern **Civil Clock Time** (explaining the Equation of Time and longitude offset).
- **Museum Heritage Storytelling**: A smooth, scroll-driven interactive exhibition guided by GSAP ScrollTrigger and Lenis.

---

## 📁 Repository Structure

```text
Kalaganaka/
├── backend/                       # Python FastAPI Astronomical Service
│   ├── app/
│   │   ├── api/                   # REST API routes (solar, places)
│   │   │   ├── routes_solar.py    # /api/v1/solar-position, /batch
│   │   │   ├── routes_places.py   # /api/v1/places/search
│   │   │   └── dependencies.py    # Common dependencies & rate limiting
│   │   ├── core/                  # Astronomical calculation kernels
│   │   │   ├── astronomy.py       # astronomy-engine wrappers (Alt/Az, Declination, JD)
│   │   │   ├── solar_time.py      # Equation of time, LAST, Ghatis/Palas
│   │   │   ├── yantra_geometry.py # Hour angle to quadrant arc angles & 6s scale ticks
│   │   │   └── validation.py      # Geographic coordinate & time validators
│   │   ├── schemas/               # Pydantic v2 data models
│   │   │   ├── solar.py           # Request & response solar schemas
│   │   │   └── location.py        # Location search schemas
│   │   ├── services/              # Business logic & caching
│   │   │   ├── solar_service.py   # Aggregates astronomy + yantra geometry
│   │   │   ├── place_service.py   # OpenStreetMap Nominatim geocoder
│   │   │   └── cache_service.py   # In-memory query cache
│   │   ├── tests/                 # Pytest test suite
│   │   │   ├── test_solar_position.py
│   │   │   └── test_yantra_geometry.py
│   │   ├── config.py              # Application settings
│   │   └── main.py                # FastAPI entry point & CORS configuration
│   ├── requirements.txt           # Python backend dependencies
│   └── README.md
│
├── frontend/                      # React 18+ JavaScript (JSX) Single-Page App
│   ├── src/
│   │   ├── components/            # UI Components
│   │   │   ├── layout/            # Museum header, navigation, layout wrappers
│   │   │   ├── guide/             # Scroll-driven museum guide exhibits (1-10)
│   │   │   ├── controls/          # Location search, date/time pickers, speed sliders
│   │   │   ├── readings/          # Sun coordinates, solar time, clock time comparison
│   │   │   ├── loupe/             # Magnified shadow reading loupe (quadrant, 1h, 1m/6s)
│   │   │   └── info/              # Multi-tab educational modal & tooltip glossary
│   │   ├── three/                 # 3D Scene Components (React Three Fiber)
│   │   │   ├── YantraScene.jsx    # Canvas, lighting, tone mapping, camera controls
│   │   │   ├── SamratYantra.jsx   # Procedural architectural model (gnomon, quadrants, chhatri)
│   │   │   ├── SunLight.jsx       # Directional light oriented to calculated solar angles
│   │   │   ├── SunPath.jsx        # 3D diurnal arc visualizer
│   │   │   ├── Compass.jsx        # Paved courtyard 3D compass rose
│   │   │   └── SceneLabels.jsx    # 3D text/pins for anatomical yantra parts
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useSolarPosition.js # Query backend with debounced time changes
│   │   │   ├── useLiveClock.js    # 1-second live clock ticker
│   │   │   └── useScrollGuide.js  # GSAP ScrollTrigger timeline binding
│   │   ├── store/
│   │   │   └── useKalaStore.js    # Global Zustand store (coordinates, time, simulation)
│   │   ├── lib/                   # Utility helpers
│   │   │   ├── api.js             # Fetch wrappers to backend REST endpoints
│   │   │   ├── format.js          # Time formatters (HH:MM:SS, Ghatis, angles)
│   │   │   └── constants.js       # Heritage city coordinates (Jaipur, Ujjain, Delhi, etc.)
│   │   ├── styles/                # Heritage theme styling & grain textures
│   │   ├── App.jsx                # Main application component (Guide & Simulator)
│   │   └── main.jsx               # React DOM entry
│   ├── index.html                 # HTML template with Indian heritage typography
│   ├── package.json               # Node.js dependencies (React, Vite, Three, GSAP, Zustand)
│   ├── vite.config.js             # Vite configuration with proxy to backend
│   ├── tailwind.config.js         # Museum Heritage color palette & typography tokens
│   └── README.md
│
├── docs/                          # Architectural & Mathematical Documentation
│   ├── project-plan.md            # Detailed master plan & task tracker
│   ├── api.md                     # OpenAPI specification & payload contracts
│   └── calculations.md            # Mathematical derivations of Yantra geometry & solar time
│
└── README.md                      # Master repository documentation (this file)
```

---

## 🎨 Design System: Museum Heritage

The aesthetic is inspired by physical royal observatory visitor centers and archival manuscripts:
- **Paper & Ivory Backgrounds**: `#FBF7F0` (aged vellum), `#F5EFEB` (exhibit card), `#EFE6D8` (parchment border).
- **Ink & Charcoal Text**: `#2A2421` (rich archival charcoal), `#524641` (secondary museum description).
- **Terracotta & Jaipur Red**: `#C45138` (traditional red sandstone accent), `#9E3B27` (deep cinnabar).
- **Royal Gold & Brass**: `#C5A059` (antique brass divider rule), `#E2C275` (sun path highlight).
- **White Marble**: `#FAF8F5` (quadrant scale face).
- **Typography**: Editorial serif headings (`Cormorant Garamond`, `Cinzel`, `Noto Serif Devanagari`) paired with clean tabular data numerals (`Plus Jakarta Sans`).

---

## 📐 Scientific & Astronomical Principles

### 1. Solar Hour Angle to Yantra Shadow
The Brihat Samrat Yantra's gnomon lies on the local meridian. The Sun's position relative to the local meridian is expressed by the **Solar Hour Angle ($H$)**:
$$H = 15^\circ \times (T_{\text{solar\_hours}} - 12)$$
- Morning ($H < 0$): Shadow casts on the **Eastern Quadrant**.
- Solar Noon ($H = 0$): Shadow lies directly on the central gnomon base / noon line.
- Afternoon ($H > 0$): Shadow casts on the **Western Quadrant**.

### 2. Timezone Offset & Equation of Time
Standard civil clocks show the mean solar time of a reference meridian (e.g., $82.5^\circ$ E for Indian Standard Time). The difference between local apparent sundial time and clock time is governed by:
1. **Longitude Correction**: $\Delta t_\lambda = 4 \times (\lambda_{\text{local}} - \lambda_{\text{standard}}) \text{ minutes}$. (At Jaipur $75.7873^\circ$ E, the Sun crosses the meridian $\approx 26.8$ minutes after standard IST noon).
2. **Equation of Time ($EoT$)**: The periodic variation (up to $\approx \pm 16$ minutes) caused by Earth's orbital eccentricity and axial tilt ($23.44^\circ$).
$$\text{Clock Time} - \text{Sundial Time} = -\Delta t_\lambda - EoT$$

### 3. Traditional Indian Units of Time (*Panchanga Horology*)
- $1 \text{ Solar Day (Ahoratra)} = 60 \text{ Ghatis (घटी)} = 24 \text{ hours}$
- $1 \text{ Ghati} = 60 \text{ Palas (पल)} = 24 \text{ minutes}$
- $1 \text{ Pala} = 60 \text{ Vipalas (विपल)} = 24 \text{ seconds}$

---

## 🚀 Getting Started

### ⚡ One-Click Startup (Recommended)
Double-click `run.bat` or execute in PowerShell:
```powershell
.\run.ps1
```
This automatically launches the FastAPI calculation service on port 8000, starts the Vite frontend on port 5173, and opens your default browser at `http://localhost:5173`.

---

### Manual Step-by-Step Setup

#### Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Python**: 3.11+ (tested on 3.14)

#### 1. Backend Setup
```bash
python -m uvicorn app.main:app --port 8000 --app-dir backend --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📜 License
MIT License — Educational and Cultural Heritage Preservation.

