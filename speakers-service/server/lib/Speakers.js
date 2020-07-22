const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

class SpeakersService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getNames() {
    const data = await this.getData();

    return data.map(speaker => ({
      name: speaker.name,
      shortname: speaker.shortname,
    }));
  }

  async getListShort() {
    const data = await this.getData();
    return data.map(speaker => ({
      name: speaker.name,
      shortname: speaker.shortname,
      title: speaker.title,
    }));
  }

  async getList() {
    const data = await this.getData();
    return data.map(speaker => ({
      name: speaker.name,
      shortname: speaker.shortname,
      title: speaker.title,
      summary: speaker.summary,
    }));
  }

  async getAllArtwork() {
    const data = await this.getData();
    const artwork = data.reduce((acc, elm) => {
      if (elm.artwork) {
        // eslint-disable-next-line no-param-reassign
        acc = [...acc, ...elm.artwork];
      }
      return acc;
    }, []);
    return artwork;
  }

  async getSpeaker(shortname) {
    const data = await this.getData();
    const speaker = data.find(current => current.shortname === shortname);
    if (!speaker) return null;
    return {
      title: speaker.title,
      name: speaker.name,
      shortname: speaker.shortname,
      description: speaker.description,
    };
  }

  async getArtworkForSpeaker(shortname) {
    const data = await this.getData();
    const speaker = data.find(current => current.shortname === shortname);
    if (!speaker || !speaker.artwork) return null;
    return speaker.artwork;
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data).speakers;
  }
}

module.exports = SpeakersService;
