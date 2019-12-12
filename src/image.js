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
