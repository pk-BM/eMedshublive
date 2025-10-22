export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  const { password: pass, ...rest } = user._doc;
  const isProduction = process.env.NODE_ENV === "production";

  //send new token
  res
    .status(statusCode)
    .cookie("eMedsHubToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    })
    .json({
      success: true,
      user: rest,
      message,
    });
};
