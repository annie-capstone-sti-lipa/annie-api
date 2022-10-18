interface IResizeImageOptions {
  maxSize: number;
  file: File;
}

class Helpers {
  public static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default Helpers;
