import { useState } from "react";
import { Send, CheckCircle2, ArrowRight, Mail } from "lucide-react";
import { SUBMISSION_TYPES, DEPARTMENTS, PRIORITIES } from "../data/submissionTypes";
import { nextReference } from "../lib/submissions";
import { sendSubmissionEmail } from "../lib/email";
import { PALETTE, CARD_SHADOW, RING_STYLE } from "../theme";

const cardStyle = { backgroundColor: "#fff", border: `1.5px solid ${PALETTE.cardBorder}`, boxShadow: CARD_SHADOW };

const ATTACHMENT_EMAILS = ["srbanks@ga.aliefisd.net", "lrnieman@ga.aliefisd.net"];

const inputClass = "w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus-visible:ring-2 transition-colors";
const inputStyle = { border: `1.5px solid ${PALETTE.border}`, color: PALETTE.ink, backgroundColor: "#fff", ...RING_STYLE };

function Field({ label, required, error, id, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-1" style={{ color: PALETTE.ink }}>
        {label}
        {required && <span style={{ color: PALETTE.danger }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1" style={{ color: PALETTE.danger }}>
          {error}
        </p>
      )}
    </div>
  );
}

function DynamicField({ field, value, onChange, error }) {
  const id = `field-${field.name}`;
  if (field.type === "textarea") {
    return (
      <Field label={field.label} required={field.required} error={error} id={id}>
        <textarea
          id={id}
          rows={4}
          value={value || ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </Field>
    );
  }
  if (field.type === "select") {
    return (
      <Field label={field.label} required={field.required} error={error} id={id}>
        <select id={id} value={value || ""} onChange={(e) => onChange(field.name, e.target.value)} className={inputClass} style={inputStyle}>
          <option value="">Select one...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>
    );
  }
  if (field.type === "checkbox") {
    return (
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(field.name, e.target.checked)} className="mt-1" />
          <label htmlFor={id} className="text-sm" style={{ color: PALETTE.ink }}>
            {field.label}
            {field.required && <span style={{ color: PALETTE.danger }}> *</span>}
          </label>
        </div>
        {error && (
          <p className="text-xs mt-1" style={{ color: PALETTE.danger }}>
            {error}
          </p>
        )}
      </div>
    );
  }
  return (
    <Field label={field.label} required={field.required} error={error} id={id}>
      <input
        id={id}
        type={field.type}
        value={value || ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={inputClass}
        style={inputStyle}
      />
    </Field>
  );
}

function TypePicker({ selectedId, onSelect, error }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold mb-2" style={{ color: PALETTE.ink }}>
        What are you submitting?<span style={{ color: PALETTE.danger }}> *</span>
      </p>
      <div role="radiogroup" aria-label="Submission type" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SUBMISSION_TYPES.map((type) => {
          const Icon = type.icon;
          const active = selectedId === type.id;
          return (
            <button
              key={type.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(type.id)}
              className="flex flex-col items-start gap-2 p-3 rounded-xl text-left transition-all focus:outline-none focus-visible:ring-2"
              style={{
                border: `2px solid ${active ? type.color : PALETTE.border}`,
                backgroundColor: active ? type.color + "12" : "#fff",
                ...RING_STYLE,
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: type.color + "20" }}>
                <Icon size={18} style={{ color: type.color }} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: PALETTE.ink }}>
                  {type.label}
                </p>
                <p className="text-xs" style={{ color: PALETTE.sub }}>
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs mt-2" style={{ color: PALETTE.danger }}>
          {error}
        </p>
      )}
    </div>
  );
}

const initialBase = { name: "", email: "", department: "", priority: "standard", neededBy: "", notes: "" };

function validate(base, typeConfig, typeValues) {
  const errors = {};
  if (!base.name.trim()) errors.name = "Enter your name.";
  if (!base.email.trim()) errors.email = "Enter your email.";
  else if (!/^\S+@\S+\.\S+$/.test(base.email)) errors.email = "Enter a valid email address.";
  if (!base.department) errors.department = "Select a department or grade level.";
  if (!typeConfig) errors.type = "Choose a submission type.";
  if (typeConfig) {
    typeConfig.fields.forEach((f) => {
      const v = typeValues[f.name];
      if (f.required && (f.type === "checkbox" ? !v : !String(v || "").trim())) {
        errors[f.name] = "This is required.";
      }
    });
  }
  return errors;
}

