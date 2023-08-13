/**
 * @Author Martin Duchev
 * This file is generated globally and captures all inputs of type 'file' that accept images.
 * @COMPRESSION_RATE @type int - Change this value up to 0.99 or 1 to adjust the compression percentile rate
 * Optimal compression rate is 0.8
 */

(() => {
  "use strict";

  // Maximum compression rate of 1
  const COMPRESSION_RATE = 0.5;

  /**
   * Retrieves the base64 representation of an image.
   * @param {HTMLImageElement} image - The image to retrieve base64 data from.
   * @returns {Promise} - A promise that resolves with the image's array buffer.
   */
  const getImgBase64 = async (image) => {
    return fetch(image.src)
      .then((response) => response.arrayBuffer())
      .then((buffer) => buffer);
  };

  /**
   * Compresses an image file with specified quality and type.
   * @param {File} file - The image file to be compressed.
   * @param {object} options - Compression options including quality and type.
   * @returns {Promise} - A promise that resolves with the compressed image as a File object.
   */
  const compressImage = async (file, { quality = 1, type = file.type }) => {
    const imageBitmap = await createImageBitmap(file);

    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff'; // Set white fill style
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(imageBitmap, 0, 0);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, type, quality)
    );

    return new File([blob], file.name, {
      type: blob.type,
    });
  };

  /**
   * Constructs an array of DOM nodes that are input elements with 'file' type and accept image formats.
   * @returns {Array} - An array of input elements that accept image files.
   */
  const constructImagesArray = () => {
    const elements = document.querySelectorAll('input[type="file"]');
    const imgUploadElements = [];
    const types = ['png', 'jpg', 'jpeg'];

    for (let i = 0; i < elements.length; i++) {
      let accept = elements[i].getAttribute('accept');
      if (accept) {
        for (let x = 0; x < types.length; x++) {
          if (accept.includes(types[x])) {
            imgUploadElements.push(elements[i]);
            break;
          }
        }
      }
    }
    return imgUploadElements;
  };

  // Store all image nodes in the below immutable variable
  const imagesArray = constructImagesArray();

  imagesArray.forEach((img) => {
    img.addEventListener('change', async (e) => {
      let { files } = e.target;

      if (!files.length) return;

      const dataTransfer = new DataTransfer();

      for (const file of files) {
        if (!file.type.startsWith('image')) {
          dataTransfer.items.add(file);
          continue;
        }

        const compressedFile = await compressImage(file, {
          quality: COMPRESSION_RATE,
          type: 'image/jpeg',
        });
        dataTransfer.items.add(compressedFile);
      }

      e.target.files = dataTransfer.files;
    });
  });
})();
