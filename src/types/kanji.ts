class Kanji {
  character: string;
  onyomiReadings: Array<string>;
  kunyomiReadings: Array<string>;
  meanings: Array<string>;

  constructor(parsedResponse: any) {
    this.character = parsedResponse.character;
    this.onyomiReadings = parsedResponse.onyomi_readings;
    this.kunyomiReadings = parsedResponse.kunyomi_readings;
    this.meanings = parsedResponse.meanings;
  }
}

export default Kanji;
