import mongoose from "mongoose";

/* RemittanceSchema will correspond to a collection in your MongoDB database. */
const RemittanceSchema = new mongoose.Schema({
  PIN: {
    /* The pin of this remittance */

    type: String,
    required: [true, "Please provide a pin for this remittance."],
    maxlength: [6, "Pin cannot be more than 6 characters"],
  },
  SenderID: {
    /* The sender name of this remittance */

    type: String,
    required: [true, "Please provide the remittance owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  SenderName: {
    /* The sender name of this remittance */

    type: String,
    required: [true, "Please provide the remittance owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  SenderPhoneNumber: {
    /* The sender phone number of this remittance */

    type: String,
    required: [true, "Please provide the remittance owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  ReceiverID: {
    /* The sender name of this remittance */

    type: String,
    required: [true, "Please provide the remittance owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  ReceiverName: {
    /* The sender name of this remittance */

    type: String,
    required: [true, "Please provide the remittance owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  ReceiverPhoneNumber: {
    /* The receiver phone number of this remittance */

    type: String,
    required: [true, "Please provide the remittance owner's name"],
    maxlength: [20, "Owner's Name cannot be more than 60 characters"],
  },
  RemittanceFiatAmount: {
    /* The species of your remittance */

    type: Number,
    required: [true, "Please specify the species of your remittance."],
    maxlength: [30, "Species specified cannot be more than 40 characters"],
  },

  RemittanceFiatCurrency: {
    /* The species of your remittance */

    type: String,
    required: [true, "Please specify the species of your remittance."],
    maxlength: [30, "Species specified cannot be more than 40 characters"],
  },

  FeeUSD: {
    /* The species of your remittance */

    type: Number,
    required: [true, "Please specify the species of your remittance."],
    maxlength: [30, "Species specified cannot be more than 40 characters"],
  },
  Status: {
    /* Boolean poddy_trained value, if applicable */

    type: Boolean,
  },
});

export default mongoose.models.Remittance ||
  mongoose.model("Remittance", RemittanceSchema);
