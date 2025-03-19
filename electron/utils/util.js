const path = require('path');
const fs = require('fs');
const { log } = require('./log');

/**
 * 确保文件存在
 * @param {string} filePath 文件路径
 * @returns {boolean} 文件是否存在
 */
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    log(`检查文件是否存在出错 (${filePath}): ${error.message}`);
    return false;
  }
};

/**
 * 确保目录存在，如不存在则创建
 * @param {string} dirPath 目录路径
 * @returns {boolean} 操作是否成功
 */
const ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log(`创建目录: ${dirPath}`);
    }
    return true;
  } catch (error) {
    log(`创建目录失败 (${dirPath}): ${error.message}`);
    return false;
  }
};

/**
 * 复制文件
 * @param {string} source 源文件路径
 * @param {string} destination 目标文件路径
 * @returns {boolean} 操作是否成功
 */
const copyFile = (source, destination) => {
  try {
    if (fileExists(source)) {
      fs.copyFileSync(source, destination);
      log(`成功复制文件: ${source} => ${destination}`);
      return true;
    } else {
      log(`源文件不存在: ${source}`);
      return false;
    }
  } catch (error) {
    log(`复制文件失败: ${error.message}`);
    return false;
  }
};

module.exports = {
  fileExists,
  ensureDirectoryExists,
  copyFile
}; 