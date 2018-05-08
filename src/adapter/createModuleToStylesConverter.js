import listToStyles from './listToStyles';

export default function createModuleToStylesConverter(options) {
  return modules => {
    const result = [];
    for (let k = 0, len = modules.length; k < len; k += 1) {
      result.push(...listToStyles(modules[k], options));
    }
    return result;
  };
}
