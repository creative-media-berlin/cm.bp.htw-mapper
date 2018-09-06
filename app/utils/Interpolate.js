class Interpolate {

  updateCurrentPosition(currentPosition) {
    this.currentPosition = currentPosition;
  }

  addListener(listener) {
    this.listener = listener;
  }

  interpolate(vecA, vecB, factor) {
    return [
      vecA[0] + (vecB[0] - vecA[0]) * factor,
      vecA[1] + (vecB[1] - vecA[1]) * factor,
    ];
  }

  start() {
    requestAnimationFrame(() => {
      if (this.currentPosition) {
        if (!this.interpolatedPosition) {
          this.interpolatedPosition = this.currentPosition;
        }
        this.interpolatedPosition = this.interpolate(this.interpolatedPosition, this.currentPosition, 0.2);
        this.emit(this.interpolatedPosition);
      }
      this.start();
    });
  }

  emit(val) {
    this.listener(val);
  }
}

export default Interpolate;
