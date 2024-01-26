import jwt from 'jsonwebtoken';

// Function to generate a JWT token
const generateToken = (user) => {
      // Create a JWT token with the user information
      const token = jwt.sign(
            {
                  userId: user._id, // Assuming user._id is the unique identifier for the user
                  email: user.email,
                  // You can include any other relevant user data here
            },
            process.env.JWT_SECRET, // Secret key for signing the token
            {
                  expiresIn: '1h', // Token expiration time (e.g., 1 hour)
            }
      );

      return token;
};

export default generateToken;
