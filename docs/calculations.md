# Mathematical & Astronomical Formulations of Samrat Yantra
**KalaGanaka Mathematical Documentation**

---

## 1. Principles of the Equinoctial Sundial

The **Brihat Samrat Yantra** (*Supreme Instrument*) is fundamentally an equinoctial (or equatorial) sundial scaled up to immense proportions (27 meters gnomon height at Jaipur).

### 1.1 Gnomon Orientation
- The hypotenuse of the triangular gnomon is set parallel to **Earth's rotational axis**.
- In the horizontal coordinate system, this requires:
  1. Azimuth alignment: Exactly along the **true North-South meridian** ($0^\circ - 180^\circ$).
  2. Elevation angle: The angle of inclination $\theta_{\text{gnomon}}$ above the horizontal plane equals the observer's geographic latitude $\phi$:
     $$\theta_{\text{gnomon}} = \phi$$
  3. Direction: In the Northern Hemisphere, the hypotenuse tilts upwards toward the North Celestial Pole (near Polaris).

### 1.2 Quadrant Plane Geometry
- The two flanking quadrant scales form a section of a cylinder whose axis is the gnomon edge.
- Therefore, the plane containing the circular quadrant arcs is perpendicular to the gnomon edge:
  $$\theta_{\text{quadrant}} = 90^\circ - \phi \quad \text{(from horizontal)}$$
- This makes the quadrant arcs strictly parallel to **Earth's Equatorial Plane**.
- Because Earth rotates uniformly at $360^\circ$ per 24 mean solar hours ($15^\circ/\text{hour}$ or $1^\circ/4\text{ minutes}$), the Sun’s hour angle projects linearly onto the circular quadrant arc without the trigonometric non-linearities found in horizontal sundials!

---

## 2. Solar Hour Angle & Shadow Scale Mapping

### 2.1 Solar Hour Angle ($H$)
The Solar Hour Angle measures the angular distance of the Sun west of the local meridian:
$$H = 15^\circ \times (T_{\text{solar\_hours}} - 12)$$
where $T_{\text{solar\_hours}}$ is Local Apparent Solar Time expressed in decimal hours.

### 2.2 Quadrant Selection & Reading
- **Morning ($H < 0$)**: The Sun is east of the meridian; its rays project the gnomon's shadow onto the **Eastern Quadrant** (reading 06:00 to 12:00).
- **Solar Noon ($H = 0$)**: The Sun culminates on the local meridian. The shadow falls exactly along the base of the gnomon (the Noon Line).
- **Afternoon ($H > 0$)**: The Sun is west of the meridian; its rays project the shadow onto the **Western Quadrant** (reading 12:00 to 18:00).

### 2.3 Shadow Angle on Quadrant Arc
$$\alpha_{\text{shadow}} = |H| = 15^\circ \times |T_{\text{solar\_hours}} - 12|$$
At $T_{\text{solar\_hours}} = 14:31:24$:
$$T = 14 + \frac{31}{60} + \frac{24}{3600} = 14.52333\dots \text{ hours}$$
$$\Delta T = 2.52333\dots \text{ hours past noon}$$
$$\alpha_{\text{shadow}} = 15^\circ \times 2.52333\dots = 37.85^\circ \quad (\text{on Western Quadrant})$$

### 2.4 Scale Graduations on Brihat Samrat Yantra
The radius of the Jaipur quadrant arc is approximately $R \approx 15.1\text{ meters}$.
- Arc length for $1 \text{ hour}$ ($15^\circ = 0.2618 \text{ rad}$):
  $$s_{\text{hour}} = R \times \Delta \theta = 15.1 \times 0.2618 \approx 3.95 \text{ meters}$$
- Arc length for $1 \text{ minute}$ ($0.25^\circ = 0.004363 \text{ rad}$):
  $$s_{\text{minute}} = \frac{3.95 \text{ m}}{60} \approx 65.9 \text{ mm}$$
