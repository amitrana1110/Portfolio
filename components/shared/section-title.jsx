
export function SectionTitle({ label, title, level = 2 }) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow"> // {label}</p>
      <Heading>
        {title.split(" ").map((word, i) => (
          <span
            className="reveal-word"
            style={{ "--word": i }}
            key={`${word}-${i}`}
          >
            {word}{" "}
          </span>
        ))}
      </Heading>
    </div>
  );
}
