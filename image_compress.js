/**
* @Author Martin Duchev
* This file is generated globally and captures all inputs of type 'file' that accept images.
* @COMPRESSION_RATE @type int - Change this value up to 0.99 or 1 to adjust the compression percentile rate
* Optimal compression rate is 0.8
**/

(() => {
  "use strict"

  // Maximum of 1
  const COMPRESSION_RATE = 0.5;

  // HELPER FUNCTIONS
  //Get img size in bytes
  const getImgBase64 = (image) => {
    return fetch(image.src)
    .then( response => response.arrayBuffer() )
    .then( buffer => console.log(buffer) );
  }
  // HELPER FUNCTIONS

  const compressImage = async (file, { quality = 1, type = file.type }) => {
      // Get as image data
      const imageBitmap = await createImageBitmap(file);

      // Draw to canvas
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext('2d');

      // Replicate PNG transperancy
      ctx.fillStyle = '#fff';  /// set white fill style
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(imageBitmap, 0, 0);

      // Turn into Blob
      const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, type, quality)
      );

      // Turn Blob into File
      return new File([blob], file.name, {
          type: blob.type,
      });
  };

  // get all image file inputs and return an array of DOM nodes
  const constructImagesArray = () => {
    const elements = document.querySelectorAll('input[type="file"]');
    const imgUploadElements = [];
    for (let i = 0; i < elements.length; i++) {
      const accept = elements[i].getAttribute('accept');
      const types = ['png', 'jpg', 'jpeg'];
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
  }

  // Store all image nodes in the below immutable variable
  const imagesArray = constructImagesArray();

  imagesArray.forEach( (img) => {
    img.addEventListener('change', async (e) => {
      // Get the files
      const { files } = e.target;

      // No files selected
      if (!files.length) return;

      // Skip compression of PNG images
      // if (files[0].type == 'image/png') return;

      // We'll store the files in this data transfer object
      const dataTransfer = new DataTransfer();

      // For every file in the files list
      for (const file of files) {
          // We don't have to compress files that aren't images
          if (!file.type.startsWith('image')) {
              // Ignore this file, but do add it to our result
              dataTransfer.items.add(file);
              continue;
          }

          // We compress the file by 50%
          const compressedFile = await compressImage(file, {
              quality: COMPRESSION_RATE,
              type: 'image/jpeg',
          });
          // Save back the compressed file instead of the original file
          dataTransfer.items.add(compressedFile);
      }

      // Set value of the file input to our new files list
      e.target.files = dataTransfer.files;
    })
  })
})();