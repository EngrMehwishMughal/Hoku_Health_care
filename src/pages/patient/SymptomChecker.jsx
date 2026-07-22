import {
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Info,
  LoaderCircle,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Thermometer,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  checkPatientSymptoms,
} from "@/services/patientApi";

const HOKU_PRIMARY = "#1E63C6";
const HOKU_PRIMARY_DARK = "#174FA0";

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Chest discomfort",
  "Shortness of breath",
  "Nausea",
  "Vomiting",
  "Stomach pain",
  "Dizziness",
  "Fatigue",
  "Body aches",
  "Skin rash",
  "Back pain",
  "Joint pain",
  "Runny nose",
];

const durationOptions = [
  "Less than 24 hours",
  "1–3 days",
  "4–7 days",
  "1–2 weeks",
  "More than 2 weeks",
];

const severityOptions = [
  {
    value: "mild",
    label: "Mild",
    description:
      "Noticeable but daily activities are mostly unaffected.",
  },
  {
    value: "moderate",
    label: "Moderate",
    description:
      "Symptoms interfere with some normal activities.",
  },
  {
    value: "severe",
    label: "Severe",
    description:
      "Symptoms significantly affect normal activities.",
  },
];

const emergencyWarningSigns = [
  "Severe difficulty breathing",
  "Severe or persistent chest pain",
  "Loss of consciousness",
  "Sudden confusion or difficulty speaking",
  "Severe uncontrolled bleeding",
  "Seizure",
];

const initialForm = {
  selectedSymptoms: [],
  customSymptom: "",
  duration: "",
  severity: "",
  ageGroup: "",
  temperature: "",
  additionalDetails: "",
  warningSigns: [],
};

function getErrorMessage(
  error,
  fallback = "Unable to review your symptoms."
) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function normalizeUrgency(value) {
  const urgency = String(
    value || "medium"
  ).toLowerCase();

  if (
    [
      "emergency",
      "critical",
      "urgent",
      "immediate",
      "very_high",
      "very high",
    ].includes(urgency)
  ) {
    return "emergency";
  }

  if (
    [
      "high",
      "severe",
      "prompt",
      "soon",
    ].includes(urgency)
  ) {
    return "high";
  }

  if (
    [
      "low",
      "mild",
      "routine",
      "self_care",
      "self care",
    ].includes(urgency)
  ) {
    return "low";
  }

  return "medium";
}

function normalizeRecommendations(
  value
) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (
          typeof item === "string"
        ) {
          return item.trim();
        }

        return (
          item?.text ||
          item?.message ||
          item?.recommendation ||
          item?.title ||
          ""
        ).trim();
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|•|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeSymptomResult(
  payload
) {
  const root =
    payload?.result ||
    payload?.analysis ||
    payload?.assessment ||
    payload?.data?.result ||
    payload?.data?.analysis ||
    payload?.data?.assessment ||
    payload?.data ||
    payload ||
    {};

  const level = normalizeUrgency(
    root?.urgency_level ||
      root?.urgency ||
      root?.risk_level ||
      root?.riskLevel ||
      root?.severity ||
      root?.level
  );

  const recommendations =
    normalizeRecommendations(
      root?.recommendations ||
        root?.next_steps ||
        root?.nextSteps ||
        root?.advice ||
        root?.actions
    );

  const defaultRecommendations = [
    "Monitor any change in symptom severity or duration.",
    "Arrange a consultation with a qualified healthcare professional for proper assessment.",
    "Follow your existing medical instructions and prescribed medicines.",
    "Seek urgent medical care if breathing difficulty, severe chest pain, fainting, confusion, or other emergency symptoms develop.",
  ];

  const defaultTitles = {
    emergency:
      "Urgent medical attention may be required",

    high:
      "A prompt medical review is recommended",

    medium:
      "Consider arranging a healthcare consultation",

    low:
      "Continue monitoring your symptoms",
  };

  return {
    level,

    title:
      root?.title ||
      root?.heading ||
      root?.recommendation_title ||
      defaultTitles[level],

    summary:
      root?.summary ||
      root?.message ||
      root?.assessment_summary ||
      root?.description ||
      "The information you provided has been reviewed. This result is general guidance and is not a medical diagnosis.",

    recommendations:
      recommendations.length > 0
        ? recommendations
        : defaultRecommendations,

    possibleCauses:
      normalizeRecommendations(
        root?.possible_causes ||
          root?.possibleCauses ||
          root?.conditions
      ),

    disclaimer:
      root?.disclaimer ||
      "This assessment cannot replace a consultation, physical examination, or diagnosis by a qualified healthcare professional.",
  };
}

