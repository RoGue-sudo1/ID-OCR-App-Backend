// Import necessary modules

const User = require("../model/user");
const moment = require("moment");
const CREDENTIALS = JSON.parse(JSON.stringify({
  "type": "service_account",
  "project_id": "ocr-1-409010",
  "private_key_id": "fec8e66e8555447e9a5c74e112d2a778b65bca56",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCx5Wz5Upzlkziz\nogOStULT2y7JSyolRLryOhR3mS3PEFMuLHhVDwFwJTnEUN4kT2zyMVwXqvse3IvW\nxaOTfTrAfgWHQed9QzyitDDeluSS4PiqOEdkmTmipPFuWsbU8bSusORraj3vEox1\n90uyZOTd5a1zSMUkgPhZIPELfNnilXBOOQbkoYwbl9IrkqiN4jjoFr4PEz/O9uSZ\nCa6Ont4Kr97gku4tLVfFonlWBv0mJw/Zsfq2OfUVcGkfLaC4WYJLRGysNdmIcp9E\n5ps1RHDWnsgKvZf86DM1gej2f6a1KAEmqe/ZI5Dk6RcjuOND0g4tUmpap+SCUQ6m\nzgiIm4jpAgMBAAECggEAAcrOK3/b0UtHp7Wi5BQ76V78rG37rXbxDDYuFRtftQWU\n1PMBPlghm1PgrlvjNQnwzsrVAu8HyyKNLRt+H6MEF8LdQuTU1HP8NSZsFJ4ADQPD\ntZFOFNMfW8ZeIU68UJJjz9u73WIrYBB3hku4wUIXdS3WbsIlrE25UsqMayF1n3z+\nIF+eXQIZiJ6Rfn+TThZ7Ij0ESFUSBADU16nwoMArOF4uzA51Vv3EaBuU3v+7Fk9z\nhvFuZuTtQWpHO/7KSAGDjbzhQU63NYY6GptdDVX/fjzrRDg8GQhdYh+3OlwATPH8\nmF1npLMJI/XMPTAwnTrkTvegL1L4iAkIfEB5h1nIJQKBgQDdazEOuxSWozswRhPV\nwDdsfXVHPetCpMeBwp/vwpz/kMlG8uqZGLrewv3NT98bPB7Q9NVcRW5Jvb5doju6\nLdLUVd3lWk4qEQSuJhPjWvxhWNLtCRYGqzKE5f58pI6dBdx1TAO9m+sjJJv3p6gB\ntOo/quaija9vGLubqU3JMqW7LQKBgQDNrhuOEYaLiM0H2Bd44hsnpHD9UlP1YbCo\nVyCkQqKYYR+ffkeJWKV/v0eHD7ZwAIF5lFOdoshQxYHofHNkiT+aw+S88rppSnoz\n3+0ehjieFdJAWDcZaATPkCEX9ZKQJsyMZXUMTEXFSIQai+TBmfQaK/t5HExcmGCc\n2gn6MX1qLQKBgC9Fu2uRtYuTvgdIbuOr7ilTf75+EcRgudeSXeMqgapulwp2wm99\nQChfKSC0dMWzyECEhSj2Cd3kjMgg4u+U6PY8fuuApD+G8qDbsFNSEaAW/rFsxy8V\nTevhzrt9xpTvs2m3mPTaXRFbt5DgUpZKsdh1/FeoOFRXy3YoZ1sVXRzhAoGAOIJ7\ng58BDlk5q8wNNuM4fr3JZXA3LRX4CWhWyYqdTaxxmcqCMRQv9FdDebIxd7hL2nGM\nP6U30ClTteJredXTqdvkfp1Z5g/WX2ZIqbhK2fQ43gDespZHrBd3YDPSXtSqInDF\npelWygtQcFK7OQ3paT9oSjAiMtaSxMWLNDhgsskCgYEArs9GE40N73L7fspdXlyL\nOTVIEw52hY0OyE4chalMV2ZC5Hh46KLkk1nwDJUIy/NECMEZgvtz4A9Qc7m8zJLu\najiU7vN6+VnWLMECJbpMaTJUpvUNPMrO8wmNfmAcKJ9WRgsWyH6CZ16ExrJkLvP3\nUwSLAJdgyub/0GZRWbAZKIQ=\n-----END PRIVATE KEY-----\n",
  "client_email": "ocr-327@ocr-1-409010.iam.gserviceaccount.com",
  "client_id": "115832801937838128445",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ocr-327%40ocr-1-409010.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
 
  ))
  
  const CONFIG = {
      credentials: {
          private_key: CREDENTIALS.private_key,
          client_email: CREDENTIALS.client_email
      }
  };

module.exports.getImage = async (req, res) => {
  try {
    // Import the Google Cloud Vision module
    const vision = require("@google-cloud/vision");

    // Create a new instance of the Google Cloud Vision ImageAnnotatorClient
    const client = new vision.ImageAnnotatorClient(CONFIG);

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
        .json({ message: "User creation successfull", user: formattedData });
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
