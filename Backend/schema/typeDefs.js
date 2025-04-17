const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type VitalSign {
    id: ID!
    userId: ID!
    temperature: Float
    heartRate: Int
    bloodPressure: String
    respiratoryRate: Int
    createdAt: String
  }

  type Alert {
    id: ID!
    userId: ID!
    message: String!
    createdAt: String
  }

  type Tip {
    id: ID!
    nurseId: ID!
    patientId: ID!
    message: String!
    createdAt: String
  }

  type SymptomSubmission {
    id: ID!
    userId: ID!
    symptoms: [String!]!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getVitals(userId: ID!): [VitalSign]
    getTips(patientId: ID!): [Tip]
    getPatients: [User]
  }

  type Mutation {
    register(
      name: String!,
      email: String!,
      password: String!,
      role: String!
    ): AuthPayload!

    login(
      email: String!,
      password: String!
    ): AuthPayload!

    addVital(
      userId: ID!,
      temperature: Float,
      heartRate: Int,
      bloodPressure: String,
      respiratoryRate: Int
    ): VitalSign

    sendAlert(
      userId: ID!,
      message: String!
    ): Alert

    sendTip(
      nurseId: ID!,
      patientId: ID!,
      message: String!
    ): Tip

    submitSymptoms(
      userId: ID!,
      symptoms: [String!]!
    ): SymptomSubmission
  }
`;
