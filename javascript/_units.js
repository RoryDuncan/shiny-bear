(function() {
  var EventEmitter, Unit, UnitManager, extend, pixels, utils;

  utils = require("./_utils");

  extend = utils.extend;

  pixels = utils.calculatePixelPositions;

  EventEmitter = utils.EventEmitter;

  /*
      The base to all unit objects
  */


  Unit = function(game, name, position, options) {
    this.game = game;
    this.name = name;
    this.position = position != null ? position : {
      x: 0,
      y: 0
    };
    return this.init(options);
  };

  extend(Unit.prototype, EventEmitter.prototype);

  Unit.prototype.init = function(options) {
    if (options == null) {
      options = {};
    }
    this.id = utils.UID("units", true);
    this.visible = options.visibile || false;
    this.sprite = this.game.Sprites[this.name];
    this.addToManagement(options.player);
    this.map = this.game.currentMap.map;
    this.offset = this.map.tilegrid.offset;
    this.size = options.size || this.map.tilegrid.dimensions.tilesize;
    this.zoom = this.map.tilegrid.zoom;
    return extend(this, options);
  };

  Unit.prototype.render = function() {
    var map, size, sprite, xo, xp, xw, yo, yp, yw, zoom;
    map = this.game.currentMap.map;
    if (!map) {
      return;
    }
    if (!this.sprite) {
      return;
    }
    if (!this.visible) {
      return;
    }
    sprite = this.sprite;
    size = this.size;
    zoom = this.zoom;
    xo = this.offset.x * size;
    yo = this.offset.y * size;
    xp = this.position.x * size;
    yp = this.position.y * size;
    xw = (xo + size + xp) * zoom;
    yw = (yo + size + yp) * zoom;
    sprite.render.call(sprite, xp + xo, yp + yo, size, size, zoom);
  };

  Unit.prototype.show = function() {
    return this.visible = true;
  };

  Unit.prototype.hide = function() {
    return this.visible = false;
  };

  Unit.prototype.addToManagement = function(player) {
    if (!this.game) {
      return;
    }
    return this.game.UnitManager.addUnit(this, player);
  };

  module.exports.Unit = Unit;

  UnitManager = function(game, currentPlayer, otherPlayers) {
    var currentPlayerArmy, players;
    this.game = game;
    this.currentPlayer = currentPlayer != null ? currentPlayer : "player1";
    if (otherPlayers == null) {
      otherPlayers = [];
    }
    this.players = players = {};
    currentPlayerArmy = players[this.currentPlayer] = [];
    otherPlayers.forEach(function(name) {
      return players[name] = [];
    });
    this._cache = [];
    this._hasChanged = false;
    this.addUnit = function(Unit, player) {
      if (player === void 0 || player === this.currentPlayer) {
        currentPlayerArmy.push(Unit);
      } else {
        players[player].push(Unit);
      }
      return Unit;
    };
    this.get = function() {
      return players;
    };
    return this;
  };

  extend(UnitManager.prototype, EventEmitter.prototype);

  UnitManager.prototype.cacheCurrentPositions = function() {
    this.map = this.map || (this.game.currentMap || {}).map;
    if (this.map === void 0) {

    }
  };

  UnitManager.prototype.isTileTaken = function() {};

  UnitManager.prototype.getUnitById = function(id) {};

  UnitManager.prototype.getUnitAtTile = function() {};

  UnitManager.prototype.getUnitAt = function(position) {
    var index, playername, players, unit, unitIndex, _i, _len, _ref;
    players = this.get();
    console.log(players, position);
    for (playername in players) {
      index = players[playername];
      _ref = players[playername];
      for (unitIndex = _i = 0, _len = _ref.length; _i < _len; unitIndex = ++_i) {
        unit = _ref[unitIndex];
        if (unit.visible !== true) {
          continue;
        }
        if (unit.position.x === position.x && unit.position.y === position.y) {
          return unit;
        }
      }
    }
    return false;
  };

  UnitManager.prototype.reset = function() {
    var players;
    players = this.get();
    return player.forEach(function(el) {
      return el = [];
    });
  };

  UnitManager.prototype.set = function() {
    return console.log("todo");
  };

  UnitManager.prototype.render = function() {
    var army, player, players, _results;
    players = this.get();
    _results = [];
    for (player in players) {
      army = players[player];
      _results.push(army.forEach(function(unit) {
        return unit.render();
      }));
    }
    return _results;
  };

  module.exports.UnitManager = UnitManager;

}).call(this);

// Generated by CoffeeScript 1.5.0-pre
