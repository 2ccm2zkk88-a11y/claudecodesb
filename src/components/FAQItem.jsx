import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-cf-border last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-4 py-5 text-left text-white transition-colors hover:text-cf-blue-bright"
        >
          <span className="text-base font-semibold">{question}</span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`shrink-0 text-cf-gray transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={`grid overflow-hidden transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="text-sm leading-relaxed text-cf-gray">{answer}</p>
        </div>
      </div>
    </div>
  );
}
