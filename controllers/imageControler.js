// Import necessary modules
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
    const thaiIdCardString = result.fullTextAnnotation.text;
  
    // Define regular expressions to extract information from the text
    const thaiNamePattern = /ชื่อตัวและชื่อสกุล น.ส. ณัฐริกา ยางสวย (.+?)\n/;
    const englishNamePattern = /Name (.+?)\n/;
    const lastNamePattern = /Last name (.+?)\n/;
  
    // Extract names using regular expressions
    const thaiNameMatch = thaiIdCardString.match(thaiNamePattern);
    const englishNameMatch = thaiIdCardString.match(englishNamePattern);
    const lastNameMatch = thaiIdCardString.match(lastNamePattern);
  
    // Display the extracted names
    const firstName = thaiNameMatch
      ? thaiNameMatch[1]
      : englishNameMatch
      ? englishNameMatch[1]
      : "";
    const lastName = lastNameMatch ? lastNameMatch[1] : "";
  
    // Log the extracted names to the console
    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
  };
  