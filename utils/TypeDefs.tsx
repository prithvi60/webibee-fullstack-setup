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

type Query {
  user: User
  users: [User]
  getUser(email: String!): User
  getUploadedFiles: [UploadedFile!]!
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
}
`;
