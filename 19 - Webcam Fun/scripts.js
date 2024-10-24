const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const inputs = document.querySelectorAll('input');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(localMediaStream => {
        video.srcObject = localMediaStream;
        video.play();
        paintToCanvas();
      }).catch(err => {
        console.error('Allow the webcam please!', err);
      })
}

function paintToCanvas() {
    const height = video.videoHeight;
    const width = video.videoWidth;

    if (height == 0) return;
    canvas.height = height;
    canvas.width = width;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        pixels = applyEffect(pixels, width, height);
        ctx.putImageData(pixels, 0, 0);
    }, 16)
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'pretty');
    link.innerHTML = `<img src="${data}" alt="pic" />`;
    strip.insertBefore(link, strip.firstChild);
}

function applyEffect(pixels, width, height) {
    const values = {}

    document.querySelectorAll('.rgb input').forEach(input => {
        values[input.name] = Number(input.value);
    });
    
    data = pixels.data;
    for (let i=0; i<data.length; i+=4) {
        //hues
        data[i] = data[i] + values.red;
        data[i+1] = data[i+1] + values.green;
        data[i+2] = data[i+2] + values.blue;
        data[i+3] = data[i+3];

        //splits
        data[i-values.rsplit] = data[i];
        data[i+1-values.gsplit] = data[i+1];
        data[i+2-values.bsplit] = data[i+2];
        
        //blur
        ctx.globalAlpha = 1 - values.antiblur;

        //green screen
        if (data[i] >= values.rmin
            && data[i+1] >= values.gmin
            && data[i+2] >= values.bmin
            && data[i] <= values.rmax
            && data[i+1] <= values.gmax
            && data[i+2] <= values.bmax) {
            data[i] = 0;
            data[i+1] = 255; //make it green
            data[i+2] = 0;
        }
    }

    //Transforms
    pixels = createSwirlEffect(pixels, width, height, values.swirl);
    pixels = createMirrorEffect(pixels, width, height,
        document.querySelector("[name=vmirror]").checked,
        document.querySelector("[name=hmirror]").checked);

    return pixels;
}

function createMirrorEffect(pixels, width, height, vertical, horizontal) {

    if (vertical) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width / 2; x++) {
                const srcIndex = (y * width + x) * 4;
                const destIndex = (y * width + (width - x - 1)) * 4;

                pixels.data[destIndex] = pixels.data[srcIndex];
                pixels.data[destIndex + 1] = pixels.data[srcIndex + 1];
                pixels.data[destIndex + 2] = pixels.data[srcIndex + 2];
                pixels.data[destIndex + 3] = pixels.data[srcIndex + 3]; 
            }
        }
    }

    if (horizontal) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height / 2; y++) {
                const srcIndex = (y * width + x) * 4; 
                const destIndex = ((height - y - 1) * width + x) * 4;

                pixels.data[destIndex] = pixels.data[srcIndex];
                pixels.data[destIndex + 1] = pixels.data[srcIndex + 1];
                pixels.data[destIndex + 2] = pixels.data[srcIndex + 2];
                pixels.data[destIndex + 3] = pixels.data[srcIndex + 3]; 
            }
        }
    }

    return pixels;
}

/*
 * Generated code
 */
function createSwirlEffect(imageData, width, height, strength) {
    if (strength == 0) return imageData;

    const data = new Uint8ClampedArray(imageData.data);
    const centerX = width / 2;
    const centerY = height / 2;
    
    const outputData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Calculate distance from the center
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate the angle of rotation
            const angle = strength * distance;
            const srcX = Math.cos(angle) * dx - Math.sin(angle) * dy + centerX;
            const srcY = Math.sin(angle) * dx + Math.cos(angle) * dy + centerY;

            // Get the source pixel values
            const srcIndex = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
            const destIndex = (y * width + x) * 4;

            // Check if the source pixel is within the bounds
            if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                outputData[destIndex] = data[srcIndex];       // Red
                outputData[destIndex + 1] = data[srcIndex + 1]; // Green
                outputData[destIndex + 2] = data[srcIndex + 2]; // Blue
                outputData[destIndex + 3] = data[srcIndex + 3]; // Alpha
            } else {
                // If out of bounds, copy the original pixel
                outputData[destIndex] = data[destIndex];
                outputData[destIndex + 1] = data[destIndex + 1];
                outputData[destIndex + 2] = data[destIndex + 2];
                outputData[destIndex + 3] = data[destIndex + 3];
            }
        }
    }

    return new ImageData(outputData, width, height);
}

function reset() {
    inputs.forEach(input => input.value = 0);
    document.querySelector("[name=vmirror]").checked = false;
    document.querySelector("[name=hmirror]").checked = false;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);