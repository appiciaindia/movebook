import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: String,
  value: String,
  remark: String,
});

const QuotationSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  quotation_number:String,
  quotation_company_name:String,
  moving_type:String,
  company_gst:String,
  party_name:String,
  quotation_email:String,
  quotation_mobile:String,
  quotation_date:String,
  packing_date:String,
  moving_date:String,


//   Move From (जहां से सामान जाएगा)

  origin_country:String,
  origin_state:String,
  origin_city:String,
  origin_pincode:String,
  origin_address:String,
  origin_floor:String,
  origin_lift_available:String,


//   Move To (जहां सामान जाना है) 


  desination_country:String,
  desination_state:String,
  desination_city:String,
  desination_pincode:String,
  desination_address:String,
  desination_floor:String,
  desination_lift_available:String,


//    Payment Details (पेमेंट का विवरण) 

  freight_charge:String,
  advance_paid:String,
  sub_total:String,
  packing_charge_type:String,
  packing_charge:String,
  unpacking_charge_type:String,
  unpacking_charge:String,
  loading_charge_type:String,
  loading_charge:String,
  unloading_charge_type:String,
  unloading_charge:String,
  packing_material_charge_type:String,
  packing_material_charge:String,
  storage_charge:String,
  car_tpt:String,
  miscellaneous_charge:String,
  other_charge:String,
  st_charge:String,
  octroi_tax:String,
  surcharge_type:String,
  surcharge_percent:String,
  gst_in_out:String,
  gst_percent:String,
  gst_type:String,
  qt_remark:String,
  discount:String,


  //  Insurance Details (इन्शुरेंस जानकारी)

  insurance_type:String,
  insurance_percent:String,
  ins_gst_percent:String,
  dec_val_of_goods:String,


  //  Vehicle Insurance Details (गाड़ी इन्शुरेंस जानकारी)

  vehicle_insurance_type:String,
  vehicle_insurance_percent:String,
  vehicle_ins_gst_percent:String,
  dec_val_of_vehicle:String,

  // Other Details (अन्य जानकारी)

  easy_access_load_unload:String,
  any_restrictions:String,
  item_through_balcony:String,
  special_needs:String,


  // Item / Particulars Details (सामान का विवरण)

    items: {
    type: [itemSchema],
    default: [], // 👈 IMPORTANT
  },



});

export default mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema);