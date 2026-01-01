import crypto from "crypto";

export const generateRandomPassword = (length = 8) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const charsetLength = charset.length;

  const passwordArray = Array.from(
    crypto.randomBytes(length),
    (byte) => charset[byte % charsetLength]
  );

  return passwordArray.join("");
};
