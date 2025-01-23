const { User, Test } = require("../models/User");

// Save a test
exports.saveTest = async (req, res) => {
  const { testData, manualTest } = req.body;
  const userId = req.userId; // Extracted from the verifyJWT middleware

  try {
    // Create a single Test document with embedded questions
    const testDocument = {
      userId,
      manualTest,
      questions: testData.map((question) => ({
        category: question.category,
        question: question.question,
        correct_answer: question.correct_answer,
        incorrect_answers: question.incorrect_answers,
        difficulty: question.difficulty,
      })),
    };

    const savedTest = await Test.create(testDocument);
    // Add the test ID to the user's tests array
    await User.findByIdAndUpdate(userId, { $push: { tests: savedTest._id } });

    res.status(201).json({ message: "Test saved successfully", savedTest });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to save test", details: error.message });
  }
};

// Delete a test
exports.deleteTest = async (req, res) => {
  const { testId } = req.params;
  const userId = req.userId; // Extracted from the authenticate middleware

  try {
    // Remove test from the Test collection
    const deletedTest = await Test.findOneAndDelete({ _id: testId, userId });

    if (!deletedTest) {
      return res.status(404).json({ error: "Test not found" });
    }

    // Remove test ID from the user's tests array
    await User.findByIdAndUpdate(userId, { $pull: { tests: testId } });

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete test" });
  }
};

// Get all tests
exports.getTests = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate("tests");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ tests: user.tests });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tests" });
  }
};
