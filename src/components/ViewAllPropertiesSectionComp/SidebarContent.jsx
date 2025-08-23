import React from "react";
import Input from "./Input";
import Select from "./Select";

const SidebarContent = React.memo(({ filters, handleFilterChange }) => {
  return (
    <div className="space-y-5 text-sm ">
      {/* Property Type Filter */}

      {/* Gender Filter */}
      <Select
        label="Gender"
        name="gender"
        opts={[
          ["", "Any"],
          ["male", "Male"],
          ["female", "Female"],
          ["unisex", "Unisex"],
        ]}
        filters={filters}
        handleChange={handleFilterChange}
      />

      {/* Occupancy Filter */}
      <Select
        label="Occupancy"
        name="occupancy"
        opts={[
          ["", "Any"],
          ["single", "Single"],
          ["double", "Double"],
          ["triple", "Triple"],
        ]}
        filters={filters}
        handleChange={handleFilterChange}
      />

      {/* BHK Filter */}
      <Select
        label="BHK"
        name="bhk"
        opts={[
          ["", "Any"],
          ["1", "1 BHK"],
          ["1.5", "1.5 BHK"],
          ["2", "2 BHK"],
          ["2.5", "2.5 BHK"],
          ["3", "3 BHK"],
          ["4", "4 BHK+"],
        ]}
        filters={filters}
        handleChange={handleFilterChange}
      />

      {/* Budget Range */}
      <div>
        <label className="block mb-2 text-gray-700">Budget Range (₹)</label>
        <div className="flex gap-2">
          <Input
            name="minPrice"
            type="number"
            placeholder="Min"
            filters={filters}
            handleChange={handleFilterChange}
          />
          <Input
            name="maxPrice"
            type="number"
            placeholder="Max"
            filters={filters}
            handleChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
});

export default SidebarContent;
