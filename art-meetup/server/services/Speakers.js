const axios = require('axios');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');

const fsexists = util.promisify(fs.exists);

const CircuitBreaker = require('../lib/CircuitBreaker');
const circuitBreaker = new CircuitBreaker();

class SpeakersService {
  constructor({serviceRegistryUrl, serviceVersion}) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersion = serviceVersion;
    this.cache = {};
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
    const res = await axios.get(`${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersion}`);
    return res.data;
  }

  async callService(reqOptions){
    const servicePath = url.parse(reqOptions.url).path;
    const cacheKey = crypto.createHash('md5').update(reqOptions.method + servicePath).digest('hex');
    let cacheFile = null;

    if (reqOptions.responseType && reqOptions.responseType === 'stream') {
      cacheFile = `${__dirname}/../../_imagecache/${cacheKey}`;
    }

    const result = await circuitBreaker.callService(reqOptions);

    if (!result) {
      if (this.cache[cacheKey]) return this.cache[cacheKey];
      if (cacheFile) {
        const exists = await fsexists(cacheFile);
        if (exists) return fs.createReadStream(cacheFile);
      }
      return false;
    }

    if (!cacheFile) {
      this.cache[cacheKey] = result;
    } else {
      const ws = fs.createWriteStream(cacheFile);
      result.pipe(ws);
    }
    return result;
  }
}

module.exports = SpeakersService;
