# ID-OCR-App-Backend

- In our backed we have intialised our server and intialsed the google-cloud vision and also required these in my app.
- Now I got the cloudinary image url from the frontend.
- Now we have the google cloud vision Api to extract the data from the image we provided.
- Now in imageControler we have our logic of ocr driven by google clound vision app.
- From this we have got the desired results.
- Now in imageControler by getImage we have extracted all the desired details from the image of ID card
    - In this we have sent the the data to databse.
    - we made sure that identification no. should be unique by putting unique value in schema true.
- Now in imageControler by getData wwe have sent data which will be fetched at frontend by localhost:5000
