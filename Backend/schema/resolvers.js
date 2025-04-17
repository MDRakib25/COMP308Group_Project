const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VitalSign = require('../models/VitalSign');
const Alert = require('../models/Alert');
const Tip = require('../models/Tip');
const SymptomSubmission = require('../models/SymptomSubmission'); // ✅ New model

module.exports = {
  Query: {
    getVitals: async (_, { userId }) => {
      const vitals = await VitalSign.find({ userId });
      return vitals;
    },
    getTips: (_, { patientId }) => Tip.find({ patientId }),
    getPatients: async () => {
      return await User.find({ role: 'patient' });
    },
  },

  Mutation: {
    register: async (_, { name, email, password, role }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('Email already registered');

      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashed, role });
      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      return {
        token,
        user,
      };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid credentials');

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      return {
        token,
        user,
      };
    },

    addVital: (_, args) => {
      const vital = new VitalSign(args);
      return vital.save();
    },

    sendAlert: (_, args) => {
      const alert = new Alert(args);
      return alert.save();
    },

    sendTip: (_, args) => {
      const tip = new Tip(args);
      return tip.save();
    },

    submitSymptoms: async (_, { userId, symptoms }) => {
      const submission = new SymptomSubmission({
        userId,
        symptoms,
        createdAt: new Date().toISOString(),
      });
      return await submission.save();
    },
  },
};
