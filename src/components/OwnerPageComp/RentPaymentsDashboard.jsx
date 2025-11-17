import React, { useEffect, useState } from "react";
import { fetchAllRentPayments } from "../../api/OwnerRentApi";

import PropertyDetailsPage from "./RentPaymentDetails/PropertyDetailsPage";
import TenantOwnerDetailsPage from "./RentPaymentDetails/TenantOwnerDetailsPage";

export default function RentPaymentsDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetchAllRentPayments()
      .then((res) => {
        console.log("API Response:", res.data);
        setPayments(res.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ✅ When a property card is clicked
  const handleSelectProperty = (item) => {
    setSelectedProperty(item);
  };

  // ✅ When Back button is pressed
  const handleBack = () => {
    setSelectedProperty(null);
  };

  // ✅ Loading state
  if (loading)
    return (
      <p className="text-center mt-10 animate-pulse">
        Loading rent payments...
      </p>
    );

if (selectedProperty) {
  return (
    <TenantOwnerDetailsPage
      data={{
        tenants: selectedProperty.tenants.map((tenant) => ({
          ...tenant,
          occupancy: selectedProperty.occupancy,
          room_label: selectedProperty.property?.title,
        })),
        property: selectedProperty.property,
        owner: selectedProperty.owner,
        occupancy: selectedProperty.occupancy,
      }}
      onBack={handleBack}
    />
  );
}



  // ✅ Default → show property cards
  return (
    <PropertyDetailsPage
      payments={payments.map((p) => ({
        ...p,
        property: {
          ...p.property,
          occupancy: p.occupancy,
        },
      }))}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      locationFilter={locationFilter}
      setLocationFilter={setLocationFilter}
      onSelectProperty={handleSelectProperty}
    />
  );
}
