export function getClassName(value) {
  if (value === null) {
    return "Null";
  }
  if (value === undefined) {
    return "Undefined";
  }
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

export function exec(fn) {
  if (typeof fn !== "function") {
    return;
  }
  const args = [].slice.call(arguments, 1);
  return fn.apply(this, args);
}

export function sizeToBytes(size, base = 1000) {
  const pattern = /^\s*\+?((?:\.\d+)|(?:\d+(?:\.\d+)?))\s*([a-z]*)\s*$/i;
  const p = pattern.exec(size);
  if (!p) {
    return NaN;
  }
  const units = ["B", "K", "M", "G", "T", "P", "E", "Z", "Y", "B", "N", "D"];
  const value = parseFloat(p[1]);
  let index = -1;
  for (let i = 0; i < units.length; i++) {
    const str = "^" + units[i] + (i === 0 ? "(?:yte)" : "b") + "?$";
    const reg = new RegExp(str, "i");
    if (reg.test(p[2])) {
      index = i;
      break;
    }
  }
  if (isNaN(value) || value < 0 || index < 0) {
    return NaN;
  }
  return Math.ceil(value * Math.pow(base, index));
}
