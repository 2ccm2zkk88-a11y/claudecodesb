import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import { business, contact } from "../config/site";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Policy" description={`Privacy Policy for ${business.name}.`} />
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-cf-gray">
            <p className="text-cf-gray-dim">
              This is a placeholder Privacy Policy for {business.name}. It should be reviewed and finalized —
              ideally with legal guidance — before the site collects any personal information in production.
            </p>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Information We Collect</h2>
              <p>
                When you submit a quote request or contact form on this website, we collect the information you
                provide, such as your name, organization, email address, and details about your project.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">How We Use Information</h2>
              <p>
                Information submitted through this website is used solely to respond to your inquiry and provide
                the services you've requested. We do not sell your information to third parties.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Cookies & Analytics</h2>
              <p>
                This placeholder policy does not describe specific cookie or analytics usage. If analytics or
                tracking tools are added to this site, this section should be updated accordingly.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Contact</h2>
              <p>
                Questions about this policy can be sent to{" "}
                <a href={`mailto:${contact.email}`} className="text-cf-blue-bright hover:underline">
                  {contact.email}
                </a>
                .
              </p>
            </div>

            <p className="text-xs text-cf-gray-dim">Last updated: placeholder — update upon finalizing this policy.</p>
          </div>
        </Container>
      </section>
    </>
  );
}
