import React from "react";
import FeaturePropertyCard from "./FeaturePropertyCard";

export default function FeaturePropertySection({
  properties = [],
  markFn,
  fetchProperties,
  title = "Listings",
  type = "newly_listed",
}) {
  const CONFIG = {
    newly_listed: {
      flag: "is_newly_listed",
      position: "newly_listed_position",
    },
    top_pg: {
      flag: "is_top_pg",
      position: "top_pg_position",
    },
  };

  const { flag, position } = CONFIG[type];

const approved = properties.filter((p) => {
  const isApproved = p.status === "approved";

  if (type === "top_pg") {
    return isApproved && p.looking_for === "pg";
  }

  return isApproved;
});

  return (
    <section>
      <h2 className="text-xl mb-4">{title}</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approved
          .slice()
          .sort((a, b) => {
            const aFlag = a[flag];
            const bFlag = b[flag];

            const aPos = a[position];
            const bPos = b[position];

            if (aFlag && bFlag) {
              return (aPos || 9999) - (bPos || 9999);
            }

            if (aFlag) return -1;
            if (bFlag) return 1;

            return 0;
          })
          .map((property) => (
            <FeaturePropertyCard
              key={property.id}
              property={property}
              markFn={markFn}
              fetchProperties={fetchProperties}
              allProperties={properties}
              type={type}
            />
          ))}
      </div>
    </section>
  );
}