- Arc length for $6 \text{ seconds}$ ($0.025^\circ$):
  $$s_{6\text{s}} = \frac{65.9 \text{ mm}}{10} \approx 6.6 \text{ mm}$$
- Arc length for $2 \text{ seconds}$:
  $$s_{2\text{s}} \approx 2.2 \text{ mm}$$
Because a human observer can comfortably resolve markings separated by $2 \text{ mm}$, the Brihat Samrat Yantra achieves an astronomical reading precision of **$\pm 2$ to $3$ seconds**.

---

## 3. Solar Position Vector to 3D Cartesian Coordinates

To illuminate the 3D scene authentically, the directional light must be positioned along the topocentric Sun vector.

Given:
- Altitude $a \in [-90^\circ, +90^\circ]$ (angle above horizontal plane)
- Azimuth $A \in [0^\circ, 360^\circ]$ (angle measured clockwise from North: $0^\circ = \text{North}, 90^\circ = \text{East}, 180^\circ = \text{South}, 270^\circ = \text{West}$)
- Distance $D$ (arbitrary light radius, e.g. $D = 100\text{ meters}$)

In Three.js standard coordinates:
- $+X$ = East
- $+Y$ = Up (Zenith)
- $+Z$ = South (or $-Z$ = North depending on convention; let $-Z$ = North, $+Z$ = South, $+X$ = East, $-X$ = West)

Converting spherical coordinates $(a, A)$ to Cartesian $(X, Y, Z)$:
$$Y = D \times \sin(a)$$
$$R_{\text{horiz}} = D \times \cos(a)$$
$$X = R_{\text{horiz}} \times \sin(A)$$
$$Z = -R_{\text{horiz}} \times \cos(A)$$

When $a > 0^\circ$, the Sun is above the horizon and casts directional light with active shadow maps.  
When $a \le 0^\circ$, the Sun is below the horizon; the directional sunlight intensity drops to zero, and soft twilight / ambient starlight takes over.

---

## 4. Equation of Time ($EoT$) Formulation

The Equation of Time accounts for the discrepancy between apparent solar time (sundial) and mean solar time (clock):
$$EoT = \text{LAST} - \text{LMST}$$

It arises from two distinct celestial phenomena:
1. **Orbital Eccentricity ($e \approx 0.0167$)**: By Kepler's second law, Earth moves faster at perihelion (January) and slower at aphelion (July).
2. **Obliquity of the Ecliptic ($\epsilon \approx 23.44^\circ$)**: Earth's equator is tilted relative to the plane of the ecliptic, so the Sun's apparent motion along the celestial equator varies through the seasons.

The combined effect reaches extremes of approximately $+16.4\text{ minutes}$ in early November and $-14.2\text{ minutes}$ in mid-February. In `astronomy-engine`, this is derived from the Sun's true right ascension $\alpha$ and Greenwich Mean Sidereal Time (GMST).

---

## 5. Panchanga Time Reckoning (Horology)

Classical Indian astronomy divides the 24-hour day (*ahoratra*) into sexagesimal units:
$$1 \text{ Solar Day} = 60 \text{ Ghatis (घटी)} = 3600 \text{ Palas (पल)} = 216000 \text{ Vipalas (विपल)}$$

| Unit | Traditional Name | Modern Equivalent |
| :--- | :--- | :--- |
| **Ghati** (घटी / नाड़ी) | 1/60th of day | $24 \text{ minutes}$ |
| **Pala** (पल / विघटी) | 1/60th of ghati | $24 \text{ seconds}$ |
| **Vipala** (विपल) | 1/60th of pala | $0.4 \text{ seconds}$ |
| **Prana** (प्राण) | 1/6th of pala | $4 \text{ seconds}$ |
| **Truti** (त्रुटि) | Micro-division | $\approx 29.6 \text{ microseconds}$ |

