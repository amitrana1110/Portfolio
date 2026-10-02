import { ArrowDown } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function ResumeLink() {
  return (
    <a
      href={portfolio.resume}
      download="Amit_Singh_Rana_Resume.pdf"
      className="button"
    >
      Download CV
      <ArrowDown size={15} />
    </a>
  );
}
