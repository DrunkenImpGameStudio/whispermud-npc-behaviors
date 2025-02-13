'use strict';

const { Broadcast, Logger } = require('whispermud-core');

module.exports = {
  listeners: {
    updateTick: state => function (config) {
      const now = Date.now();
      let { duration = 60 } = config;
      duration = duration * 1000;
      this.decaysAt = this.decaysAt || now + duration;

      if (now >= this.decaysAt) {
        this.emit('decay');
      } else {
        this.timeUntilDecay = this.decaysAt - now;
      }
    },

    decay: state => function (item) {
      const { room, belongsTo } = this;

      if (belongsTo) {
        const owner = this.findOwner();
        if (owner) {
          Broadcast.sayAt(owner, `Your ${this.name} has rotted away!`);
        }
      }

      if (room) {
        Broadcast.sayAt(room, `${this.name} has rotted away!`);
      }

      Logger.verbose(`${this.id} has decayed.`);
      state.ItemManager.remove(this);
    }
  }
};
