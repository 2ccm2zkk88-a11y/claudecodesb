export default function TigerDecoration() {
  return (
    <img
      src="/tiger.png"
      alt=""
      aria-hidden="true"
      className="fixed left-0 bottom-0 pointer-events-none select-none hidden md:block"
      style={{
        width: "min(26vw, 380px)",
        height: "auto",
        opacity: 0.96,
        zIndex: 0,
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.45))",
      }}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
