import merge from 'lodash/merge';
import pick from 'lodash/pick';
import uniqueId from 'lodash/uniqueId';
import upperFirst from 'lodash/upperFirst';

const toQueryString = obj => Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');

const addListener = (target, eventName, handler) => {
  if (typeof handler === 'function') target.on(eventName, handler);
};

const  getBox=(x, y, width, height)=> {
  const x1 = (x + width) < x ? (x + width) : x
  const x2 = (x + width) > x ? (x + width) : x
  const y1 = (y + height) < y ? (y + height) : y
  const y2 = (y + height) > y ? (y + height) : y
  return {
      x1, x2, y1, y2
  }
}
/**
 * 计算字符串的长度
 * @param {string} str 指定的字符串
 * @return {number} 字符串长度
 */
const calcStrLen = str => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};

/**
 * 计算显示的字符串
 * @param {string} str 要裁剪的字符串
 * @param {number} maxWidth 最大宽度
 * @param {number} fontSize 字体大小
 * @return {string} 处理后的字符串
 */
const fittingString = (str, maxWidth, fontSize) => {
  const fontWidth = fontSize * 1.3; // 字号+边距
  maxWidth = maxWidth * 2; // 需要根据自己项目调整
  const width = calcStrLen(str) * fontWidth;
  const ellipsis = '…';
  if (width > maxWidth) {
    const actualLen = Math.floor((maxWidth - 10) / fontWidth);
    const result = str.substring(0, actualLen) + ellipsis;
    return result;
  }
  return str;
};

export {
  merge,
  pick,
  toQueryString,
  uniqueId,
  upperFirst,
  addListener,
  getBox,
  fittingString
};