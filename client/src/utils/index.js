const allowedExtensions = ["jpg", "jpeg", "png"];

export const getFileType = (uri) => {
  const fileExtension = uri.split('.').pop().toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Invalid file type. Only JPG and PNG are allowed.");
  }

  return fileExtension === "png" ? "image/png" : "image/jpeg";
};

export const getProductTypeObject = (selectedType) => {
        switch (selectedType) {
            case "topup_package":
                return { name: "", price: 0 }
            case "game_account":
                return { username: "", password: "" }     
            default:
                return {}
        }
    }