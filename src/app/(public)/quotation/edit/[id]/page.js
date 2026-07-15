"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/(public)/quotation/add/page.module.css";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import { getStoredUser, getUserId } from "@/lib/auth";

export default function EditQuotation() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  //  Moving Types  
  const movingTypes = [
    "Local Shifting",
    "Domestic Shifting",
    "International Shifting",
    "HouseHold Goods",
    "Office Relocation",
    "Industrial Goods Shifting",
    "Car Shifting",
    "HouseHold Goods And Car Shifting",
    "Bike Shifting",
    "HouseHold Goods And Bike Shifting",
    "Bike And Car Shifting",
    "HouseHold Goods,Bike And Car Shifting",
  ];

  // Floors
  const floors = [
    "Ground Floor",
    ...Array.from({ length: 100 }, (_, i) => `${i + 1} Floor`),
  ];


  // States
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];


  // State managements
  const [formData, setFormData] = useState({
    quotation_number: "",
    quotation_company_name: "",
    moving_type: "",
    company_gst: "",
    party_name: "",
    quotation_email: "",
    quotation_mobile: "",
    quotation_date: getTodayDate(),
    packing_date: getTodayDate(),
    moving_date: getTodayDate(),
    origin_country: "India",
    origin_state: "",
    origin_city: "",
    origin_pincode: "",
    origin_address: "",
    origin_floor: "Ground Floor",
    origin_lift_available: "Yes",
    desination_country: "India",
    desination_state: "",
    desination_city: "",
    desination_pincode: "",
    desination_address: "",
    desination_floor: "Ground Floor",
    desination_lift_available: "Yes",
    freight_charge: 0,
    advance_paid: 0,
    sub_total: 0,
    packing_charge_type: "Included in Freight",
    packing_charge: 0,
    unpacking_charge_type: "Included in Freight",
    unpacking_charge: 0,
    loading_charge_type: "Included in Freight",
    loading_charge: 0,
    unloading_charge_type: "Included in Freight",
    unloading_charge: 0,
    packing_material_charge_type: "Included in Freight",
    packing_material_charge: 0,
    storage_charge: 0,
    car_tpt: 0,
    miscellaneous_charge: 0,
    other_charge: 0,
    st_charge: 0,
    octroi_tax: 0,
    surcharge_type: "Not Applicable",
    surcharge_percent: "10%",
    gst_in_out: "1",
    gst_percent: "18",
    gst_type: "1",
    qt_remark: "",
    discount: 0,
    insurance_type: "Included in Freight",
    insurance_percent: "3%",
    ins_gst_percent: "0",
    dec_val_of_goods: "0",
    vehicle_insurance_type: "Not Applicable",
    vehicle_insurance_percent: "3%",
    vehicle_ins_gst_percent: "0",
    dec_val_of_vehicle: "0",
    easy_access_load_unload: "Yes",
    any_restrictions: "yes",
    item_through_balcony: "",
    special_needs: "",
    description: "",
    quantity: "",
    value: "",
    remark: "",
    items: [],
  });

  // ✅ Fetch Old Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getStoredUser();
        const userId = getUserId(user);

        if (!userId) {
          throw new Error("User not found");
        }

        const res = await fetch(`/api/quotation/${id}?userId=${encodeURIComponent(userId)}`);

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();

        if (data.success) {
          setFormData(data.data);
        } else {
          Swal.fire("Error ❌", data.message, "error");
        }
      } catch (error) {
        console.log(error);
        Swal.fire("Error ❌", "Something went wrong", "error");
      }
    };

    if (id) fetchData();
  }, [id]);

   // useeffect Function
    useEffect(() => {
      const total =
        Number(formData.freight_charge || 0) +
        Number(formData.packing_charge || 0) +
        Number(formData.unpacking_charge || 0) +
        Number(formData.loading_charge || 0) +
        Number(formData.unloading_charge || 0) +
        Number(formData.packing_material_charge || 0) +
        Number(formData.storage_charge || 0) +
        Number(formData.car_tpt || 0) +
        Number(formData.miscellaneous_charge || 0) +
        Number(formData.other_charge || 0) +
        Number(formData.st_charge || 0) +
        Number(formData.octroi_tax || 0);
  
      const discount = Number(formData.discount || 0);
  
      const finalTotal = total - discount;
  
      setFormData((prev) => ({
        ...prev,
        sub_total: finalTotal,
      }));
    }, [
      formData.freight_charge,
      formData.packing_charge,
      formData.unpacking_charge,
      formData.loading_charge,
      formData.unloading_charge,
      formData.packing_material_charge,
      formData.storage_charge,
      formData.car_tpt,
      formData.miscellaneous_charge,
      formData.other_charge,
      formData.st_charge,
      formData.octroi_tax,
      formData.discount,
    ]);
    
  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add Items Function
  const addItem = () => {
    const newItem = {
      description: formData.description,
      quantity: formData.quantity,
      value: formData.value,
      remark: formData.remark,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      // reset fields
      description: "",
      quantity: "",
      value: "",
      remark: "",
    }));
  };

  // remove Items Function
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // ✅ Update Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getStoredUser();
    const userId = getUserId(user);

    if (!userId) {
      Swal.fire("Error ❌", "Unable to find logged-in user.", "error");
      return;
    }

    const res = await fetch(`/api/quotation/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, userId }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire({
        title: "Updated!",
        text: "Quotation updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push("/quotation/view");
      }, 1500);
    } else {
      Swal.fire("Error ❌", data.message, "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Edit Quotation</h3>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
            {/* QUOTATION Details */}
            <div className="col-md-12">
              <div className="card mb-4">
                <div className={styles.cardHeader}>
                  <h5>Quotation Details</h5>
                </div>
                <div className="card-body row g-4">
                  <div className="col-lg-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="quotation_number"
                    >
                      Quotation Number (कोटेशन नंबर)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="quotation_number"
                      placeholder="Quotation Number"
                      onChange={handleChange}
                      value={formData.quotation_number || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className={styles.labelSize} htmlFor="quotation_company_name">
                      Company Name of Party (कंपनी नाम - जिसे कोटेशन चाहिए)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="quotation_company_name"
                      placeholder="Company Name"
                      value={formData.quotation_company_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="moving_type">
                      Moving Type (मुविंग के प्रकार)
                    </label>

                    <select
                      className="form-control"
                      name="moving_type"
                      value={formData.moving_type || ""}
                      onChange={handleChange}
                    >
                      <option>Select Moving Type</option>

                      {movingTypes.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="company_gst">
                      Company GST No. (कंपनी GST No.)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="company_gst"
                      placeholder="Company GST No."
                      value={formData.company_gst || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="party_name">
                      Party Name* (व्यक्ति नाम - जिसे कोटेशन चाहिए)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="party_name"
                      placeholder="Party Name"
                      value={formData.party_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="quotation_email">
                      Email (ईमेल)
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="quotation_email"
                      placeholder="Email"
                      value={formData.quotation_email || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="quotation_mobile">
                      Mobile (मोबाइल नंबर)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="quotation_mobile"
                      placeholder="Mobile"
                      value={formData.quotation_mobile || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="quotation_date"
                    >
                      Quotation Date (तारीख)
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="quotation_date"
                      value={formData.quotation_date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="packing_date">
                      Packing Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="packing_date"
                      value={formData.packing_date}
                      placeholder="Packing Date"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="moving_date">
                      Moving Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="moving_date"
                      value={formData.moving_date}
                      placeholder="Moving Date"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Move From (जहां से सामान जाएगा) */}
            <div className="col-md-6">
              <div className="card mb-4">
                <div className={styles.cardHeader}>
                  <h5>Move From ( जहां से सामान जाएगा )</h5>
                </div>
                <div className="card-body row">
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="origin_country"
                    >
                      Country (देश)
                    </label>
                    <input
                      value={formData.origin_country}
                      className="form-control"
                      name="origin_country"
                      placeholder="Country"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label className={styles.labelSize} htmlFor="origin_state">
                      State (राज्य)
                    </label>

                    <select
                      className="form-control"
                      name="origin_state"
                      value={formData.origin_state || ""}
                      onChange={handleChange}
                    >
                      <option>Select State</option>

                      {states.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 mb-2">
                    <label className={styles.labelSize} htmlFor="origin_city">
                      City (शहर)
                    </label>
                    <input
                      className="form-control"
                      name="origin_city"
                      placeholder="City"
                      value={formData.origin_city || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="origin_pincode"
                    >
                      PinCode(पिन कोड)
                    </label>
                    <input
                      className="form-control"
                      name="origin_pincode"
                      placeholder="PinCode"
                      value={formData.origin_pincode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="origin_address"
                    >
                      Address (पता)
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="origin_address"
                      placeholder="Address"
                      value={formData.origin_address || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label className={styles.labelSize} htmlFor="origin_floor">
                      Floor (मंज़िल)
                    </label>

                    <select
                      className="form-control"
                      value={formData.origin_floor}
                      name="origin_floor"
                      onChange={handleChange}
                    >
                      {floors.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="origin_lift_available"
                    >
                      Is Lift Available(क्या लिफ्ट है?)
                    </label>
                    <select
                      className="form-control"
                      value={formData.origin_lift_available}
                      name="origin_lift_available"
                      onChange={handleChange}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Move To (जहां सामान जाना है) */}
            <div className="col-md-6">
              <div className="card mb-4">
                <div className={styles.cardHeader}>
                  <h5>Move To ( जहां सामान जाना है )</h5>
                </div>
                <div className="card-body row">
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="desination_country"
                    >
                      Country (देश)
                    </label>
                    <input
                      value={formData.desination_country}
                      className="form-control"
                      name="desination_country"
                      placeholder="Country"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="desination_state"
                    >
                      State (राज्य)
                    </label>

                    <select
                      className="form-control"
                      name="desination_state"
                      value={formData.desination_state || ""}
                      onChange={handleChange}
                    >
                      <option>Select State</option>

                      {states.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="desination_city"
                    >
                      City (शहर)
                    </label>
                    <input
                      className="form-control"
                      name="desination_city"
                      placeholder="City"
                      value={formData.desination_city || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="desination_pincode"
                    >
                      PinCode(पिन कोड)
                    </label>
                    <input
                      className="form-control"
                      name="desination_pincode"
                      placeholder="PinCode"
                      value={formData.desination_pincode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="desination_address"
                    >
                      Address (पता)
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="desination_address"
                      placeholder="Address"
                      value={formData.desination_address || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="desination_floor"
                    >
                      Floor (मंज़िल)
                    </label>

                    <select
                      className="form-control"
                      value={formData.desination_floor}
                      name="desination_floor"
                      onChange={handleChange}
                    >
                      {floors.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 mb-2">
                    <label
                      className={styles.labelSize}
                      htmlFor="desination_lift_available"
                    >
                      Is Lift Available(क्या लिफ्ट है?)
                    </label>
                    <select
                      className="form-control"
                      value={formData.desination_lift_available}
                      name="desination_lift_available"
                      onChange={handleChange}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details (पेमेंट का विवरण) */}
            <div className="col-md-12">
              <div className="card mb-4">
                <div className={styles.cardHeader}>
                  <h5>Payment Details ( पेमेंट का विवरण )</h5>
                </div>
                <div className="card-body row g-4">
                  <div className="col-lg-4 col-6">
                    <label
                      className={styles.labelSize}
                      htmlFor="freight_charge"
                    >
                      Freight Charge
                    </label>
                    <input
                      className="form-control"
                      name="freight_charge"
                      placeholder="Freight Charge"
                      value={formData.freight_charge || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4 col-6">
                    <label className={styles.labelSize} htmlFor="advance_paid">
                      Advance Paid
                    </label>
                    <input
                      className="form-control"
                      name="advance_paid"
                      placeholder="Advance Paid"
                      value={formData.advance_paid || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-4 bg-success text-white p-2">
                    <label
                      className={`${styles.labelSize} text-white`}
                      htmlFor="sub_total"
                    >
                      Sub Total
                    </label>
                    <input
                      className="form-control bg-success text-white border-0 fw-semibold fs-2"
                      name="sub_total"
                      placeholder="Sub Total"
                      onChange={handleChange}
                      value={formData.sub_total}
                      readOnly
                    />
                  </div>
                  <div className="col-lg-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="packing_charge"
                    >
                      Packing Charge
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <select
                        className="form-select"
                        value={formData.packing_charge_type}
                        name="packing_charge_type"
                        onChange={handleChange}
                      >
                        <option value="Included in Freight">
                          Included in Freight
                        </option>
                        <option value="Additional from Freight">
                          Additional from Freight
                        </option>
                      </select>
                      {/* Amount Input */}
                      <input
                        type="number"
                        className="form-control"
                        name="packing_charge"
                        placeholder="Enter Amount"
                        value={formData.packing_charge || ""}
                        onChange={handleChange}
                        readOnly={
                          formData.packing_charge_type === "Included in Freight"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="unpacking_charge"
                    >
                      Unpacking Charge
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <select
                        className="form-select"
                        value={formData.unpacking_charge_type}
                        name="unpacking_charge_type"
                        onChange={handleChange}
                      >
                        <option value="Included in Freight">
                          Included in Freight
                        </option>
                        <option value="Additional from Freight">
                          Additional from Freight
                        </option>
                      </select>
                      {/* Amount Input */}
                      <input
                        type="number"
                        className="form-control"
                        name="unpacking_charge"
                        value={formData.unpacking_charge || ""}
                        placeholder="Enter Amount"
                        onChange={handleChange}
                        readOnly={
                          formData.unpacking_charge_type ===
                          "Included in Freight"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="loading_charge"
                    >
                      Loading Charge
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <select
                        className="form-select"
                        value={formData.loading_charge_type}
                        name="loading_charge_type"
                        onChange={handleChange}
                      >
                        <option value="Included in Freight">
                          Included in Freight
                        </option>
                        <option value="Additional from Freight">
                          Additional from Freight
                        </option>
                      </select>
                      {/* Amount Input */}
                      <input
                        type="number"
                        className="form-control"
                        name="loading_charge"
                        value={formData.loading_charge || ""}
                        placeholder="Enter Amount"
                        onChange={handleChange}
                        readOnly={
                          formData.loading_charge_type === "Included in Freight"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="unloading_charge"
                    >
                      UnLoading Charge
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <select
                        className="form-select"
                        value={formData.unloading_charge_type}
                        name="unloading_charge_type"
                        onChange={handleChange}
                      >
                        <option value="Included in Freight">
                          Included in Freight
                        </option>
                        <option value="Additional from Freight">
                          Additional from Freight
                        </option>
                      </select>
                      {/* Amount Input */}
                      <input
                        type="number"
                        className="form-control"
                        name="unloading_charge"
                        value={formData.unloading_charge || ""}
                        placeholder="Enter Amount"
                        onChange={handleChange}
                        readOnly={
                          formData.unloading_charge_type ===
                          "Included in Freight"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="packing_material_charge"
                    >
                      Packing Material Charge
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <select
                        className="form-select"
                        value={formData.packing_material_charge_type}
                        name="packing_material_charge_type"
                        onChange={handleChange}
                      >
                        <option value="Included in Freight">
                          Included in Freight
                        </option>
                        <option value="Additional from Freight">
                          Additional from Freight
                        </option>
                      </select>
                      {/* Amount Input */}
                      <input
                        type="number"
                        className="form-control"
                        name="packing_material_charge"
                        value={formData.packing_material_charge || ""}
                        placeholder="Enter Amount"
                        onChange={handleChange}
                        readOnly={
                          formData.packing_material_charge_type ===
                          "Included in Freight"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-6">
                    <label
                      className={styles.labelSize}
                      htmlFor="storage_charge"
                    >
                      Storage Charge
                    </label>
                    <input
                      className="form-control"
                      name="storage_charge"
                      placeholder="Storage Charge"
                      value={formData.storage_charge || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4 col-6">
                    <label className={styles.labelSize} htmlFor="car_tpt">
                      Car/Bike TPT
                    </label>
                    <input
                      className="form-control"
                      name="car_tpt"
                      placeholder="Car/Bike TPT"
                      value={formData.car_tpt || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4 col-6">
                    <label
                      className={styles.labelSize}
                      htmlFor="miscellaneous_charge"
                    >
                      Miscellaneous Charges
                    </label>
                    <input
                      className="form-control"
                      name="miscellaneous_charge"
                      placeholder="Miscellaneous Charges"
                      value={formData.miscellaneous_charge || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4 col-6">
                    <label className={styles.labelSize} htmlFor="other_charge">
                      Other Charges
                    </label>
                    <input
                      className="form-control"
                      name="other_charge"
                      placeholder="Other Charges"
                      value={formData.other_charge || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4 col-6">
                    <label className={styles.labelSize} htmlFor="st_charge">
                      S.T. Charge
                    </label>
                    <input
                      className="form-control"
                      name="st_charge"
                      placeholder="S.T. Charge"
                      value={formData.st_charge || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4 col-6">
                    <label className={styles.labelSize} htmlFor="octroi_tax">
                      Octroi Green Tax
                    </label>
                    <input
                      className="form-control"
                      name="octroi_tax"
                      placeholder="Octroi Green Tax"
                      value={formData.octroi_tax || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="surcharge">
                      Surcharge
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <select
                        className="form-select"
                        value={formData.surcharge_type}
                        name="surcharge_type"
                        onChange={handleChange}
                      >
                        <option value="Not Applicable">Not Applicable</option>
                        <option value="Applicable">Applicable</option>
                        <option value="Extra">Extra</option>
                      </select>
                      {/* Amount Input */}
                      <select
                        name="surcharge_percent"
                        value={formData.surcharge_percent}
                        className="form-control options_input"
                        onChange={handleChange}
                      >
                        <option value="1">1%</option>
                        <option value="2">2%</option>
                        <option value="3">3%</option>
                        <option value="4">4%</option>
                        <option value="5">5%</option>
                        <option value="6">6%</option>
                        <option value="7">7%</option>
                        <option value="8">8%</option>
                        <option value="9">9%</option>
                        <option value="10">10%</option>
                        <option value="11">11%</option>
                        <option value="12">12%</option>
                        <option value="13">13%</option>
                        <option value="14">14%</option>
                        <option value="15">15%</option>
                        <option value="16">16%</option>
                        <option value="17">17%</option>
                        <option value="18">18%</option>
                        <option value="19">19%</option>
                        <option value="20">20%</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="gst_in_out">
                      GST Show/Hide GST
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <select
                        className="form-select"
                        value={formData.gst_in_out}
                        name="gst_in_out"
                        onChange={handleChange}
                      >
                        <option value="1">GST Charge Show In Quotation</option>
                        <option value="2">GST % Show & GST Charge Hide</option>
                        <option value="3">Without GST Quotation</option>
                        <option value="4">GST Exempted</option>
                        <option value="5">GST Extra</option>
                        <option value="6">GST Included in Subtotal</option>
                      </select>
                      <select
                        name="gst_percent"
                        value={formData.gst_percent}
                        className="form-select"
                        onChange={handleChange}
                      >
                        <option value="0">0</option>
                        <option value="5">5</option>
                        <option value="12">12</option>
                        <option value="18">18</option>
                        <option value="28">28</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-4 col-6">
                    <label className={styles.labelSize} htmlFor="gst_type">
                      GST Type
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <select
                        name="gst_type"
                        value={formData.gst_type}
                        className="form-control"
                        onChange={handleChange}
                      >
                        <option value="1">CGST/SGST</option>
                        <option value="2">IGST</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <label className={styles.labelSize} htmlFor="qt_remark">
                      Remark (टिप्पण)
                    </label>
                    <div className="input-group">
                      {/* Select */}
                      <textarea
                        name="qt_remark"
                        className="form-control"
                        value={formData.qt_remark || ""}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-lg-4  bg-warning">
                    <label className={styles.labelSize} htmlFor="discount">
                      Discount (डिस्काउंट)
                    </label>
                    <div className="input-group">
                      <fieldset className="form-group">
                        <input
                          name="discount"
                          className="form-control"
                          value={formData.discount || ""}
                          onChange={handleChange}
                        />
                        <small className="text-black">
                          Applicable on Sub-Total Amount
                        </small>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Details (इन्शुरेंस जानकारी) */}
            <div className="col-md-6">
              <div className="card mb-4">
                <div className={styles.cardHeader}>
                  <h5>Insurance Details (इन्शुरेंस जानकारी)</h5>
                </div>
                <div className="card-body row g-4">
                  <div className="col-12">
                    <label
                      className={styles.labelSize}
                      htmlFor="insurance_type"
                    >
                      Insurance Type
                    </label>
                    <select
                      name="insurance_type"
                      value={formData.insurance_type}
                      className="form-control options_select"
                      onChange={handleChange}
                    >
                      <option value="Included in Freight">Included in Freight</option>
                      <option value="Show Insurance Amount">Show Insurance Amount</option>
                      <option value="Optional">Optional</option>
                      <option value="Extra" data-r="true">
                        Extra
                      </option>
                      <option value="Insurance Mandatory" data-r="true">
                        Insurance Mandatory
                      </option>
                    </select>
                  </div>
                  <div className="col-lg-7 col-8">
                    <label
                      className={styles.labelSize}
                      htmlFor="insurance_percent"
                    >
                      Insurance Charge @Percent (%)
                    </label>
                    <select
                      name="insurance_percent"
                      value={formData.insurance_percent}
                      className="form-control options_input"
                      onChange={handleChange}
                    >
                      <option value="0">0%</option>
                      <option value="0.25">0.25%</option>
                      <option value="0.5">0.5%</option>
                      <option value="0.75">0.75%</option>
                      <option value="1">1%</option>
                      <option value="1.25">1.25%</option>
                      <option value="1.5">1.5%</option>
                      <option value="1.75">1.75%</option>
                      <option value="2">2%</option>
                      <option value="2.25">2.25%</option>
                      <option value="2.5">2.5%</option>
                      <option value="2.75">2.75%</option>
                      <option value="3">3%</option>
                      <option value="3.25">3.25%</option>
                      <option value="3.5">3.5%</option>
                      <option value="3.75">3.75%</option>
                      <option value="4">4%</option>
                      <option value="4.25">4.25%</option>
                      <option value="4.5">4.5%</option>
                      <option value="4.75">4.75%</option>
                      <option value="5">5%</option>
                      <option value="5.25">5.25%</option>
                      <option value="5.5">5.5%</option>
                      <option value="5.75">5.75%</option>
                      <option value="6">6%</option>
                      <option value="6.25">6.25%</option>
                      <option value="6.5">6.5%</option>
                      <option value="6.75">6.75%</option>
                      <option value="7">7%</option>
                      <option value="7.25">7.25%</option>
                      <option value="7.5">7.5%</option>
                      <option value="7.75">7.75%</option>
                      <option value="8">8%</option>
                      <option value="8.25">8.25%</option>
                      <option value="8.5">8.5%</option>
                      <option value="8.75">8.75%</option>
                      <option value="9">9%</option>
                      <option value="9.25">9.25%</option>
                      <option value="9.5">9.5%</option>
                      <option value="9.75">9.75%</option>
                      <option value="10">10%</option>
                    </select>
                  </div>
                  <div className="col-lg-5 col-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="ins_gst_percent"
                    >
                      GST %
                    </label>
                    <select
                      name="ins_gst_percent"
                      value={formData.ins_gst_percent}
                      className="form-control options_input"
                      id="ins_gst_percent"
                      onChange={handleChange}
                    >
                      <option value="0">0</option>
                      <option value="5">5</option>
                      <option value="12">12</option>
                      <option value="18">18</option>
                      <option value="28">28</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label
                      className={styles.labelSize}
                      htmlFor="dec_val_of_goods"
                    >
                      Declaration Value Of Goods (if any)
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      name="dec_val_of_goods"
                      onChange={handleChange}
                      value={formData.dec_val_of_goods || ""}
                      readOnly={formData.insurance_type !== "Show Insurance Amount"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Insurance Details (गाड़ी इन्शुरेंस जानकारी)*/}
            <div className="col-md-6">
              <div className="card mb-4">
                <div className={styles.cardHeader}>
                  <h5>Vehicle Insurance Details (गाड़ी इन्शुरेंस जानकारी)</h5>
                </div>
                <div className="card-body row g-4">
                  <div className="col-12">
                    <label
                      className={styles.labelSize}
                      htmlFor="insurance_type"
                    >
                      Insurance Type
                    </label>
                    <select
                      name="vehicle_insurance_type"
                      value={formData.vehicle_insurance_type}
                      className="form-control options_select"
                      onChange={handleChange}
                    >
                      <option value="Not Applicable" data-r="true">
                        Not Applicable
                      </option>
                      <option value="Optional">Optional</option>
                      <option value="Additional from Freight">Additional from Freight</option>
                      <option value="Included in Freight">Included in Freight</option>
                    </select>
                  </div>
                  <div className="col-lg-7 col-8">
                    <label
                      className={styles.labelSize}
                      htmlFor="vehicle_insurance_percent"
                    >
                      Insurance Charge @Percent (%)
                    </label>
                    <select
                      value={formData.vehicle_insurance_percent}
                      name="vehicle_insurance_percent"
                      className="form-control options_input"
                      onChange={handleChange}
                    >
                      <option value="0">0%</option>
                      <option value="0.25">0.25%</option>
                      <option value="0.5">0.5%</option>
                      <option value="0.75">0.75%</option>
                      <option value="1">1%</option>
                      <option value="1.25">1.25%</option>
                      <option value="1.5">1.5%</option>
                      <option value="1.75">1.75%</option>
                      <option value="2">2%</option>
                      <option value="2.25">2.25%</option>
                      <option value="2.5">2.5%</option>
                      <option value="2.75">2.75%</option>
                      <option value="3">3%</option>
                      <option value="3.25">3.25%</option>
                      <option value="3.5">3.5%</option>
                      <option value="3.75">3.75%</option>
                      <option value="4">4%</option>
                      <option value="4.25">4.25%</option>
                      <option value="4.5">4.5%</option>
                      <option value="4.75">4.75%</option>
                      <option value="5">5%</option>
                      <option value="5.25">5.25%</option>
                      <option value="5.5">5.5%</option>
                      <option value="5.75">5.75%</option>
                      <option value="6">6%</option>
                      <option value="6.25">6.25%</option>
                      <option value="6.5">6.5%</option>
                      <option value="6.75">6.75%</option>
                      <option value="7">7%</option>
                      <option value="7.25">7.25%</option>
                      <option value="7.5">7.5%</option>
                      <option value="7.75">7.75%</option>
                      <option value="8">8%</option>
                      <option value="8.25">8.25%</option>
                      <option value="8.5">8.5%</option>
                      <option value="8.75">8.75%</option>
                      <option value="9">9%</option>
                      <option value="9.25">9.25%</option>
                      <option value="9.5">9.5%</option>
                      <option value="9.75">9.75%</option>
                      <option value="10">10%</option>
                    </select>
                  </div>
                  <div className="col-lg-5 col-4">
                    <label
                      className={styles.labelSize}
                      htmlFor="vehicle_ins_gst_percent"
                    >
                      GST %
                    </label>
                    <select
                      name="vehicle_ins_gst_percent"
                      value={formData.vehicle_ins_gst_percent}
                      className="form-control options_input"
                      id="vehicle_ins_gst_percent"
                      onChange={handleChange}
                    >
                      <option value="0">0</option>
                      <option value="5">5</option>
                      <option value="12">12</option>
                      <option value="18">18</option>
                      <option value="28">28</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label
                      className={styles.labelSize}
                      htmlFor="dec_val_of_vehicle"
                    >
                      Declaration Value Of Goods (if any)
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      name="dec_val_of_vehicle"
                      onChange={handleChange}
                      value={formData.dec_val_of_vehicle || ""}
                      readOnly={formData.vehicle_insurance_type !== "Additional from Freight"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Other Details (अन्य जानकारी)*/}
            <div className="col-md-12">
              <div className="card mb-4">
                <div className={styles.cardHeader}>
                  <h5>Other Details (अन्य जानकारी)</h5>
                </div>
                <div className="card-body row g-4">
                  <div className="col-lg-6">
                    <label
                      className={styles.labelSize}
                      htmlFor="easy_access_load_unload"
                    >
                      Is there easy access for load & unloading at origin &
                      desination (क्या लोड और अनलोडिंग आसान है?)
                    </label>
                    <select
                      name="easy_access_load_unload"
                      value={formData.easy_access_load_unload}
                      className="form-control flor_filed "
                      onChange={handleChange}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="May be">May be</option>
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label
                      className={styles.labelSize}
                      htmlFor="any_restrictions"
                    >
                      Are there any restrictions for loading/unloading at
                      origin/desination (क्या लोडिंग/अनलोडिंग वाले स्थान पर कोई
                      रोकटोक हैं?)
                    </label>
                    <select
                      name="any_restrictions"
                      value={formData.any_restrictions}
                      className="form-control flor_filed"
                      id="any_restrictions"
                      onChange={handleChange}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="May be">May be</option>
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label
                      className={styles.labelSize}
                      htmlFor="item_through_balcony"
                    >
                      Should any items be got down through balcony etc. (क्या
                      किसी सामान को बालकनी से नीचे उतारना हैं?)
                    </label>
                    <small className="text-muted">
                      eg.<i>Almirah, Bed etc.</i>
                    </small>
                    <textarea
                      className="form-control"
                      id="item_through_balcony"
                      rows="2"
                      name="item_through_balcony"
                      value={formData.item_through_balcony || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="col-lg-6">
                    <label className={styles.labelSize} htmlFor="special_needs">
                      Do you have any special needs or concerns (अन्य जरूरी
                      आवश्यकताएं?)
                    </label>
                    <textarea
                      className="form-control"
                      id="special_needs"
                      rows="3"
                      name="special_needs"
                      value={formData.special_needs || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Item / Particulars Details (सामान का विवरण)*/}
            <div className="col-md-12">
              <div className="card mb-4">
                <div className={styles.cardHeader}>
                  <h5>Item / Particulars Details (सामान का विवरण)</h5>
                </div>
                <div className="card-body row g-4">
                  <div className="col-lg-4">
                    <label className={styles.labelSize} htmlFor="description">
                      Item / Particulars Name (सामान का नाम)
                    </label>
                    <input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-lg-2 col-5">
                    <label className={styles.labelSize} htmlFor="quantity">
                      Quantity (संख्या)
                    </label>
                    <input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-lg-3 col-7">
                    <label className={styles.labelSize} htmlFor="value">
                      Value (कीमत) (In Rupees)
                    </label>
                    <input
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label className={styles.labelSize} htmlFor="remark">
                      Remark (अन्य विवरण)
                    </label>
                    <textarea
                      name="remark"
                      value={formData.remark}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3 offset-md-9 pb-1">
                    <button
                      type="button"
                      className="btn btn-warning w-100 btn-sm"
                      onClick={addItem}
                    >
                      + ADD ITEM
                    </button>
                  </div>
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Value (₹)</th>
                          <th>Remark</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {formData.items.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No Items Added
                            </td>
                          </tr>
                        ) : (
                          formData.items.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.description}</td>
                              <td>{item.quantity}</td>
                              <td>{item.value}</td>
                              <td>{item.remark}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => removeItem(index)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
     


        <button className="btn btn-success mt-3">Update</button>
      </form>
    </div>
  );
}
