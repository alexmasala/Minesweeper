class Field {
    constructor(width = 9, height = 9, mines = 10) {
      this.name = "Field";
      this.bomb = "💣";
      this.width = width;
      this.height = height;
      this.mines = mines;
      this.data = Array(this.width * this.height).fill(0);
    }
  
    width() {
      return this.width;
    }
  
    height() {
      return this.height;
    }
  
    mines() {
      return this.mines;
    }
  
    get(i, j) {
      if (i > this.height - 1 || j > this.width - 1 || i < 0 || j < 0) {
        // out of range
        return -1;
      }
      return this.data[i * this.width + j];
    }
  
    plant() {
      let planted = this.mines;
      while (planted > 0) {
        for (let i = 0; i < this.height; i++) {
          for (let j = 0; j < this.width; j++) {
            if (
              planted > 0 &&
              this.data[i * this.width + j] === 0 &&
              Math.random() <= 0.1
            ) {
              this.data[i * this.width + j] = this.bomb;
              planted--;
            }
          }
        }
      }
    }
  
    evaluate() {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          let value = 0;
          if (this.get(i, j) === this.bomb) continue;
  
          // top left
          if (this.get(i - 1, j - 1) === this.bomb) value++;
          // top
          if (this.get(i - 1, j) === this.bomb) value++;
          // top right
          if (this.get(i - 1, j + 1) === this.bomb) value++;
          // left
          if (this.get(i, j - 1) === this.bomb) value++;
          // right
          if (this.get(i, j + 1) === this.bomb) value++;
          // bottom left
          if (this.get(i + 1, j - 1) === this.bomb) value++;
          // bottom
          if (this.get(i + 1, j) === this.bomb) value++;
          // bottom right
          if (this.get(i + 1, j + 1) === this.bomb) value++;
  
          this.data[i * this.width + j] = value;
        }
      }
    }
  
    closestCells(i, j) {
      const topLeft = [i - 1, j - 1];
      const top = [i - 1, j];
      const topRight = [i - 1, j + 1];
      const right = [i, j + 1];
      const bottomRight = [i + 1, j + 1];
      const bottom = [i + 1, j];
      const bottomLeft = [i + 1, j - 1];
      const left = [i, j - 1];
  
      const directons = [
        topLeft,
        top,
        topRight,
        right,
        bottomRight,
        bottom,
        bottomLeft,
        left
      ];
  
      const closest = [];
  
      directons.forEach(direction => {
        if (this.get(...direction) !== -1) {
          closest.push(direction);
        }
      });
  
      return closest;
    }
  
    // searches neighbouring cells and returns them
    closest(i, j, result = new Set(), toVisit = []) {
      result.add(i * this.width + j);
  
      const closestCells = this.closestCells(i, j);
  
      closestCells.forEach(coordinates => {
        if (this.get(...coordinates) !== 0) {
          result.add(coordinates[0] * this.width + coordinates[1]);
        } else if (!result.has(coordinates[0] * this.width + coordinates[1])) {
          toVisit.push(coordinates);
        }
      });
  
      if (toVisit.length > 0) {
        this.closest(...toVisit.pop(), result, toVisit);
      }
      return result;
    }
  
    init() {
      this.plant();
      this.evaluate();
    }
  }
  
  export default Field;