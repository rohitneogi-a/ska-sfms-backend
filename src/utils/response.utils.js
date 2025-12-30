import { constants } from "../../constants.js";

/**
 *  Sends a success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} [data={}] - Additional data to include in the response
 */

export function sendSuccess(res, statusCode, message, data = {}) {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
}

/**
 * Sends an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */

export function sendError(res, statusCode, message) {
  if (typeof statusCode !== "number") {
    console.error("⚠️ Invalid status code passed to sendError:", statusCode);
    statusCode = 500; //fallback to Internal Server Error
  }
  res.status(statusCode).json({
    success: false,
    message: message,
  });
}

/**
 * Sends a 500 Internal Server Error response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 */

export function sendServerError(res, error) {
  console.error("🚨 Internal Server Error:", error);
  res.status(constants.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}

// responseUtils.js

/**
 * Sends an unauthorized response
 * @param {Object} res - Express response object
 */


export function sendUnauthorized(res){
    res.status(constants.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access",
    })
}
