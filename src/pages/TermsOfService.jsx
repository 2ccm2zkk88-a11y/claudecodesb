import SEO from "../components/SEO";
import Container from "../components/Container";
import PageHero from "../components/PageHero";
import { business, contact } from "../config/site";

export default function TermsOfService() {
  return (
    <>
      <SEO title="Terms of Service" description={`Terms of Service for ${business.name}.`} />
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-cf-gray">
            <p className="text-cf-gray-dim">
              This is a placeholder Terms of Service page for {business.name}. It should be reviewed and finalized
              — ideally with legal guidance — before this site is used to formally engage clients.
            </p>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Services</h2>
              <p>
                {business.name} provides website development, redesign, management, maintenance, and related
                technical support. Specific project scope, deliverables, and pricing are agreed upon with each
                client individually before work begins.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Website Management Plans</h2>
              <p>
                Monthly website management plans are billed on a recurring basis and cover the scope of work
                described for each plan. Work beyond a plan's scope is discussed and, where applicable, quoted
                separately.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Client Responsibilities</h2>
              <p>
                Clients are responsible for providing accurate content, timely feedback, and any necessary account
                access required to complete requested work.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Limitation of Liability</h2>
              <p>
                This placeholder does not constitute a binding limitation-of-liability clause. A finalized version
                of these terms should be prepared before being relied upon in client agreements.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Contact</h2>
              <p>
                Questions about these terms can be sent to{" "}
                <a href={`mailto:${contact.email}`} className="text-cf-blue-bright hover:underline">
                  {contact.email}
                </a>
                .
              </p>
            </div>

            <p className="text-xs text-cf-gray-dim">Last updated: placeholder — update upon finalizing these terms.</p>
          </div>
        </Container>
      </section>
    </>
  );
}
