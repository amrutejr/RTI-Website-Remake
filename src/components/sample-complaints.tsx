import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Check } from "lucide-react";

const sampleComplaintsList = [
  {
    id: "road",
    text: "Why has the village road not been repaired for over three years?",
    category: "Infrastructure & Roads",
    ministry: "Ministry of Road Transport and Highways",
    legalDraftPreview: "Provide copies of all sanctioned road repair tenders, inspection logs, contractor payment records, and delay penalty notices for the village access road from 2023 to 2026.",
  },
  {
    id: "pension",
    text: "What is the status of pensions due to senior citizens in my district?",
    category: "Social Justice & Welfare",
    ministry: "Ministry of Social Justice and Empowerment",
    legalDraftPreview: "Provide certified records of pending senior citizen pension disbursements, monthly fund allocation registers, and list of beneficiary backlog cases for the current district.",
  },
  {
    id: "water",
    text: "Please provide the maintenance records and water supply complaints for my area.",
    category: "Water & Public Utilities",
    ministry: "Ministry of Jal Shakti",
    legalDraftPreview: "Provide certified copies of daily water pressure inspection logs, maintenance expenditure sheets, and citizen grievance redressal records for the past 12 months.",
  },
];

export function SampleComplaints({
  onSelect,
  className = "",
}: {
  onSelect?: (text: string) => void;
  className?: string;
}) {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    const item = sampleComplaintsList[index];
    if (onSelect && item) {
      onSelect(item.text);
    }
  };

  const handleLaunchDraft = () => {
    void navigate({
      to: "/maya",
    });
  };

  return (
    <div className={`surface-card p-6 md:p-8 ${className}`}>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-eyebrow text-muted-foreground">Sample Complaints</p>
        <span className="text-xs text-muted-foreground">Click to preview</span>
      </div>

      <div className="space-y-3">
        {sampleComplaintsList.map((complaint, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={complaint.id}
              type="button"
              onClick={() => handleCardClick(index)}
              className={`w-full rounded-lg border p-4 text-left text-sm leading-relaxed transition-all duration-200 ${
                isSelected
                  ? "border-saffron bg-accent text-foreground shadow-sm ring-1 ring-saffron"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                    isSelected
                      ? "border-saffron bg-saffron text-saffron-foreground"
                      : "border-input bg-background"
                  }`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5" aria-hidden />}
                </div>
                <p className="flex-1 text-sm font-medium text-foreground">{complaint.text}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive AI Preview for the selected complaint */}
      <div className="mt-6 rounded-lg border-l-2 border-saffron bg-secondary p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-saffron" aria-hidden />
          <span>AI Legal Formulation Preview</span>
        </div>
        <p className="mt-2.5 rounded-md border border-border bg-background p-3.5 font-mono text-[12.5px] leading-relaxed text-foreground">
          {sampleComplaintsList[selectedIndex]?.legalDraftPreview}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Target authority: <strong className="font-semibold text-foreground">{sampleComplaintsList[selectedIndex]?.ministry}</strong>
          </span>
          <button
            type="button"
            onClick={handleLaunchDraft}
            className="btn-base btn-saffron !py-2 !text-xs"
          >
            File with Maya
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
