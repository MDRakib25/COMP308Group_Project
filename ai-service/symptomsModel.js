const tf = require("@tensorflow/tfjs");

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [4], units: 10, activation: "relu" }));
model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

model.compile({ optimizer: "adam", loss: "binaryCrossentropy" });

module.exports = model;
