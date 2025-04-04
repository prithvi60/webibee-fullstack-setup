export const typeDefs = `#graphql

scalar JSON

type User {
  id: String!
  name: String!
  email: String!
  phone_number: String
  address: String
  image: String
  token: String
}

type Query {
  user: User
  users: [User]
  getUser(email: String!): User
}

type Mutation {
  signUp(
    name: String!,
    email: String!,
    phone_number: String!,
    address: String,
    password: String!,
    confirmPassword: String!
  ): User
  
  login(email: String!, password: String!): User!
  
  logout: Boolean!
}
`;
