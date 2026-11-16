import { useTranslation } from "react-i18next";
import { professional } from "../data/professional";
import TechnologyLogo from "./TechnologyLogo";
import "../styles/professional.css";

export default function ProfessionalSections() {
  // Select English or French professional information.
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith("fr") ? "fr" : "en";
  const content = professional[language];

  return (
    <>
      <section className="profile-section section-shell" id="skills">
        <div className="section-heading">
          <span className="section-index">03 / SKILLS</span>
          <h2>{content.skillsTitle}</h2>
        </div>

        <div className="professional-list">
          {content.skills.map((group) => (
            <div className="professional-row" key={group.category}>
              <h3>{group.category}</h3>

              <ul className="skill-items">
                {group.items.map((item) => (
                  <li key={item}>
                    <TechnologyLogo name={item} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="soft-skills">
          <h3>{content.softSkillsTitle}</h3>
          <ul>
            {content.softSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="profile-section education-section section-shell"
        id="education"
      >
        <div className="section-heading">
          <span className="section-index">04 / EDUCATION</span>
          <h2>{content.educationTitle}</h2>
        </div>

        <div className="professional-list">
          {content.education.map((item) => (
            <article className="professional-row" key={item.period}>
              <span className="education-period">{item.period}</span>

              <div>
                <h3>{item.title}</h3>
                <p>{item.institution}</p>
                <p>{item.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
