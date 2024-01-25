import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  // console.log(token)

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      // maxAge: 30 * 60 * 1000,
      maxAge: null,
      sameSite: process.env.NODE_ENV == "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV == "Development" ? false : true,
    })
    .json({
      success: true,
      message,
    });
};
