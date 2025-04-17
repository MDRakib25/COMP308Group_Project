const express = require("express");
const tf = require("@tensorflow/tfjs");
const model = require("./symptomsModel");

const app = express();
app.use(express.json());

app.post("/predict", async (req, res) => {
  const { symptoms } = req.body;

  if (!Array.isArray(symptoms) || symptoms.length !== 4) {
    return res.status(400).json({ error: "Expected array of 4 symptoms" });
  }

  try {
    const inputTensor = tf.tensor([symptoms]);
    const prediction = model.predict(inputTensor);
    const predictionValue = await prediction.data();

    res.json({ prediction: predictionValue[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI service running on port ${PORT}`));
