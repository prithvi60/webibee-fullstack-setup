import { gql } from "@apollo/client";

// Authentication

export const SIGN_UP = gql`
  mutation sigUp(
    $name: String!
    $email: String!
    $phone_number: String!
    $address: String!
    $role: String
    $password: String!
    $confirmPassword: String!
  ) {
    signUp(
      name: $name
      email: $email
      phone_number: $phone_number
      address: $address
      role: $role
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
      role
      phone_number
    }
  }
`;

export const LOGIN = gql`
  mutation login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      id
      name
      email
      phone_number
    }
  }
`;

export const GET_USER = gql`
  query GetUser($email: String!) {
    getUser(email: $email) {
      address
      email
      id
      phone_number
      name
      role
      UploadedFile {
        id
        filename
        fileUrl
      }
    }
  }
`;

export const GET_USERS = gql`
  query Users {
    users {
      id
      name  
      email
      phone_number
      address
      role
      UploadedFile {
        id
        filename
        fileUrl
        version
      }
    }
  }
`;

// upload file

export const CREATE_UPLOAD_FILE = gql`
  mutation UploadFile($fileUrl: String!, $filename: String!, $userId: String!) {
    uploadFile(fileUrl: $fileUrl, filename: $filename, userId: $userId) {
      id
      filename
      fileUrl
      userId
      version
      createdAt
    }
  }
`;

export const GET_UPLOAD_FILE = gql`
  query GetUploadedFiles {
    getUploadedFiles {
      id
      filename
      fileUrl
      userId
      version
      createdAt
    }
  }
`;

// Generate OTP

export const GENERATE_OTP = gql`
  mutation GenerateOtp($email: String!) {
    generateOtp(email: $email) {
      success
      message
      otp
      expiresAt
    }
  }
`;

// subscription

export const SUBSCRIBE_PLAN_MUTATION = gql`
mutation SubscribePlan($email: String!) {
  subscribePlan(email: $email) {
    success
    message
    expiresAt
  }
}
`;

export const GET_SUBSCRIBED_USER = gql`
  query GetSubscribedUserByEmail($email: String!) {
    getSubscribedUserByEmail(email: $email) {
      id
      email
      expiresAt
      verified
      createdAt
    }
  }
`;