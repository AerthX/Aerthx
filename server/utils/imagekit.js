const ImageKit = require("imagekit");

// 🔥 Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// 🔥 Upload function
const uploadToImageKit = async (fileBuffer, fileName, folder = "general") => {
  try {
    const response = await imagekit.upload({
      file: fileBuffer,          // buffer (from multer memory)
      fileName: fileName,        // unique name
      folder: folder,            // e.g. /users, /projects
    });

    return {
      url: response.url,
      fileId: response.fileId,
    };
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

// 🔥 Optional: delete file
const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit Delete Error:", error);
  }
};

module.exports = {
  uploadToImageKit,
  deleteFromImageKit,
};