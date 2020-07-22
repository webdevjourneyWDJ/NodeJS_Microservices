const axios = require('axios');

class SpeakersService {
  constructor({serviceRegisrtyUrl, serviceVersion}) {
    this.serviceRegisrtyUrl = serviceRegisrtyUrl;
    this.serviceVersion = serviceVersion;
  }

  async getImage(path) {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      responseType: 'stream',
      url: `http://${ip}:${port}/images/${path}`
    });
  }

  async getNames() {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/names`
    });
  }

  async getListShort() {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list-short`
    });
  }

  async getList() {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`
    });
  }

  async getAllArtwork() {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artworks`
    });
  }

  async getSpeaker(shortname) {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/speaker/${shortname}`
    });
  }

  async getArtworkForSpeaker(shortname) {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork/${shortname}`
    });
  }

  async getService(serviceName){
    const res = await axios.get(`${this.serviceRegisrtyUrl}/find/${serviceName}/${this.serviceVersion}`);
    return res.data;
  }

  async callService(reqOptions){
    const res = await axios(reqOptions);
    return res.data;
  }
}

module.exports = SpeakersService;
