import expressAsyncHandler from "express-async-handler";
import {Payment} from "../models/payment.model.js";
import { constants, config } from "../../constants.js";
import {
  sendSuccess,
  sendError,
  sendServerError,
  sendUnauthorized,
} from "../utils/response.utils.js";






export const getMyMonthlyStatus = expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const year = Number(req.query.year);
        const month = req.query.month ? Number(req.query.month) : null;

        if (!year) {
            return sendError(res, constants.VALIDATION_ERROR, "Year is required");
        }

        let payments;
        if (month) {
            payments = await Payment.find({ user: userId, year, month });
        } else {
            payments = await Payment.find({ user: userId, year });
        }

        const paymentMap = {};
        payments.forEach((p) => {
            paymentMap[p.month] = p;
        });

        let result = [];
        if (month) {
            // Only check the requested month
            if (paymentMap[month]) {
                result.push({
                    month,
                    status: "PAID",
                    amount: paymentMap[month].amount,
                    date: paymentMap[month].date,
                    receiptNo: paymentMap[month].receiptNo,
                });
            } else {
                result.push({
                    month,
                    status: "DUE",
                });
            }
        } else {
            // Check all months
            for (let m = 1; m <= 12; m++) {
                if (paymentMap[m]) {
                    result.push({
                        month: m,
                        status: "PAID",
                        amount: paymentMap[m].amount,
                        date: paymentMap[m].date,
                        receiptNo: paymentMap[m].receiptNo,
                    });
                } else {
                    result.push({
                        month: m,
                        status: "DUE",
                    });
                }
            }
        }

        return sendSuccess(
            res,
            constants.OK,
            "Monthly payment status fetched successfully",
            result
        );
    } catch (error) {
        return sendServerError(res, error);
    }
});

export const getUserPayments = expressAsyncHandler (async (req, res)=>{
    try {
        // Use req.params.id for admin, fallback to req.user._id for user
        const userId = req.params.id || (req.user && req.user._id);
        const year = Number(req.query.year);
        const month = req.query.month ? Number(req.query.month) : null;

        if (!userId) {
            return sendError(res, constants.VALIDATION_ERROR, "User ID is required");
        }
        if (!year) {
            return sendError(res, constants.VALIDATION_ERROR, "Year is required");
        }

        let payments;
        if (month) {
            payments = await Payment.find({ user: userId, year, month });
        } else {
            payments = await Payment.find({ user: userId, year });
        }

        const paymentMap = {};
        payments.forEach((p) => {
            paymentMap[p.month] = p;
        });

        let result = [];
        if (month) {
            if (paymentMap[month]) {
                result.push({
                    month,
                    status: "PAID",
                    amount: paymentMap[month].amount,
                    date: paymentMap[month].date,
                    receiptNo: paymentMap[month].receiptNo,
                });
            } else {
                result.push({
                    month,
                    status: "DUE",
                });
            }
        } else {
            for (let m = 1; m <= 12; m++) {
                if (paymentMap[m]) {
                    result.push({
                        month: m,
                        status: "PAID",
                        amount: paymentMap[m].amount,
                        date: paymentMap[m].date,
                        receiptNo: paymentMap[m].receiptNo,
                    });
                } else {
                    result.push({
                        month: m,
                        status: "DUE",
                    });
                }
            }
        }

        return sendSuccess(
            res,
            constants.OK,
            "Monthly payment status fetched successfully",
            result
        );
    } catch (error) {
        return sendServerError(res, error);
    }
})