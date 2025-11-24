import React, { useState } from "react";
import RequirementForm from "../../components/DemandSide/RequirementForm";
import RequirementSummary from "../../components/DemandSide/RequirementSummary";
import MatchesPage from "../../components/DemandSide/MatchesPage";
import FlipUINavbar from "../../components/DemandSide/FlipUINavbar";

export default function RequirementPage() {
  const [submittedData, setSubmittedData] = useState(null);
  const [view, setView] = useState("form");

  return (
    <>
    
         <FlipUINavbar onPostRequirementClick={() => setView("form")} />
    <div className="w-full bg-gray-50 flex items-center justify-center p-6">
      {view === "form" && (
        <RequirementForm
          onSubmit={(data) => {
            setSubmittedData(data);
            setView("summary");
          }}
          initialData={submittedData}
        />
      )}

      {view === "summary" && submittedData && (
        <RequirementSummary
          data={submittedData}
          onEdit={() => setView("form")}
          onTrackMatches={() => setView("matches")}
        />
      )}

      {view === "matches" && submittedData && (
        <MatchesPage userRequirement={submittedData} />
      )}
    </div>
    </>
      
  );
}
