import { exec } from "./utils";

export function base64ToArrayBuffer(base64) {
  const str = base64.replace(/^data\:([^;]+);base64,/gim, "");
  const binary = atob(str);
  const size = binary.length;
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < size; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

export function blobToBase64(blob, successHandler, errorHandler) {
  const reader = new FileReader();
  reader.onload = function() {
    exec(successHandler, this.result);
  };
  reader.onerror = function(event) {
    reader.abort();
    exec(errorHandler, event);
  };
  reader.readAsDataURL(blob);
}

export function arrayBufferToBlob(buffer, type) {
  return new Blob([buffer], { type });
}

export function getOrientation(buffer) {
  // -2 not jpeg
  // -1 not defined
  const view = new DataView(buffer);
  if (view.getUint16(0, false) != 0xffd8) {
    return -2;
  }
  const size = view.byteLength;
  let offset = 2;
  while (offset < size) {
    if (view.getUint16(offset + 2, false) <= 8) {
      return -1;
    }
    const marker = view.getUint16(offset, false);
    offset += 2;
    if (marker == 0xffe1) {
      if (view.getUint32((offset += 2), false) != 0x45786966) {
        return -1;
      }
      const little = view.getUint16((offset += 6), false) == 0x4949;
      offset += view.getUint32(offset + 4, little);
      const tags = view.getUint16(offset, little);
      offset += 2;
      for (let i = 0; i < tags; i++) {
        if (view.getUint16(offset + i * 12, little) == 0x0112) {
          return view.getUint16(offset + i * 12 + 8, little);
        }
      }
    } else if ((marker & 0xff00) != 0xff00) {
      break;
    } else {
      offset += view.getUint16(offset, false);
    }
  }
  return -1;
}

export function fixOrientation(canvas, ctx, orientation) {
  const width = canvas.width;
  const height = canvas.height;
  if (orientation > 4) {
    canvas.width = height;
    canvas.height = width;
  }
  const argsMap = {
    "2": [-1, 0, 0, 1, width, 0],
    "3": [-1, 0, 0, -1, width, height],
    "4": [1, 0, 0, -1, 0, height],
    "5": [0, 1, 1, 0, 0, 0],
    "6": [0, 1, -1, 0, height, 0],
    "7": [0, -1, -1, 0, height, width],
    "8": [0, -1, 1, 0, 0, width]
  };
  const defaultArgs = [1, 0, 0, 1, 0, 0];
  const args = argsMap[orientation] || defaultArgs;
  ctx.transform.apply(ctx, args);
}

export function loadImage(src, success, error) {
  const image = new Image();
  image.onload = () => {
    exec(success, image);
  };
  image.onerror = event => {
    exec(error, event);
  };
  image.setAttribute("src", src);
}
