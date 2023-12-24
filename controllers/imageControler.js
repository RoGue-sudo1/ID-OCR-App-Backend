// Import necessary modules

const User = require("../model/user");

module.exports.getImage = async (req, res) => {
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
  const dateOfBirth = dobMatch ? dobMatch[1] : "";
  const dateOfIssue = issueDateMatch ? issueDateMatch[1] : "";
  const dateOfExpiry = expiryDateMatch ? expiryDateMatch[1] : "";

  // Format the information into the specified format
  const formattedData = {
    identification_number: numericalIdNumber,
    name: name,
    last_name: lastName,
    "date-of-birth": dateOfBirth,
    "date-of-issue": dateOfIssue,
    "date-of-expiry": dateOfExpiry,
  };

  // Display the formatted data
  console.log(JSON.stringify(formattedData, null, 2));
};
