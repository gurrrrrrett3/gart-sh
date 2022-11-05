import path from "path";

export default class PathUtils {
  static resolve(str: string): string {
    if (str.endsWith(".js")) {
      return path.resolve("./dist/sandbox/" + str);
    } else if (str.startsWith("/bin") && !str.split("/")[str.split("/").length - 1].includes("bin")) {
      return path.resolve("./dist/sandbox/" + str + ".js");
    }

    if (str.startsWith("/")) {
      return path.resolve("./sandbox" + str);
    }

    return path.resolve("./sandbox/", str);
  }

  static toSandbox(str: string): string {
    if (str.startsWith(path.resolve("./sandbox"))) {
      return str.replace(path.resolve("./sandbox"), "");
    } else {
      return "/";
    }
  }
}
