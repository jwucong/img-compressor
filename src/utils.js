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
