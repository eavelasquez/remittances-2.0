"use strict";

import mongoose from "mongoose";

/* RemittanceSchema will correspond to a collection in your MongoDB database. */
const RemittanceSchema = new mongoose.Schema({
  PIN: {
    /* The pin of this remittance */

    type: String,
    // required: [true, "Please provide a pin for this remittance."],
    // maxlength: [6, "Pin cannot be more than 6 characters"],
  },
  SenderID: {
    /* The sender name of this remittance */

    type: String,
    required: [true, "Please provide the remittance sender's ID"],
    maxlength: [20, "Sender's ID cannot be more than 20 characters"],
  },
  SenderName: {
    /* The sender name of this remittance */

    type: String,
    required: [true, "Please provide the remittance sender's name"],
    maxlength: [60, "Sender's Name cannot be more than 60 characters"],
  },
  SenderPhoneNumber: {
    /* The sender phone number of this remittance */

    type: String,
    required: [true, "Please provide the remittance sender's phone number"],
    maxlength: [20, "Sender's Phone Number cannot be more than 20 characters"],
  },
  ReceiverID: {
    /* The sender name of this remittance */

    type: String,
    required: [true, "Please provide the remittance receiver's ID"],
    maxlength: [20, "Receiver's ID cannot be more than 20 characters"],
  },
  ReceiverName: {
    /* The sender name of this remittance */

    type: String,
    required: [true, "Please provide the remittance receiver's name"],
    maxlength: [60, "Receiver's Name cannot be more than 60 characters"],
  },
  ReceiverPhoneNumber: {
    /* The receiver phone number of this remittance */

    type: String,
    required: [true, "Please provide the remittance receiver's phone number"],
    maxlength: [
      20,
      "Receiver's Phone Number Name cannot be more than 20 characters",
    ],
  },
  RemittanceFiatAmount: {
    /* The species of your remittance */

    type: Number,
    required: [true, "Please specify the fiat amount of your remittance."],
  },

  RemittanceFiatCurrency: {
    /* The remittance fiat currency of your remittance */

    type: String,
    required: [true, "Please specify the fiat currency of your remittance."],
    maxlength: [
      30,
      "Remittance Fiat Currency specified cannot be more than 30 characters",
    ],
  },

  FeeUSD: {
    /* The fee USD of your remittance */

    type: Number,
    required: [true, "Please specify the fee USD of your remittance."],
  },
  Status: {
    /* Boolean remittance status value */

    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Remittance ||
  mongoose.model("Remittance", RemittanceSchema);
