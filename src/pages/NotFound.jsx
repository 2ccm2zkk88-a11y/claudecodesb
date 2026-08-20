import SEO from "../components/SEO";
import Container from "../components/Container";
import Button from "../components/Button";
import CircuitBackground from "../components/CircuitBackground";
import FalconMark from "../components/FalconMark";

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noIndex />
      <section className="relative flex min-h-[70vh] items-center overflow-hidden py-20">
        <CircuitBackground variant="radial" opacity={0.16} />
        <Container className="relative flex flex-col items-center gap-6 text-center">
          <FalconMark size={72} />
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.3em] text-cf-blue-bright">404</p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">This page took a wrong turn.</h1>
          <p className="max-w-md text-cf-gray">
            The page you're looking for doesn't exist or may have moved. Let's get you back on track.
          </p>
          <Button to="/" icon={false}>
            Back to Home
          </Button>
        </Container>
      </section>
    </>
  );
}
