import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import GlowCard from "../components/GlowCard";
import Button from "../components/Button";
import { contact, serviceOptions } from "../config/site";

const initialState = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  websiteUrl: "",
  services: [],
  platform: "",
  needsManagement: "",
  timeline: "",
  details: "",
};

const inputClass =
  "w-full rounded-lg border border-cf-border bg-cf-bg-soft px-3.5 py-2.5 text-sm text-white placeholder:text-cf-gray-dim transition-colors focus:border-cf-purple focus:outline-none";

const labelClass = "mb-1.5 block text-sm font-medium text-white";

function buildMailtoBody(form) {
  const lines = [
    `Name: ${form.name}`,
    `Organization: ${form.organization || "—"}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone || "—"}`,
    `Current website: ${form.websiteUrl || "—"}`,
    `Needs help with: ${form.services.length ? form.services.join(", ") : "—"}`,
    `Current platform: ${form.platform || "—"}`,
    `Needs ongoing management: ${form.needsManagement || "—"}`,
    `Desired timeline: ${form.timeline || "—"}`,
    "",
    "Additional details:",
    form.details || "—",
  ];
  return lines.join("\n");
}

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleService = (service) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(service)
        ? f.services.filter((s) => s !== service)
        : [...f.services, service],
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (form.services.length === 0) nextErrors.services = "Select at least one option.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    try {
      if (contact.formEndpoint) {
        const res = await fetch(contact.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Request failed");
        setStatus("success");
      } else {
        const subject = encodeURIComponent(`Website Quote Request — ${form.organization || form.name}`);
        const body = encodeURIComponent(buildMailtoBody(form));
        window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <>
        <SEO title="Request a Quote" description="Request a website quote from CyberFalcon Digital." />
        <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
          <CheckCircle2 size={48} className="text-cf-blue-bright" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-white">Thanks — your quote request is on its way.</h1>
          <p className="max-w-md text-cf-gray">
            {contact.formEndpoint
              ? "We've received your request and will be in touch soon."
              : "Your email client should have opened with your request pre-filled. Send it over and we'll be in touch soon."}
          </p>
          <Button to="/" variant="secondary" icon={false}>
            Back to Home
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Request a Quote"
        description="Tell us about your website project and get a quote from CyberFalcon Digital."
      />

      <PageHero
        eyebrow="Contact"
        title="Request a Website Quote"
        description="Tell us a bit about your organization and what you need. We'll follow up with next steps."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <GlowCard as="div" className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name <span className="text-cf-blue-bright">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass}
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="organization" className={labelClass}>
                    Organization
                  </label>
                  <input
                    id="organization"
                    type="text"
                    value={form.organization}
                    onChange={update("organization")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email <span className="text-cf-blue-bright">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone
                  </label>
                  <input id="phone" type="tel" value={form.phone} onChange={update("phone")} className={inputClass} />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="websiteUrl" className={labelClass}>
                    Current website URL
                  </label>
                  <input
                    id="websiteUrl"
                    type="text"
                    placeholder="e.g. yourorganization.org"
                    value={form.websiteUrl}
                    onChange={update("websiteUrl")}
                    className={inputClass}
                  />
                </div>
              </div>

              <fieldset>
                <legend className={labelClass}>
                  What do you need help with? <span className="text-cf-blue-bright">*</span>
                </legend>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {serviceOptions.map((service) => (
                    <label
                      key={service}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-cf-border bg-cf-bg-soft px-3.5 py-2.5 text-sm text-cf-gray transition-colors has-[:checked]:border-cf-purple has-[:checked]:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={form.services.includes(service)}
                        onChange={() => toggleService(service)}
                        className="h-4 w-4 shrink-0 rounded border-cf-border bg-cf-bg accent-[#8b5cf6]"
                      />
                      {service}
                    </label>
                  ))}
                </div>
                {errors.services && <p className="mt-2 text-xs text-red-400">{errors.services}</p>}
              </fieldset>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="platform" className={labelClass}>
                    Current website platform
                  </label>
                  <input
                    id="platform"
                    type="text"
                    placeholder="e.g. WordPress, Squarespace, none yet"
                    value={form.platform}
                    onChange={update("platform")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="timeline" className={labelClass}>
                    Desired timeline
                  </label>
                  <input
                    id="timeline"
                    type="text"
                    placeholder="e.g. Within a month, flexible"
                    value={form.timeline}
                    onChange={update("timeline")}
                    className={inputClass}
                  />
                </div>
              </div>

              <fieldset>
                <legend className={labelClass}>Do you need ongoing website management?</legend>
                <div className="flex flex-wrap gap-5">
                  {["Yes", "No", "Not sure yet"].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-cf-gray">
                      <input
                        type="radio"
                        name="needsManagement"
                        value={option}
                        checked={form.needsManagement === option}
                        onChange={update("needsManagement")}
                        className="h-4 w-4 border-cf-border bg-cf-bg accent-[#8b5cf6]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="details" className={labelClass}>
                  Additional details
                </label>
                <textarea
                  id="details"
                  rows={5}
                  value={form.details}
                  onChange={update("details")}
                  className={`${inputClass} resize-y`}
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-400" role="alert">
                  Something went wrong sending your request. Please try again or email us directly.
                </p>
              )}

              <Button as="button" type="submit" size="lg" className="self-start" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending…" : "Request My Quote"}
              </Button>
            </form>
          </GlowCard>

          <aside className="flex flex-col gap-4">
            <GlowCard className="p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Prefer email?</h2>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 text-sm text-cf-blue-bright hover:underline"
              >
                <Mail size={16} aria-hidden="true" />
                {contact.email}
              </a>
              <p className="mt-4 text-sm leading-relaxed text-cf-gray">
                We respond as quickly as we can. Include as much detail as you'd like — there's no wrong way to
                reach out.
              </p>
            </GlowCard>
          </aside>
        </Container>
      </section>
    </>
  );
}
