import { exec, sizeToBytes } from "./utils";

import { loadImage, getOrientation, fixOrientation } from "./image";

const canvasSupport = () => {
  const canvas = document.createElement("canvas");
  if (!canvas) {
    return false;
  }
  if (typeof canvas.getContext !== "function") {
    return false;
  }
  if (typeof canvas.toBlob !== "function") {
    return false;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return false;
  }
  if (typeof ctx.drawImage !== "function") {
    return false;
  }
  return true;
};

const isEnd = (blob, size, error, delta, threshold) => {
  if (!size || delta <= threshold) {
    return true;
  }
  return Math.abs(blob.size - size) <= Math.abs(error);
};

const qc = (cb, canvas, mime, size, error, min, max) => {
  const q = min + (max - min) / 2;
  const threshold = 0.01;
  const delta = max - min;
  const handler = blob => {
    if (isEnd(blob, size, error, delta, threshold)) {
      return exec(cb, blob);
    }
    const range = blob.size > size ? [min, q] : [q, max];
    const args = [cb, canvas, mime, size, error].concat(range);
    qc.apply(null, args);
  };
  canvas.toBlob(handler, mime, q);
};

const sc = (cb, img, mime, o, canvas, ctx, size, error, min, max, q) => {
  const w0 = img.naturalWidth;
  const h0 = img.naturalHeight;
  const r0 = w0 / h0;
  const width = Math.round(min + (max - min) / 2);
  const height = Math.round(width / r0);
  const threshold = 1;
  const delta = max - min;
  canvas.width = width;
  canvas.height = height;
  fixOrientation(canvas, ctx, 1);
  ctx.clearRect(0, 0, width, height);
  fixOrientation(canvas, ctx, o);
  ctx.drawImage(img, 0, 0);
  const handler = blob => {
    if (w0 <= min || isEnd(blob, size, error, delta, threshold)) {
      return exec(cb, blob);
    }
    const range = blob.size > size ? [min, width] : [width, max];
    const args = [cb, img, mime, o, canvas, ctx, size, error].concat(range, q);
    sc.apply(null, args);
  };
  canvas.toBlob(handler, mime, q || 0.92);
};

const compressor = (file, options, cb) => {
  if (!canvasSupport()) {
    return exec(cb, file);
  }
  const defaults = {
    quality: "75%",
    width: "100%",
    minWidth: "1080",
    size: null,
    error: "50kb"
  };
  const conf = Object.assign({}, defaults, options);
};
