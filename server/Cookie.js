import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  // console.log(token)
  console.log(process.env.NODE_ENV);
  console.log(res.headers);
  console.log(res.getHeaders()); // Use getHeaders() to retrieve response headers



  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
      // maxAge: null,
      sameSite: 'none',
      secure: true,
    })
    .json({
      success: true,
      message,
    });
};
