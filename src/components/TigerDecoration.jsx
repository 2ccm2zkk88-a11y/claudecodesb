export default function TigerDecoration() {
  return (
    <img
      src="/tiger.jpg"
      alt=""
      aria-hidden="true"
      className="fixed left-0 bottom-0 pointer-events-none select-none hidden md:block"
      style={{
        width: "min(30vw, 420px)",
        height: "auto",
        opacity: 0.9,
        zIndex: 0,
        maskImage: "linear-gradient(to right, black 55%, transparent 95%)",
        WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 95%)",
      }}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
