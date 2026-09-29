// Central place for values you'll want to change before launch.
export const SITE = {
  name: "FullSquad",
  // Set NEXT_PUBLIC_SITE_URL in Netlify (Site settings → Environment variables) once you have a domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://fullsquad.netlify.app").replace(/\/$/, ""),
  title: "FullSquad: Pickup Soccer Games That Fill Themselves",
  description:
    "Post your pickup soccer game once. FullSquad fills spots by position and skill, runs a fair waitlist, and backfills dropouts with one tap. Free for every player.",
  tagline: "Pickup games that fill themselves",
  contactEmail: "hello@fullsquad.app",
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    youtube: "https://youtube.com/",
    linkedin: "https://linkedin.com/",
  },
};
