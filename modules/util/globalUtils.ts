export default class GlobalUtils {
  static formatOptions(str: string[]): {
    [key: string]: string | boolean | number;
  } {
    let options: { [key: string]: string | boolean | number } = {};

    str.forEach((arg) => {
      if (arg.startsWith("--") && arg.includes("=")) {
        const option = arg.replace("--", "");
        if (option.includes("=")) {
          const split = option.split("=");
          options[split[0]] = split[1];
        } else {
          options[option] = true;
        }
      }
    });

    return options;
  }
}
