const allowedExtensions = ["jpg", "jpeg", "png"];

export const getFileType = (uri) => {
  const fileExtension = uri.split('.').pop().toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Invalid file type. Only JPG and PNG are allowed.");
  }

  return fileExtension === "png" ? "image/png" : "image/jpeg";
};