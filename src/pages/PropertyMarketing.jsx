import { useEffect, useRef, useState } from "react";
import { Clapperboard, Smartphone, Zap, Layers } from "lucide-react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import GlowCard from "../components/GlowCard";
import Reveal from "../components/Reveal";
import CTASection from "../components/CTASection";
import previewVideo from "../assets/video/property-marketing-preview.mp4";
import previewPoster from "../assets/video/property-marketing-poster.jpg";

const deliverables = [
  {
    icon: Clapperboard,
    title: "Cinematic Property Films",
    description:
      "Immersive promotional videos that transform your existing property photography into a dynamic visual experience.",
  },
  {
    icon: Smartphone,
    title: "Social Media Reels",
    description:
      "Short-form vertical content optimized for Instagram, TikTok, Facebook, and other social platforms.",
  },
  {
    icon: Zap,
    title: "Property Teasers",
    description:
      "High-impact short videos designed to capture attention and drive viewers toward your listing, website, or booking page.",
  },
  {
    icon: Layers,
    title: "Multi-Format Content",
    description:
      "Your property film can be adapted for websites, social media, digital advertising, and other marketing channels.",
  },
];

function PreviewVideo() {
  const videoRef = useRef(null);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAutoPlay(!prefersReduced);
  }, []);

  useEffect(() => {
    if (autoPlay) videoRef.current?.play().catch(() => {});
  }, [autoPlay]);

  return (
    <div className="overflow-hidden rounded-2xl border border-cf-border bg-cf-surface/40 shadow-[0_0_0_1px_rgba(139,92,246,0.15),0_20px_60px_-20px_rgba(124,58,237,0.35)]">
      <video
        ref={videoRef}
        className="w-full"
        poster={previewPoster}
        controls
        muted={autoPlay}
        loop={autoPlay}
        playsInline
        preload="metadata"
        aria-label="Sample cinematic property marketing video"
      >
        <source src={previewVideo} type="video/mp4" />
      </video>
    </div>
  );
}

const idealFor = [
  "Luxury vacation rentals",
  "Airbnb & VRBO properties",
  "Real estate listings",
  "Boutique hotels & resorts",
  "Property management companies",
];

export default function PropertyMarketing() {
  return (
    <>
      <SEO
        title="Cinematic Property Marketing"
        description="Turn your existing property photos into cinematic promotional video — for luxury vacation rentals, Airbnb & VRBO, real estate, and property management. Starting at $500."
      />

      <PageHero
        eyebrow="New Service"
        title="Turn Your Property Photos Into an Experience."
        description="Bring your property to life with cinematic, motion-driven video content created from your existing professional photography."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-4xl">
          <Reveal>
            <PreviewVideo />
            <p className="mt-4 text-center text-sm text-cf-gray-dim">
              A sample of the kind of cinematic property film CyberFalcon Digital can create from your photos.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-cf-border py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col gap-5 text-base leading-relaxed text-cf-gray">
            <p>
              CyberFalcon Digital transforms static property images into polished promotional films designed to
              showcase the atmosphere, architecture, amenities, and standout features of your space — without the
              need to schedule a traditional video shoot.
            </p>
            <p className="text-white font-semibold">Your photos show the space. We create the experience.</p>
          </Reveal>

          <Reveal delay={100}>
            <GlowCard className="p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Perfect for</h2>
              <ul className="flex flex-col gap-3">
                {idealFor.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-cf-gray">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cf-purple" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-cf-border bg-cf-bg-soft py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="What we create" title="What We Create" className="mb-12" />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <GlowCard className="flex h-full flex-col gap-3.5 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cf-border bg-cf-bg-soft text-cf-purple">
                    <item.icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-cf-gray">{item.description}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-cf-border py-16 sm:py-20">
        <Container className="max-w-3xl text-center">
          <Reveal className="flex flex-col items-center gap-5">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">No New Photoshoot Required.</h2>
            <p className="text-base leading-relaxed text-cf-gray">
              Already have beautiful professional photos? We'll work with your existing visual assets to create
              fresh, engaging video content, giving your property an entirely new way to be seen.
            </p>

            <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-cf-border bg-cf-surface/50 px-8 py-6">
              <span className="text-xs font-medium uppercase tracking-wide text-cf-gray-dim">Starting at</span>
              <span className="text-4xl font-bold text-white">$500</span>
              <p className="mt-2 max-w-sm text-xs text-cf-gray-dim">
                Final pricing varies based on video length, number of scenes, deliverable formats, and
                customization.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <CTASection
        title="Make Your Property Move."
        description="Send over your existing property photos and let's talk about what we can create."
        ctaLabel="Request a Quote"
      />
    </>
  );
}
