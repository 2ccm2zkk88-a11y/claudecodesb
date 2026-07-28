import { PALETTE } from "../theme";

const STATUS_COLORS = {
  Submitted: PALETTE.sub,
  "In Review": PALETTE.warning,
  Published: PALETTE.success,
  Declined: PALETTE.danger,
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || PALETTE.sub;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shrink-0"
      style={{ color: "#fff", backgroundColor: color }}
    >
      {status}
    </span>
  );
}
