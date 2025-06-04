export const typeDefs = `#graphql

scalar JSON

type User {
  id: String!
  name: String!
  email: String!
  phone_number: String!
  address: String
  image: String
  role: String
  token: String
  UploadedFile: [UploadedFile]
}
type UploadedFile {
    id: String
    filename: String
    fileUrl: String
    version: Int
    userId: String
    createdAt: String
  }

  type Otp {
  id: ID!
  email: String!
  otp: String! # Numeric OTP
  expiresAt: String!
  verified: Boolean!
  createdAt: String!
}

  type Subscription {
  id: ID!
  email: String!
  expiresAt: String!
  verified: Boolean!
  createdAt: String!
}

type GenerateOtpResponse {
  success: Boolean!
  message: String
  otp: String
  expiresAt: String
}

type VerifyOtpResponse {
  success: Boolean!
  message: String
  token: String
  user: User 
}

type SubscriptionResponse {
  success: Boolean!
  message: String
  expiresAt: String 
}

type Query {
  user: User
  users: [User]
  getUser(email: String!): User
  getUploadedFiles: [UploadedFile!]!
  getSubscribedUserByEmail(email: String!): Subscription
}

type Mutation {
  signUp(
    name: String!,
    email: String!,
    phone_number: String!,
    address: String,
    role: String,
    password: String!,
    confirmPassword: String!
  ): User
  login(identifier:String!, email: String!,phone_number: String!, password: String!): User!
  logout: Boolean!
  uploadFile(fileUrl: String!, filename: String!, userId: String!) : UploadedFile!
  generateOtp(email: String!): GenerateOtpResponse!
  verifyOtp(email: String!, otp: String!): VerifyOtpResponse!
  subscribePlan(email: String!): SubscriptionResponse!
}
`;
