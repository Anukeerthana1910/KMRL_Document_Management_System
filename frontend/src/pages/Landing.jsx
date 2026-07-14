  import { Link } from "react-router-dom";
  import { useEffect, useRef, useState } from "react";
  import "./Landing.css";


  const NOTICES = [
    "Tender notice: Civil works package CW-14 closes 28 July 2026",
    "Circular: Revised leave policy effective 1 August 2026",
    "Advisory: Portal maintenance window on 20 July, 11 PM – 1 AM",
    "Recruitment: Applications open for Station Controller (Grade II)",
  ];

  const FONT_STEPS = [
    { label: "A-", value: 0.9, name: "Small text" },
    { label: "A", value: 1, name: "Default text" },
    { label: "A+", value: 1.15, name: "Large text" },
  ];

  const STATIONS = [

    {
      name: "Upload",
      detail: "Staff submit the source file"
    },

    {
      name: "OCR & Classify",
      detail: "Text extracted, category assigned"
    },

    {
      name: "Verify",
      detail: "Department head reviews"
    },

    {
      name: "Approve",
      detail: "Signed off and released"
    },

    {
      name: "Archive",
      detail: "Retained with full history"
    }

  ];


  const STATS = [

    { value: "7", label: "Departments connected" },
    { value: "100%", label: "Actions logged" },
    { value: "2", label: "Languages supported" },
    { value: "24×7", label: "Portal availability" }

  ];


  const FEATURES = [

    {
      title: "Smart Search",
      desc: "Locate any record by title, category or keyword across every department in seconds."
    },

    {
      title: "Role-Based Access",
      desc: "Staff, department heads and administrators each see only what their role permits."
    },

    {
      title: "AI Summaries",
      desc: "Long reports are condensed automatically, with key dates and figures tagged."
    },

    {
      title: "Audit Trail",
      desc: "Every upload, review, approval and download is time-stamped and traceable."
    }

  ];


  const SLIDES = [

    {
      eyebrow: "Smart Document Management System",
      title: <>Every record,<br />on the right track.</>,
      sub: "Contracts, tenders, circulars and inspection reports move through one verified line — searchable, access-controlled, and logged at every stop along the way.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kochi_metro_train_at_mg_road_station_Ernakulam,_Kerala,_India.jpg?width=1600",
      alt: "Kochi Metro train arriving at MG Road station, Ernakulam",
      credit: "Photo: Ranjithsiji / Wikimedia Commons, CC BY-SA 4.0",
      showActions: true
    },

    {
      eyebrow: "Digitised at the source",
      title: <>Scan it once.<br />Find it forever.</>,
      sub: "Every incoming paper record is scanned, OCR'd and classified the same day, so nothing waits in a drawer for someone to remember it.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kochi_metro_train_sideview.jpg?width=1600",
      alt: "Side view of a Kochi Metro train on the elevated line",
      credit: "Photo: Jinoytommanjaly / Wikimedia Commons, CC BY-SA 4.0",
      showActions: false
    },

    {
      eyebrow: "Accountable by design",
      title: <>Approved, signed —<br />and logged every time.</>,
      sub: "Sign-offs move through the right department head automatically, with a full audit trail attached the moment a file is approved.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Train_at_Aluva_Metro_Station.jpg?width=1600",
      alt: "Train at Aluva Metro Station, the northern terminal of the Blue Line",
      credit: "Photo: Shady59 / Wikimedia Commons, CC BY-SA 4.0",
      showActions: false
    },

    {
      eyebrow: "One system, seven departments",
      title: <>Built for Kochi.<br />Built to scale.</>,
      sub: "From Engineering to Finance, every department works off the same verified record — no more chasing the latest copy over email.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Elamkulam_metro_station,_Kochi.jpg?width=1600",
      alt: "Elamkulam metro station along the Kochi Metro Blue Line",
      credit: "Photo: Ravi Dwivedi / Wikimedia Commons, CC BY-SA 4.0",
      showActions: false
    }

  ];


  export default function Landing() {

    const [slide, setSlide] = useState(0);
    const [paused, setPaused] = useState(false);
    const [fontStep, setFontStep] = useState(1);

    useEffect(() => {

      if (paused) return;

      const id = setInterval(() => {
        setSlide(s => (s + 1) % SLIDES.length);
      }, 6000);

      return () => clearInterval(id);

    }, [paused, slide]);


    function goTo(i) {
      setSlide(i);
    }

    function prevSlide() {
      setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
    }

    function nextSlide() {
      setSlide(s => (s + 1) % SLIDES.length);
    }

    function onCarouselKeyDown(e) {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    }


    return (

      <div className="gv-page" style={{ "--gv-font-scale": FONT_STEPS[fontStep].value }}>

        <div className="gv-tricolour" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <a href="#gv-main" className="gv-skip-link">Skip to main content</a>

        <div className="gv-credential-bar">

          <span>Government of Kerala Undertaking</span>

          <div className="gv-credential-right">

            <span className="gv-credential-ref">
              File No. KMRL/IT/DMS/2026
            </span>

            <div className="gv-font-toggle" role="group" aria-label="Adjust text size">

              {FONT_STEPS.map((f, i) => (

                <button
                  key={f.label}
                  type="button"
                  className={"gv-font-btn" + (fontStep === i ? " active" : "")}
                  aria-pressed={fontStep === i}
                  title={f.name}
                  onClick={() => setFontStep(i)}
                >
                  {f.label}
                </button>

              ))}

            </div>

          </div>

        </div>


        <div className="gv-ticker" aria-label="Latest notices">

          <span className="gv-ticker-label">What's new</span>

          <div className="gv-ticker-track">

            <div className="gv-ticker-content">
              {NOTICES.map((n, i) => (
                <span className="gv-ticker-item" key={`a${i}`}>{n}</span>
              ))}
            </div>

            <div className="gv-ticker-content" aria-hidden="true">
              {NOTICES.map((n, i) => (
                <span className="gv-ticker-item" key={`b${i}`}>{n}</span>
              ))}
            </div>

          </div>

        </div>


        <header className="gv-nav">

          <div className="gv-brand">

            <Seal size={40} />

            <div className="gv-brand-text">
              <strong>KMRL</strong>
              <span>Document Management System</span>
            </div>

          </div>

          <Link to="/login" className="gv-nav-cta">
            Login to Portal
          </Link>

        </header>


        <main id="gv-main">

          <section
            className="gv-carousel"
            aria-roledescription="carousel"
            aria-label="Highlights"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={onCarouselKeyDown}
          >

            <div
              className="gv-carousel-track"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >

              {SLIDES.map((s, i) => (

                <div
                  className="gv-slide"
                  key={i}
                  aria-hidden={slide !== i}
                >

                  <img
                    className="gv-slide-photo"
                    src={s.image}
                    alt={s.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                  />

                  <div className="gv-slide-scrim" />

                  <div className="gv-slide-caption">

                    <p className="gv-eyebrow gv-eyebrow-light">{s.eyebrow}</p>

                    <h1>{s.title}</h1>

                    <p className="gv-hero-sub gv-hero-sub-light">{s.sub}</p>

                    {s.showActions && (

                      <div className="gv-hero-actions">

                        <Link to="/login" className="gv-btn-primary">
                          Login to Portal
                        </Link>

                        <a href="#capabilities" className="gv-btn-secondary gv-btn-secondary-light">
                          View capabilities
                        </a>

                      </div>

                    )}

                  </div>

                  <span className="gv-slide-credit">{s.credit}</span>

                </div>

              ))}

            </div>


            <button
              type="button"
              className="gv-carousel-arrow gv-carousel-prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ‹
            </button>

            <button
              type="button"
              className="gv-carousel-arrow gv-carousel-next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              ›
            </button>

            <div className="gv-carousel-dots" role="tablist" aria-label="Slides">

              {SLIDES.map((_, i) => (

                <button
                  type="button"
                  key={i}
                  role="tab"
                  aria-selected={slide === i}
                  aria-label={`Go to slide ${i + 1}`}
                  className={"gv-dot" + (slide === i ? " active" : "")}
                  onClick={() => goTo(i)}
                />

              ))}

            </div>

            <span className="gv-sr-live" aria-live="polite">
              {`Slide ${slide + 1} of ${SLIDES.length}: ${SLIDES[slide].eyebrow}`}
            </span>

          </section>


          <section className="gv-line-section" aria-label="Document workflow">

            <MetroLine stations={STATIONS} />

          </section>


          <section className="gv-stats">

            {STATS.map(s => (

              <div className="gv-stat" key={s.label}>
                <span className="gv-stat-value">{s.value}</span>
                <span className="gv-stat-label">{s.label}</span>
              </div>

            ))}

          </section>


          <section className="gv-features" id="capabilities">

            <p className="gv-eyebrow">System Capabilities</p>

            <h2 className="gv-section-title">
              Built for how departments actually work
            </h2>

            <div className="gv-feature-grid">

              {FEATURES.map(f => (

                <div className="gv-feature-card" key={f.title}>

                  <FeatureIcon name={f.title} />

                  <h3>{f.title}</h3>

                  <p>{f.desc}</p>

                </div>

              ))}

            </div>

          </section>


          <section className="gv-compliance">

            <div className="gv-compliance-inner">

              <Seal size={52} light />

              <div className="gv-compliance-text">

                <p className="gv-eyebrow gv-eyebrow-light">Handled with care</p>

                <h2>Security and accountability, by default</h2>

                <ul>

                  <li>Encrypted in transit and at rest</li>
                  <li>Role-based access enforced end to end</li>
                  <li>Every view, edit and download time-stamped</li>

                </ul>

              </div>

            </div>

          </section>

        </main>


        <footer className="gv-footer">

          <div className="gv-footer-grid">

            <div>
              <div className="gv-brand gv-brand-footer">
                <Seal size={32} light />
                <div className="gv-brand-text">
                  <strong>KMRL</strong>
                  <span>Document Management System</span>
                </div>
              </div>
              <p>
                A single record system for uploads, approvals and audit
                history across Kochi Metro Rail Limited's departments.
              </p>
            </div>

            <div>
              <h4>Quick links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login to portal</Link></li>
                <li><a href="#capabilities">Capabilities</a></li>
              </ul>
            </div>

            <div>
              <h4>Contact</h4>
              <ul className="gv-footer-contact">
                <li>Metro Bhavan, JLN Stadium Road</li>
                <li>Kaloor, Kochi, Kerala 682017</li>
                <li>dms-support@kmrl.example</li>
              </ul>
            </div>

          </div>

          <div className="gv-footer-bottom">

            <span>
              © 2026 Kochi Metro Rail Limited &middot; Smart Document Management System
            </span>

            <span className="gv-footer-note">
              Academic project prototype
            </span>

          </div>

        </footer>


      </div>

    );

  }



  function Seal({ size = 40, light = false }) {

    const stroke = light ? "#F7F4EE" : "#0B2545";
    const fill = light ? "none" : "#F7F4EE";

    return (

      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >

        <circle cx="32" cy="32" r="30" stroke={stroke} strokeWidth="2" />
        <circle cx="32" cy="32" r="24" stroke={stroke} strokeWidth="1" />

        {/* stylised rail arc */}
        <path
          d="M14 36 A18 18 0 0 1 50 36"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        <circle cx="14" cy="36" r="2.5" fill={stroke} />
        <circle cx="32" cy="20.5" r="2.5" fill={stroke} />
        <circle cx="50" cy="36" r="2.5" fill={stroke} />

        {/* document glyph */}
        <rect x="26" y="38" width="12" height="15" rx="1.5" stroke={stroke} strokeWidth="2" fill={fill} />
        <line x1="29" y1="43" x2="35" y2="43" stroke={stroke} strokeWidth="1.4" />
        <line x1="29" y1="47" x2="35" y2="47" stroke={stroke} strokeWidth="1.4" />

      </svg>

    );

  }



  function MetroLine({ stations }) {

    const width = 1000;
    const height = 190;
    const startX = 70;
    const endX = 930;
    const y = 90;

    const step = (endX - startX) / (stations.length - 1);

    return (

      <svg
        className="gv-metro-svg"
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Document workflow: Upload, OCR and Classify, Verify, Approve, Archive"
      >

        <line
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke="var(--gv-green)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {stations.map((s, i) => {

          const cx = startX + step * i;
          const below = i % 2 === 1;

          return (

            <g key={s.name}>

              <circle cx={cx} cy={y} r="11" fill="var(--gv-paper)" stroke="var(--gv-navy)" strokeWidth="3" />
              <circle cx={cx} cy={y} r="4.5" fill="var(--gv-saffron)" />

              <text
                x={cx}
                y={below ? y + 40 : y - 28}
                textAnchor="middle"
                className="gv-metro-station-name"
              >
                {s.name}
              </text>

              <text
                x={cx}
                y={below ? y + 58 : y - 12}
                textAnchor="middle"
                className="gv-metro-station-detail"
              >
                {s.detail}
              </text>

            </g>

          );

        })}

      </svg>

    );

  }



  function FeatureIcon({ name }) {

    const common = {
      width: 28,
      height: 28,
      viewBox: "0 0 28 28",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "var(--gv-green)",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    };

    if (name === "Smart Search") {
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
          <line x1="17.2" y1="17.2" x2="23" y2="23" />
        </svg>
      );
    }

    if (name === "Role-Based Access") {
      return (
        <svg {...common}>
          <path d="M14 3 L23 7 V13 C23 19 19 23.5 14 25 C9 23.5 5 19 5 13 V7 Z" />
          <path d="M10 14 L13 17 L18.5 11" />
        </svg>
      );
    }

    if (name === "AI Summaries") {
      return (
        <svg {...common}>
          <rect x="5" y="4" width="18" height="20" rx="1.5" />
          <line x1="9" y1="10" x2="19" y2="10" />
          <line x1="9" y1="14.5" x2="19" y2="14.5" />
          <line x1="9" y1="19" x2="15" y2="19" />
        </svg>
      );
    }

    return (
      <svg {...common}>
        <rect x="4" y="9" width="20" height="14" rx="1.5" />
        <path d="M4 9 L8 4 H20 L24 9" />
        <line x1="11" y1="15" x2="17" y2="15" />
      </svg>
    );

  }