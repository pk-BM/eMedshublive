export const sendResponse = (
  res,
  statusCode,
  isSuccess,
  successMessage,
  data
) => {
  res
    .status(statusCode)
    .json({ success: isSuccess, message: successMessage, data });
};
