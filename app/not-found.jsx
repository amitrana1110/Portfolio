import Link from "next/link";
export default function NotFound() {
  return (
    <section className="closing">
      <p className="eyebrow"> // 404</p>
      <h1>This page isn’t here.</h1>
      <p>Let’s get you back to the portfolio.</p>
      <Link className="button primary" href="/">
        Back to home ↗
      </Link>
    </section>
  );
}
