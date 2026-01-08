import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number, 
      required: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["DUE", "PAID"],
      default: "PAID",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
    },

    createdByModel: {
      type: String,
      enum: ["Admin", "Moderator"],
    },
  },
  { timestamps: true }
);




// unique index to prevent duplicate payments for the same user on the same date

paymentSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });
export const Payment = mongoose.model("Payment", paymentSchema);
