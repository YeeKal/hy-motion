import sharp from 'sharp';

/**
 * Next.js API route to resize an image received as a Base64 string.
 * This function scales the image to a maximum of 1 megapixel (1,000,000 pixels)
 * while maintaining its original aspect ratio.
 *
 */
export async function scaleImage(imageData:string, target_pixels:number) {

    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") to get the raw Base64 string.
    const base64String = imageData.split(',')[1];
    
    // Convert the Base64 string to a Buffer, which sharp can process.
    const inputBuffer = Buffer.from(base64String, 'base64');

    // Use sharp to get the image's metadata (width and height).
    const metadata = await sharp(inputBuffer).metadata();
    const { width, height } = metadata;
    const currentPixels = width * height;
    let newWidth = width;
    let newHeight = height;

    if (currentPixels <= target_pixels) {
    const mimeType = imageData.substring(imageData.indexOf(':') + 1, imageData.indexOf(';'));
    return { base64: base64String, mimeType, width:newWidth, height:newHeight };
  }

    // Check if the image needs to be resized.
    // Calculate the scaling factor to maintain the aspect ratio.
    const scaleFactor = Math.sqrt(target_pixels / currentPixels);
    newWidth = Math.floor(width * scaleFactor);
    newHeight = Math.floor(height * scaleFactor);


    // Resize the image using the calculated dimensions.
    const resizedBuffer = await sharp(inputBuffer)
      .resize(newWidth, newHeight)
      .withMetadata()
      .toBuffer();
    //   console.log(`old widthx height:${width}x${height}`)

    //   console.log(`new widthx height:${newWidth}x${newHeight}`)

    // Convert the resized buffer back to a Base64 string.
    const resizedBase64 = resizedBuffer.toString('base64');
    
    // Determine the original image format to reconstruct the data URL.
    const mimeType = imageData.substring(imageData.indexOf(':') + 1, imageData.indexOf(';'));

    // Send the resized Base64 string back in the response.
    return  { base64: resizedBase64, mimeType: mimeType, width:newWidth, height:newHeight }
}