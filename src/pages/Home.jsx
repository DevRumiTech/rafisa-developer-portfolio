import "../styles/portfolio.css";

// Portfolio projects are kept in one array for easier maintenance.
const projects = [
  ["01", "Alpine ClientFlow", "FRONTEND / CRM", "Client onboarding, role-based workspaces and compliance reviews."],
  ["02", "VeriLot", "FULL-STACK / INVENTORY", "Inventory management with serialized products and manufacturing batches."],
  ["03", "RumiPay", "FRONTEND / FINTECH", "Multilingual Swiss digital-wallet interface."],
  ["04", "SQL Ops Dashboard", "FULL-STACK / ANALYTICS", "Retail revenue, margin and product reporting."],
  ["05", "Wordle", "FULL-STACK / WORD GAME", "Word-guessing game with player accounts and game history."],
];

export default function Home() {
  return (
    <div className="portfolio">
      <header className="site-header">
        <a className="wordmark" href="#top">ML<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="location">VAUD, CH / 2026</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-rail">
            <span>PORTFOLIO / 001</span>
            <span>DEVELOPMENT & ENGINEERING</span>
          </div>
          <div className="hero-content">
            <p className="eyebrow">WEB DEVELOPMENT / VAUD, SWITZERLAND</p>
            <h1>Michael Leigh<span>Full-Stack Developer</span></h1>
            <div className="hero-bottom">
              <p>I develop full-stack web applications, from user interfaces and APIs to database-driven systems. My technical experience includes React, TypeScript, Node.js, Python, PostgreSQL and MySQL.</p>
              <a className="text-link" href="#work">Selected work ↗</a>
            </div>
          </div>
        </section>

        <section className="work-section section-shell" id="work">
          <div className="section-heading">
            <span className="section-index">01 / WORK</span>
            <h2>Selected projects</h2>
          </div>
          <div className="project-list">
            {projects.map(([number, name, category, description]) => (
              <article className="project-row" key={number}>
                <span className="project-number">{number}</span>
                <div className="project-info">
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <span className="project-category">{category}</span>
              </article>
            ))}
          </div>
          <a className="text-link external-link" href="https://github.com/DevRumiTech" target="_blank" rel="noopener noreferrer">View GitHub profile ↗</a>
        </section>

        <section className="about-section section-shell" id="about">
          <div className="section-heading">
            <span className="section-index">02 / PROFILE</span>
            <h2>Beyond the interface</h2>
          </div>
          <div className="about-grid">
            <div>
              <p className="about-lead">I build functional web applications, from user interfaces to the systems supporting them.</p>
              <p className="about-personal">Outside programming: Shotokan Karate, guitar and video games.</p>
            </div>
            <div className="experience-list">
              <div>
                <span className="small-label">CURRENT EXPERIENCE</span>
                <h3>Rafisa</h3>
                <p>Full-Stack Developer Intern</p>
                <p>October 2026 - January 2027</p>
              </div>
              <div>
                <span className="small-label">PREVIOUS EXPERIENCE</span>
                <h3>Gaea21 NGO</h3>
                <p>Web Developer Intern</p>
                <p>Jun - Sep 2025</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section section-shell" id="contact">
          <span className="section-index">03 / CONTACT</span>
          <h2>Contact</h2><p className="contact-intro">For employment opportunities and professional enquiries.</p>
          <a className="contact-email" href="mailto:rumi6864@gmail.com">Contact me ↗</a>
        </section>
      </main>

      <footer className="site-footer">
        <span>© 2026 MICHAEL LEIGH</span>
        <span>DESIGNED & DEVELOPED IN SWITZERLAND</span>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </div>
  );
}