export default function RequestForm({ submissions, onSubmit, onViewTrack }) {
  const [base, setBase] = useState(initialBase);
  const [typeId, setTypeId] = useState("");
  const [typeValues, setTypeValues] = useState({});
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [emailResult, setEmailResult] = useState(null);
  const [sending, setSending] = useState(false);

  const typeConfig = SUBMISSION_TYPES.find((t) => t.id === typeId);

  const updateBase = (name, value) => setBase((prev) => ({ ...prev, [name]: value }));
  const updateTypeField = (name, value) => setTypeValues((prev) => ({ ...prev, [name]: value }));

  const selectType = (id) => {
    setTypeId(id);
    setTypeValues({});
    setErrors((prev) => ({ ...prev, type: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(base, typeConfig, typeValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const reference = nextReference(submissions);
    const submission = {
      reference,
      typeId,
      ...base,
      fields: typeValues,
      status: "Submitted",
      submittedAt: new Date().toISOString(),
    };
    onSubmit(submission);

    setSending(true);
    const result = await sendSubmissionEmail(submission, typeConfig.label);
    setSending(false);
    setEmailResult(result);
    setConfirmation(submission);
  };

  const startNew = () => {
    setBase(initialBase);
    setTypeId("");
    setTypeValues({});
    setErrors({});
    setConfirmation(null);
    setEmailResult(null);
  };

  if (confirmation) {
    return (
      <div className="p-6 rounded-2xl text-center" style={cardStyle}>
        <CheckCircle2 size={36} style={{ color: PALETTE.success }} className="mx-auto mb-3" aria-hidden="true" />
        <h2 className="text-lg font-extrabold mb-1" style={{ color: PALETTE.ink }}>
          Request submitted
        </h2>
        <p className="text-sm mb-1" style={{ color: PALETTE.sub }}>
          Reference number{" "}
          <span className="font-mono font-bold" style={{ color: PALETTE.ink }}>
            {confirmation.reference}
          </span>
        </p>
        <p className="text-sm mb-1" style={{ color: PALETTE.sub }}>
          {confirmation.priority === "urgent" ? "We'll take a look within 24-48 hours." : "We'll take a look within 3-5 business days."}
        </p>
        {emailResult?.sent ? (
          <p className="text-xs mb-3" style={{ color: PALETTE.success }}>
            Emailed to Klentzman Tech Team, thank you!
          </p>
        ) : (
          <p className="text-xs mb-3" style={{ color: PALETTE.warning }}>
            Saved, but the email notification couldn't be sent. Please follow up directly with the webmaster team.
          </p>
        )}
        <p className="text-xs mb-6" style={{ color: PALETTE.sub }}>
          Have a file to attach? Email it to {ATTACHMENT_EMAILS.join(" and ")} with reference number{" "}
          <span className="font-mono font-bold" style={{ color: PALETTE.ink }}>
            {confirmation.reference}
          </span>{" "}
          in the subject line.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={startNew}
            className="text-sm font-bold px-4 py-2 rounded-lg focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: PALETTE.orange, color: "#fff", ...RING_STYLE }}
          >
            Submit another request
          </button>
          <button
            type="button"
            onClick={onViewTrack}
            className="text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1 focus:outline-none focus-visible:ring-2"
            style={{ border: `1.5px solid ${PALETTE.navy}`, color: PALETTE.navy, ...RING_STYLE }}
          >
            Track submissions <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="p-6 rounded-2xl mb-4" style={cardStyle}>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: PALETTE.accent }}>
          Your information
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Name" required error={errors.name} id="field-name">
            <input id="field-name" type="text" value={base.name} onChange={(e) => updateBase("name", e.target.value)} className={inputClass} style={inputStyle} autoComplete="name" />
          </Field>
          <Field label="Email" required error={errors.email} id="field-email">
            <input id="field-email" type="email" value={base.email} onChange={(e) => updateBase("email", e.target.value)} className={inputClass} style={inputStyle} autoComplete="email" />
          </Field>
          <Field label="Department / Grade level" required error={errors.department} id="field-department">
            <select id="field-department" value={base.department} onChange={(e) => updateBase("department", e.target.value)} className={inputClass} style={inputStyle}>
              <option value="">Select one...</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Needed live by (optional)" id="field-neededBy">
            <input id="field-neededBy" type="date" value={base.neededBy} onChange={(e) => updateBase("neededBy", e.target.value)} className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <p className="text-sm font-semibold mb-2" style={{ color: PALETTE.ink }}>
          Priority
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mb-2" role="radiogroup" aria-label="Priority">
          {PRIORITIES.map((p) => {
            const active = base.priority === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => updateBase("priority", p.id)}
                className="flex-1 text-left p-3 rounded-lg transition-colors focus:outline-none focus-visible:ring-2"
                style={{ border: `2px solid ${active ? PALETTE.navy : PALETTE.border}`, backgroundColor: active ? PALETTE.navy + "0d" : "#fff", ...RING_STYLE }}
              >
                <p className="text-sm font-bold" style={{ color: PALETTE.ink }}>
                  {p.label}
                </p>
                <p className="text-xs" style={{ color: PALETTE.sub }}>
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 rounded-2xl mb-4" style={cardStyle}>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: PALETTE.accent }}>
          What you're submitting
        </h2>
        <TypePicker selectedId={typeId} onSelect={selectType} error={errors.type} />

        {typeConfig && (
          <div className="pt-2 mt-2" style={{ borderTop: `1.5px solid ${PALETTE.border}` }}>
            {typeConfig.fields.map((f) => (
              <DynamicField key={f.name} field={f} value={typeValues[f.name]} onChange={updateTypeField} error={errors[f.name]} />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 rounded-2xl mb-4" style={cardStyle}>
        <div
          className="flex items-start gap-2.5 p-3.5 rounded-xl mb-4"
          style={{ backgroundColor: PALETTE.orange + "12", border: `1.5px solid ${PALETTE.orange}55` }}
        >
          <Mail size={16} style={{ color: PALETTE.orange }} className="shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs leading-relaxed" style={{ color: PALETTE.ink }}>
            <span className="font-bold">Have a file to attach?</span> This form doesn't accept uploads. Email up to 3 files
            directly to <span className="font-semibold">{ATTACHMENT_EMAILS.join(" and ")}</span>, and include your reference
            number (shown after you submit) in the subject line so we can match them to this request.
          </p>
        </div>

        <Field label="Additional notes (optional)" id="field-notes">
          <textarea
            id="field-notes"
            rows={3}
            value={base.notes}
            onChange={(e) => updateBase("notes", e.target.value)}
            className={inputClass}
            style={inputStyle}
            placeholder="Anything else the webmaster should know"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-lg focus:outline-none focus-visible:ring-2 disabled:opacity-60"
        style={{ backgroundColor: PALETTE.orange, color: "#fff", ...RING_STYLE }}
      >
        <Send size={16} aria-hidden="true" /> {sending ? "Sending..." : "Submit request"}
      </button>
    </form>
  );
}