function getResultClasses(level) {
  if (level === "emergency") {
    return {
      container:
        "border-red-200 bg-red-50",

      icon:
        "bg-red-100 text-red-700",
    };
  }

  if (level === "high") {
    return {
      container:
        "border-amber-200 bg-amber-50",

      icon:
        "bg-amber-100 text-amber-700",
    };
  }

  if (level === "medium") {
    return {
      container:
        "border-blue-200 bg-blue-50",

      icon:
        "bg-blue-100 text-blue-700",
    };
  }

  return {
    container:
      "border-emerald-200 bg-emerald-50",

    icon:
      "bg-emerald-100 text-emerald-700",
  };
}

function StepIndicator({
  number,
  title,
  currentStep,
}) {
  const isActive =
    currentStep === number;

  const isComplete =
    currentStep > number;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${
          isComplete
            ? "bg-emerald-100 text-emerald-700"
            : isActive
              ? "bg-[#1E63C6] text-white"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {isComplete ? (
          <Check className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <div className="hidden min-w-0 sm:block">
        <p
          className={`truncate text-xs font-bold ${
            isActive
              ? "text-slate-900"
              : "text-slate-500"
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6]/10 text-[#1E63C6]">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6]/10 text-[#1E63C6]">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold capitalize text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function SymptomChecker() {
  const [form, setForm] =
    useState(initialForm);

  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [result, setResult] =
    useState(null);

  const selectedSymptomsText =
    useMemo(
      () =>
        form.selectedSymptoms
          .length > 0
          ? form.selectedSymptoms.join(
              ", "
            )
          : "No symptoms selected",
      [form.selectedSymptoms]
    );

  const hasEmergencyWarning =
    form.warningSigns.length > 0;

  const toggleSymptom = (
    symptom
  ) => {
    setForm((currentForm) => {
      const alreadySelected =
        currentForm.selectedSymptoms.includes(
          symptom
        );

      return {
        ...currentForm,

        selectedSymptoms:
          alreadySelected
            ? currentForm.selectedSymptoms.filter(
                (item) =>
                  item !== symptom
              )
            : [
                ...currentForm.selectedSymptoms,
                symptom,
              ],
      };
    });

    setFormError("");
    setResult(null);
  };

  const addCustomSymptom = () => {
    const symptom =
      form.customSymptom.trim();

    if (!symptom) {
      return;
    }

    const alreadyExists =
      form.selectedSymptoms.some(
        (item) =>
          item.toLowerCase() ===
          symptom.toLowerCase()
      );

    if (alreadyExists) {
      toast.info(
        "This symptom is already selected."
      );

      return;
    }

    setForm((currentForm) => ({
      ...currentForm,

      selectedSymptoms: [
        ...currentForm.selectedSymptoms,
        symptom,
      ],

      customSymptom: "",
    }));

    setFormError("");
    setResult(null);
  };

  const removeSymptom = (
    symptom
  ) => {
    setForm((currentForm) => ({
      ...currentForm,

      selectedSymptoms:
        currentForm.selectedSymptoms.filter(
          (item) =>
            item !== symptom
        ),
    }));

    setResult(null);
  };

  const toggleWarningSign = (
    warningSign
  ) => {
    setForm((currentForm) => {
      const selected =
        currentForm.warningSigns.includes(
          warningSign
        );

      return {
        ...currentForm,

        warningSigns: selected
          ? currentForm.warningSigns.filter(
              (item) =>
                item !== warningSign
            )
          : [
              ...currentForm.warningSigns,
              warningSign,
            ],
      };
    });

    setFormError("");
    setResult(null);
  };

  const handleChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setFormError("");
    setResult(null);
  };

  const selectSeverity = (
    severity
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      severity,
    }));

    setFormError("");
    setResult(null);
  };

  const showValidationError = (
    message
  ) => {
    setFormError(message);
    toast.error(message);

    return false;
  };

  const validateStep = (step) => {
    if (
      step === 1 &&
      form.selectedSymptoms
        .length === 0
    ) {
      return showValidationError(
        "Please select at least one symptom."
      );
    }

    if (
      step === 2 &&
      !form.duration
    ) {
      return showValidationError(
        "Please select how long you have experienced these symptoms."
      );
    }

    if (
      step === 2 &&
      !form.severity
    ) {
      return showValidationError(
        "Please select the symptom severity."
      );
    }

    if (
      form.temperature &&
      (Number(form.temperature) < 30 ||
        Number(form.temperature) > 45)
    ) {
      return showValidationError(
        "Please enter a valid temperature between 30°C and 45°C."
      );
    }

    return true;
  };

  const goToNextStep = () => {
    if (
      !validateStep(currentStep)
    ) {
      return;
    }

    setCurrentStep((step) =>
      Math.min(step + 1, 3)
    );

    setFormError("");
  };

  const goToPreviousStep =
    () => {
      setCurrentStep((step) =>
        Math.max(step - 1, 1)
      );

      setFormError("");
    };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    if (hasEmergencyWarning) {
      setResult({
        level: "emergency",

        title:
          "Urgent medical attention may be required",

        summary:
          "You selected one or more emergency warning signs. Do not rely on this symptom checker for urgent care.",

        recommendations: [
          "Contact your local emergency service or nearest emergency department immediately.",
          "Ask another person to stay with you if possible.",
          "Do not drive yourself if you feel faint, confused, severely short of breath, or very unwell.",
        ],

        possibleCauses: [],

        disclaimer:
          "Emergency warning signs require immediate professional medical assessment.",
      });

      toast.error(
        "Emergency warning signs detected. Seek urgent medical assistance."
      );

      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setResult(null);

      const payload = {
        symptoms:
          form.selectedSymptoms,

        duration:
          form.duration,

        severity:
          form.severity,

        age_group:
          form.ageGroup || null,

        temperature:
          form.temperature
            ? Number(
                form.temperature
              )
            : null,

        additional_details:
          form.additionalDetails.trim(),

        emergency_warning_signs:
          form.warningSigns,
      };

      const response =
        await checkPatientSymptoms(
          payload
        );

      const normalizedResult =
        normalizeSymptomResult(
          response
        );

      setResult(
        normalizedResult
      );

      toast.success(
        "Your symptom information has been reviewed."
      );
    } catch (error) {
      console.error(
        "Symptom checker error:",
        error
      );

      const message =
        getErrorMessage(error);

      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetChecker = () => {
    setForm(initialForm);
    setCurrentStep(1);
    setFormError("");
    setResult(null);
  };

  const resultClasses =
    result
      ? getResultClasses(
          result.level
        )
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
              <Bot className="h-6 w-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#61720E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7CF35]" />

                AI healthcare guidance
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                AI Symptom Checker
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Describe your symptoms to
                receive general guidance
                about appropriate next
                steps.
              </p>
            </div>
          </div>

          <Link
            to="/patient/book-appointment"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0] sm:w-auto"
          >
            <Stethoscope className="h-4 w-4" />

            Book Appointment
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="flex items-start gap-3 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4 text-amber-800 sm:px-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-bold">
            This tool does not provide a
            medical diagnosis
          </p>

          <p className="mt-1 text-xs leading-6">
            The result is general
            information only. Always consult
            a qualified healthcare
            professional for diagnosis,
            treatment, or urgent medical
            concerns.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-3 gap-3">
          <StepIndicator
            number={1}
            title="Select symptoms"
            currentStep={currentStep}
          />

          <StepIndicator
            number={2}
            title="Symptom details"
            currentStep={currentStep}
          />

          <StepIndicator
            number={3}
            title="Safety review"
            currentStep={currentStep}
          />
        </div>
      </section>

      {formError && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          <AlertCircle className="mt-1 h-4 w-4 shrink-0" />

          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
          <div>
            {/* Step 1 */}
            {currentStep === 1 && (
              <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading
                  icon={Search}
                  title="What symptoms are you experiencing?"
                  description="Choose all symptoms that apply or add your own."
                />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {commonSymptoms.map(
                    (symptom) => {
                      const isSelected =
                        form.selectedSymptoms.includes(
                          symptom
                        );

                      return (
                        <button
                          key={symptom}
                          type="button"
                          disabled={
                            submitting
                          }
                          onClick={() =>
                            toggleSymptom(
                              symptom
                            )
                          }
                          aria-pressed={
                            isSelected
                          }
                          className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isSelected
                              ? "border-[#1E63C6] bg-[#1E63C6] text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5 hover:text-[#1E63C6]"
                          }`}
                        >
                          {symptom}
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="custom-symptom"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Add another symptom
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="custom-symptom"
                      type="text"
                      name="customSymptom"
                      value={
                        form.customSymptom
                      }
                      onChange={handleChange}
                      disabled={submitting}
                      onKeyDown={(
                        event
                      ) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          event.preventDefault();
                          addCustomSymptom();
                        }
                      }}
                      placeholder="Enter another symptom"
                      className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:bg-slate-50"
                    />

                    <button
                      type="button"
                      onClick={
                        addCustomSymptom
                      }
                      disabled={submitting}
                      className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#1E63C6]/20 bg-[#1E63C6]/5 px-5 text-sm font-semibold text-[#1E63C6] transition hover:bg-[#1E63C6]/10 disabled:opacity-50"
                    >
                      Add Symptom
                    </button>
                  </div>
                </div>

                {form.selectedSymptoms
                  .length > 0 && (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                      Selected symptoms
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.selectedSymptoms.map(
                        (symptom) => (
                          <span
                            key={symptom}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                          >
                            {symptom}

                            <button
                              type="button"
                              disabled={
                                submitting
                              }
                              onClick={() =>
                                removeSymptom(
                                  symptom
                                )
                              }
                              aria-label={`Remove ${symptom}`}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading
                  icon={Activity}
                  title="Tell us more about your symptoms"
                  description="Provide duration, severity, and any useful details."
                />

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="symptom-duration"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      How long have you had
                      these symptoms?

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      id="symptom-duration"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      disabled={submitting}
                      className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:bg-slate-50"
                    >
                      <option value="">
                        Select duration
                      </option>

                      {durationOptions.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700">
                      Symptom severity

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </p>

                    <div className="grid gap-3 md:grid-cols-3">
                      {severityOptions.map(
                        (option) => {
                          const isSelected =
                            form.severity ===
                            option.value;

                          return (
                            <button
                              key={
                                option.value
                              }
                              type="button"
                              disabled={
                                submitting
                              }
                              onClick={() =>
                                selectSeverity(
                                  option.value
                                )
                              }
                              aria-pressed={
                                isSelected
                              }
                              className={`rounded-2xl border p-4 text-left transition disabled:opacity-60 ${
                                isSelected
                                  ? "border-[#1E63C6] bg-[#1E63C6]/5"
                                  : "border-slate-200 hover:border-[#1E63C6]/25 hover:bg-slate-50"
                              }`}
                            >
                              <h3 className="text-sm font-bold text-slate-900">
                                {
                                  option.label
                                }
                              </h3>

                              <p className="mt-2 text-xs leading-5 text-slate-500">
                                {
                                  option.description
                                }
                              </p>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="age-group"
                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                      >
                        Age group
                      </label>

                      <select
                        id="age-group"
                        name="ageGroup"
                        value={
                          form.ageGroup
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          submitting
                        }
                        className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:bg-slate-50"
                      >
                        <option value="">
                          Select age group
                        </option>

                        <option value="child">
                          Child
                        </option>

                        <option value="teen">
                          Teenager
                        </option>

                        <option value="adult">
                          Adult
                        </option>

                        <option value="older-adult">
                          Older adult
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="temperature"
                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                      >
                        Temperature in °C
                      </label>

                      <div className="relative">
                        <Thermometer className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="temperature"
                          type="number"
                          name="temperature"
                          value={
                            form.temperature
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            submitting
                          }
                          min="30"
                          max="45"
                          step="0.1"
                          placeholder="For example: 38.2"
                          className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="additional-details"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      Additional details
                    </label>

                    <textarea
                      id="additional-details"
                      name="additionalDetails"
                      value={
                        form.additionalDetails
                      }
                      onChange={handleChange}
                      disabled={submitting}
                      rows={5}
                      maxLength={600}
                      placeholder="Describe when the symptoms started, what makes them better or worse, and any relevant health information..."
                      className="min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:bg-slate-50"
                    />

                    <p className="mt-1.5 text-right text-xs text-slate-400">
                      {
                        form
                          .additionalDetails
                          .length
                      }
                      /600
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeading
                  icon={ShieldAlert}
                  title="Check for emergency warning signs"
                  description="Select any warning signs that apply right now."
                />

                <div className="space-y-3">
                  {emergencyWarningSigns.map(
                    (warningSign) => {
                      const isSelected =
                        form.warningSigns.includes(
                          warningSign
                        );

                      return (
                        <label
                          key={warningSign}
                          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                            isSelected
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 bg-white hover:border-red-200 hover:bg-red-50/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={
                              isSelected
                            }
                            disabled={
                              submitting
                            }
                            onChange={() =>
                              toggleWarningSign(
                                warningSign
                              )
                            }
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-red-600"
                          />

                          <span className="text-sm font-semibold text-slate-700">
                            {warningSign}
                          </span>
                        </label>
                      );
                    }
                  )}
                </div>

                {hasEmergencyWarning && (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                      <p className="text-sm font-bold">
                        Emergency warning
                      </p>

                      <p className="mt-1 text-xs leading-6">
                        One or more urgent
                        warning signs have
                        been selected. Seek
                        immediate medical
                        assistance rather
                        than waiting for an
                        online result.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Navigation */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={
                  goToPreviousStep
                }
                disabled={
                  currentStep === 1 ||
                  submitting
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[#1E63C6]/30 hover:text-[#1E63C6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />

                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={
                    submitting
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0] disabled:opacity-60"
                >
                  Continue

                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor:
                      submitting
                        ? HOKU_PRIMARY_DARK
                        : HOKU_PRIMARY,
                  }}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />

                      Reviewing symptoms...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />

                      Review Symptoms
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Symptom Summary
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review the information
                    entered so far.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B7CF35]/20 text-[#61720E]">
                  <HeartPulse className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 divide-y divide-slate-100">
                <SummaryItem
                  icon={Activity}
                  label="Symptoms"
                  value={
                    selectedSymptomsText
                  }
                />

                <SummaryItem
                  icon={Clock3}
                  label="Duration"
                  value={
                    form.duration ||
                    "Not selected"
                  }
                />

                <SummaryItem
                  icon={AlertCircle}
                  label="Severity"
                  value={
                    form.severity ||
                    "Not selected"
                  }
                />

                <SummaryItem
                  icon={ShieldAlert}
                  label="Warning signs"
                  value={
                    form.warningSigns
                      .length > 0
                      ? `${form.warningSigns.length} selected`
                      : "None selected"
                  }
                />
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#1E63C6]/5 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1E63C6]" />

                <p className="text-xs leading-5 text-slate-600">
                  This checker cannot
                  confirm a condition or
                  replace an examination
                  by a qualified healthcare
                  professional.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </form>

      {/* Result */}
      {result && (
        <section
          className={`rounded-[24px] border p-5 shadow-sm sm:p-6 lg:p-7 ${resultClasses.container}`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex max-w-3xl items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${resultClasses.icon}`}
              >
                {result.level ===
                "emergency" ? (
                  <ShieldAlert className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="h-6 w-6" />
                )}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  General guidance
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {result.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {result.summary}
                </p>

                {result.possibleCauses
                  ?.length > 0 && (
                  <div className="mt-5 rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Possible considerations
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.possibleCauses.map(
                        (cause) => (
                          <span
                            key={cause}
                            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                          >
                            {cause}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-5 space-y-3">
                  {result.recommendations.map(
                    (
                      recommendation,
                      index
                    ) => (
                      <div
                        key={`${recommendation}-${index}`}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1E63C6]" />

                        <p className="text-sm leading-6 text-slate-700">
                          {
                            recommendation
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>

                {result.disclaimer && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/70 p-4">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                    <p className="text-xs leading-5 text-slate-600">
                      {result.disclaimer}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/patient/book-appointment"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0]"
              >
                <Stethoscope className="h-4 w-4" />

                Book Appointment
              </Link>

              <button
                type="button"
                onClick={resetChecker}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[#1E63C6]/30 hover:text-[#1E63C6]"
              >
                <RotateCcw className="h-4 w-4" />

                Start Again
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}