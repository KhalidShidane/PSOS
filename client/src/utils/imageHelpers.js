/**
 * Converts an image File to a compressed base64 data: URI, resizing to
 * fit within maxDimension. There is no file-upload/storage infrastructure
 * in this project, so string fields (User.profileImage, Course.photo)
 * store the image directly - this keeps it small enough to be a
 * reasonable document field (server also caps the string length as a
 * backstop on each of those fields).
 */
export const fileToCompressedDataUrl = (file, { maxDimension = 256, quality = 0.85 } = {}) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read the selected image."));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
