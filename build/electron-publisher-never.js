// Minimal shim for electron-publisher-never
// This file provides a no-op publisher implementation so electron-builder
// can require the module during CI when `publish` is set to "never".

class ElectronPublisherNever {
  constructor(...args) {
    // Accept any constructor signature used by app-builder-lib
    this.args = args;
  }

  // No-op publish/upload methods for compatibility with various app-builder-lib calls
  async publish() {
    return;
  }

  async upload() {
    return;
  }

  // Some code paths may call specific lifecycle methods; include safe defaults
  async checkForUpdates() {
    return null;
  }
}

module.exports = ElectronPublisherNever;
module.exports.default = ElectronPublisherNever;
module.exports.createPublisher = (...args) => new ElectronPublisherNever(...args);

// Also export a named property in case the loader expects it
module.exports.ElectronPublisherNever = ElectronPublisherNever;
