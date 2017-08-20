// Animals box elements
class Box {
  constructor(limit) {
    this.limit = limit;
    this.size = 0;
    this.animals = [];
  }

  getSize() {
    return this.size;
  }

  getLimit() {
    return this.limit;
  }

  getFreeSpace() {
    return this.limit - this.size;
  }

  getAnimals() {
    return this.animals;
  }

  getLittleAnimal() {
    return this.animals[0];
  }

  addAnimal(animal) {
    try {
      if (typeof animal !== 'object' || typeof animal.weight !== 'number') {
        throw new TypeError('addAnimals input type is incorrect');
      }
      if (this.size + animal.weight > this.limit) {
        throw new RangeError('Box size excedeed');
      }
    } catch (e) {
      return console.error(e);
    }
    this.size += animal.weight;
    this.animals = [...this.animals, animal]
      .sort((a, b) => b.weight < a.weight);
    return this.getFreeSpace();
  }
}

export default Box;
