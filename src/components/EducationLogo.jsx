export default function EducationLogo({ title, institution }) {
  const heArc =
    institution.includes("HE-Arc") ||
    institution.includes("Haute École Arc");

  const meta =
    title.includes("Meta") ||
    institution.includes("Meta");

  if (heArc) {
    return (
      <div className="education-logo hearc-logo" aria-hidden="true">
        <span>HE-Arc</span>
      </div>
    );
  }

  if (meta) {
    return (
      <div className="education-logo meta-logo" aria-hidden="true">
        <svg
          viewBox="-7 0 120 60"
          role="presentation"
          focusable="false"
        >
          <path
            d="M8 41c6-18 13-27 20-27 9 0 14 11 21 24 6-13 12-24 21-24 10 0 18 11 28 27"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return null;
}
