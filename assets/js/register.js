let widget = cloudinary.createUploadWidget({ 
    cloudName: "dyi9sqwmt", 
    uploadPreset: "preset1" 
}, 
(error, result) => {
    console.log(error, result);
 });
  widget.open();