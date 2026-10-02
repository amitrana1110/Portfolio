"use client";
import Image from "next/image";
import { portfolio } from "@/data/portfolio";

export function Avatar({ large = false, preload = false }) {
  return portfolio.portrait && !large ? (
    <span className="avatar avatar-photo">
      <Image src={portfolio.portrait} alt={portfolio.name} fill sizes="80px" />
    </span>
  ) : portfolio.portrait ? (
    <Image
      src={portfolio.portrait}
      width={large ? 480 : 64}
      height={640}
      sizes="(max-width: 809.98px) calc(100vw - 64px), 480px"
      alt={portfolio.name}
      className={large ? "portrait" : "avatar"}
      preload={preload}
    />
  ) : (
    <div
      className={large ? "initials large" : "initials"}
      aria-label={`${portfolio.name} initials avatar`}
    >
      <span>{portfolio.initials}</span>
    </div>
  );
}
