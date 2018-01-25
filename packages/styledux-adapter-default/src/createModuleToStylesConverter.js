import listToStyles from './listToStyles';

export default function createModuleToStylesConverter(options) {
  return modules =>
    modules
      .map(v => listToStyles(v, options))
      .reduce((r, v) => r.concat(v), []);
}
