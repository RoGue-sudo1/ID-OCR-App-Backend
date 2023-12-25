// Import necessary modules

const User = require("../model/user");
const moment = require("moment");

module.exports.getImage = async (req, res) => {
  try {
    // Import the Google Cloud Vision module
    const vision = require("@google-cloud/vision");

    // Create a new instance of the Google Cloud Vision ImageAnnotatorClient
    const client = new vision.ImageAnnotatorClient();

    // Extract the file name from the request body
    const fileName = req.body.url;

    // Use Google Cloud Vision API to perform text detection on the image
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;

    // Get the full text annotation from the result
    const idCardInfo = result.fullTextAnnotation.text;

    // Regular expressions for extracting information
    const idNumberPattern = /(\d+ \d+ \d+ \d+ \d+)/;
    const thaiNamePattern = /ชื่อตัวและชื่อสกุล น\.ส\. (.+?)\n/;
    const englishNamePattern = /Name (.+?)\n/;
    const lastNamePattern = /Last name (.+?)\n/;
    const dobPattern = /Date of Birth (\d+ \S+ \d+)/;
    const issueDatePattern = /วันออกบัตร\n(\d+ \S+ \d+)/;
    const expiryDatePattern = /วันบัตรหมดอายุ\n(\d+ \S+ \d+)/;

    // Extract information using regular expressions
    const idNumberMatch = idCardInfo.match(idNumberPattern);
    const thaiNameMatch = idCardInfo.match(thaiNamePattern);
    const englishNameMatch = idCardInfo.match(englishNamePattern);
    const lastNameMatch = idCardInfo.match(lastNamePattern);
    const dobMatch = idCardInfo.match(dobPattern);
    const issueDateMatch = idCardInfo.match(issueDatePattern);
    const expiryDateMatch = idCardInfo.match(expiryDatePattern);

    // Convert Thai identification number to numerical format
    const thaiIdNumber = idNumberMatch ? idNumberMatch[1] : "";
    const numericalIdNumber = thaiIdNumber.replace(
      /[\u0E50-\u0E59]/g,
      (digit) => digit.charCodeAt(0) - 3660
    );

    // Get the extracted information
    const name = englishNameMatch
      ? englishNameMatch[1]
      : thaiNameMatch
      ? thaiNameMatch[1]
      : "";
    const lastName = lastNameMatch ? lastNameMatch[1] : "";
    const dateOfBirth = dobMatch
      ? moment(dobMatch[1], "DD MMM YYYY").add(1, "day").format("DD MMM YYYY")
      : "";
    const dateOfIssue = issueDateMatch
      ? moment(issueDateMatch[1], "DD MMM YYYY")
          .add(1, "day")
          .format("DD MMM YYYY")
      : "";
    const dateOfExpiry = expiryDateMatch
      ? moment(expiryDateMatch[1], "DD MMM YYYY")
          .add(1, "day")
          .format("DD MMM YYYY")
      : "";

    // Format the information into the specified format
    const formattedData = {
      identification_number: numericalIdNumber,
      name: name,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      date_of_issue: dateOfIssue,
      date_of_expiry: dateOfExpiry,
    };
    const existingData = await User.findOne({
      identification_number: numericalIdNumber,
    });
    if (existingData && existingData.isActive === false) {
      existingData.isActive = true;
      await existingData.save();
      return res
        .status(200)
        .json({ message: "User creation succesfull", user: formattedData });
    }
    const user = await User.create(formattedData);
    return res
      .status(200)
      .json({ message: "User creation succesfull", user: formattedData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Provide a valid card" });
  }
};

module.exports.getData = async (req, res) => {
  try {
    const data = await User.find({});

    return res
      .status(200)
      .json({ data: data, message: "Data fetched succesfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error occured" });
  }
};

module.exports.deleteData = async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findById(id);
    user.isActive = false;
    await user.save();
    return res.status(200).json({ message: "User succesfully deleted" });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error.message });
  }
};

module.exports.editData = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({
      _id: data._id,
    });
    user.identification_number = data.identification_number;
    user.name = data.name;
    user.last_name = data.last_name;
    user.date_of_birth = data.date_of_birth;
    user.date_of_expiry = data.date_of_expiry;
    user.date_of_issue = data.date_of_issue;
    await user.save();
    return res.status(200).json({ message: "User details succesfully edited" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error occured" });
  }
};
