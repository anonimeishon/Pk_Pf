export class State {
  constructor(player, mapKey) {
    this.player = { x: player.x, y: player.y };
    this.mapKey = mapKey;
  }
  get state() {
    return {
      playerX: this.player.x,
      playerY: this.player.y,
      mapKey: this.mapKey,
    };
  }

  restoreStateBackup() {
    const savedState = window.localStorage.getItem('state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      this.player.x = parsedState.playerX;
      this.player.y = parsedState.playerY;
      this.mapKey = parsedState.mapKey;
    }
    return this.state;
  }

  saveStateBackup(player, mapKey) {
    if (player) {
      this.player.x = player.x;
      this.player.y = player.y;
    }
    if (mapKey) {
      this.mapKey = mapKey;
    }
    window.localStorage.setItem('state', JSON.stringify(this.state));
  }

  updatePlayer(player) {
    this.player = { x: player.x, y: player.y };
  }
  updateMapKey(mapKey) {
    this.mapKey = mapKey;
  }
}
