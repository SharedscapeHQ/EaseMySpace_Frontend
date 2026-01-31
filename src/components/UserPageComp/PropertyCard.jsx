import React, { useState, useEffect, useRef, Fragment } from "react";
import { FiCheckCircle, FiEdit } from "react-icons/fi";
import {
  FaPhoneAlt,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";
import { HiLocationMarker, HiOutlineRefresh } from "react-icons/hi";
import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updatePropertyAddress } from "../../api/userApi";

const PropertyCard = ({ property, onRaiseQuery, onAddressUpdated }) => {
  const navigate = useNavigate();
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  const bedroomImage =
    property.bedroom_images?.length > 0 ? property.bedroom_images[0] : null;

  return (
    <>
      <div
        style={{ fontFamily: "para_font" }}
        onClick={handleClick}
        className="min-w-[270px] max-w-[340px] group bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex-shrink-0 overflow-hidden relative cursor-pointer shadow-md hover:shadow-lg"
      >
        <div className="relative h-48 w-full p-3 pb-0">
          {bedroomImage ? (
            <div className="h-full w-full overflow-hidden rounded-xl">
              <img
                src={bedroomImage}
                alt={property.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
              No Bedroom Image
            </div>
          )}

          {property.verified && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
              <FiCheckCircle /> Verified
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold truncate">{property.title}</h3>

          <p className="flex items-center gap-1 text-sm">
            <FaRupeeSign /> {Number(property.price || 0).toLocaleString()}/mo
          </p>

          <p className="flex items-center gap-1 text-sm text-gray-600">
            <FaMapMarkerAlt /> {property.location || "Unknown"}
          </p>

          <p className="flex items-center gap-1 text-sm text-gray-600">
            <FaBuilding /> {property.flat_status || "N/A"}
          </p>
        </div>

        <div
          className="px-4 py-3 flex gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onRaiseQuery}
            className="flex-1 flex items-center justify-center gap-2 text-sm bg-blue-600 text-white rounded-lg py-2"
          >
            <FiEdit /> Raise Query
          </button>

          <a
            href={`tel:+91${property.owner_phone || ""}`}
            className="flex-1 flex items-center justify-center gap-2 text-sm bg-green-600 text-white rounded-lg py-2"
          >
            <FaPhoneAlt /> Call
          </a>
        </div>

        <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpenAddressModal(true)}
            className="w-full text-sm border border-indigo-600 text-indigo-600 rounded-lg py-2 hover:bg-indigo-50"
          >
            Update Address
          </button>
        </div>
      </div>

      {openAddressModal && (
        <UpdateAddressModal
          property={property}
          onClose={() => setOpenAddressModal(false)}
          onAddressUpdated={onAddressUpdated}
        />
      )}
    </>
  );
};

const UpdateAddressModal = ({ property, onClose, onAddressUpdated }) => {
  const [formData, setFormData] = useState({
    location: property.location || "",
    pincode: property.pincode || "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteServiceRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyARyFU8-dg2b25qj4bq8Vhp3K4-LCoL57U&libraries=places";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        autocompleteServiceRef.current =
          new window.google.maps.places.AutocompleteService();
      };
    } else {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const fetchSuggestions = (input) => {
    if (!input) return setSuggestions([]);

    autocompleteServiceRef.current.getQueryPredictions(
      { input, componentRestrictions: { country: "in" } },
      (predictions) => setSuggestions(predictions || []),
    );
  };

  const fetchCurrentLocation = () => {
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyARyFU8-dg2b25qj4bq8Vhp3K4-LCoL57U`,
        );
        const data = await res.json();

        const address = data.results[0].formatted_address;
        const pin =
          data.results[0].address_components.find((c) =>
            c.types.includes("postal_code"),
          )?.long_name || "";

        setFormData({ location: address, pincode: pin });
        toast.success("Location fetched");
        setLoadingLocation(false);
      },
      () => {
        toast.error("Failed to fetch location");
        setLoadingLocation(false);
      },
    );
  };

  // ✅ ONLY NEW FUNCTION
  const handleUpdateAddress = async () => {
    if (!formData.location || !formData.pincode) {
      toast.error("Location and pincode are required");
      return;
    }

    setLoadingUpdate(true);
    try {
      await updatePropertyAddress(property._id || property.id, {
        address: formData.location,
        pincode: formData.pincode,
      });

      onAddressUpdated?.({
        location: formData.location,
        pincode: formData.pincode,
      });

      toast.success("Address updated successfully");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update address");
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Update Address</h3>

        <label className="text-sm font-medium">Location</label>
        <input
          value={formData.location}
          onChange={(e) => {
            setFormData({ ...formData, location: e.target.value });
            fetchSuggestions(e.target.value);
          }}
          className="w-full border rounded-xl px-4 py-3 mt-1"
        />

       {suggestions.length > 0 && (
  <div className="border scrollbar-hide rounded-xl mt-2 max-h-40 overflow-y-auto bg-white">
    {suggestions.map((s) => (
      <div
        key={s.place_id}
        onClick={() =>
          setFormData({ ...formData, location: s.description })
        }
        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
      >
        <HiLocationMarker className="text-gray-500 text-lg flex-shrink-0 mt-[2px]" />

        <span className="text-sm leading-5 text-gray-800">
          {s.description}
        </span>
      </div>
    ))}
  </div>
)}


        <label className="text-sm font-medium mt-4 block">Pincode</label>
        <input
          value={formData.pincode}
          onChange={(e) =>
            setFormData({
              ...formData,
              pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
            })
          }
          className="w-full border rounded-xl px-4 py-3 mt-1"
        />

        <button
          onClick={fetchCurrentLocation}
          className="flex items-center gap-2 text-indigo-600 mt-3"
        >
          {loadingLocation ? (
            <HiOutlineRefresh className="animate-spin" />
          ) : (
            <HiLocationMarker />
          )}
          Use Current Location
        </button>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleUpdateAddress}
            disabled={loadingUpdate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {loadingUpdate ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
