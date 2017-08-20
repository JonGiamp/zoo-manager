import Box from './Box';

// Add free properties to each animals and fix id
const formatAnimals = (animals) => {
  try {
    if (!Array.isArray(animals)) {
      throw new TypeError('setAnimals input must be an array');
    }
  } catch (e) {
    return console.error(e);
  }
  return animals
    .sort((a, b) => b.weight > a.weight)
    .map((animal, index) => Object.assign({}, animal, { free: true, id: index }));
};
// Animals filter function
const isLessThan = weight => elem => elem.weight <= weight;
const isEqualTo = weight => elem => elem.weight === weight;

// Animals Parc element
class Parc {
  constructor() {
    this.animals = [];
    this.boxSize = 10;
    this.boxes = [];
  }

  initAnimals(animals) {
    this.animals = formatAnimals(animals);
    return this;
  }

  initBoxSize(size) {
    this.boxSize = size;
    return this;
  }

  getBoxes() {
    return this.boxes;
  }

  getBoxSize() {
    return this.boxSize;
  }

  getLastBox() {
    return this.boxes[0];
  }

  getFreeAnimals() {
    return this.animals
      .filter(animal => animal.free === true);
  }

  getBiggerAnimal() {
    return this.getFreeAnimals()[0];
  }

  getFreeCarnivorous() {
    return this.getFreeAnimals()
      .filter(animal => animal.diet === 'carnivorous');
  }

  getFreeHerbivorous() {
    return this.getFreeAnimals()
      .filter(animal => animal.diet === 'herbivorous');
  }

  getUnfillBoxes() {
    return this.getBoxes()
      .filter(box => !!box.getFreeSpace());
  }

  addBox() {
    const box = new Box(this.boxSize);
    this.boxes = [box, ...this.boxes];
    return box;
  }

  addAnimal(animal, box = this.getLastBox()) {
    const animals = [...this.animals];
    const index = animals.findIndex(elem => elem.id === animal.id);
    animals[index] = Object.assign({}, animals[index], { free: false });
    this.animals = [...animals];
    const freeSpace = box.addAnimal(animal);
    return freeSpace;
  }

  optimizeHerbivorous() {
    // As long as there are free herbivores
    while (this.getFreeHerbivorous().length !== 0) {
      this.addBox();
      let freeSpace = this.getBoxSize();
      // Get free herbivorous smaller than the remaining space
      let herbivorous = this.getFreeHerbivorous()
        .filter(isLessThan(freeSpace));
      /* As long as there are remaining space and
        free herbivores smaller than the remaining space */
      while (freeSpace !== 0 && herbivorous.length !== 0) {
        freeSpace = this.addAnimal(herbivorous[0]);
        herbivorous = this.getFreeHerbivorous()
          .filter(isLessThan(freeSpace));
      }
    }
  }

  optimizeBoxes() {
    // For each unfill box
    this.getUnfillBoxes().map((box) => {
      /* Get the remaining space or
        weight of the smallest animal if it is smaller */
      let freeSpace =
        box.getFreeSpace() > box.getLittleAnimal().weight ?
          box.getLittleAnimal().weight :
          box.getFreeSpace();
      let carnivorous = this.getFreeCarnivorous()
        .filter(isLessThan(freeSpace));
      if (carnivorous.length === 0) return;
      const animal = carnivorous[0];
      freeSpace = this.addAnimal(animal, box);
      carnivorous = this.getFreeCarnivorous()
        .filter(isEqualTo(animal.weight));
      /* As long as there are free carnivorous animal and
        remaining space upper or equal to animal weight */
      while (carnivorous.length !== 0 && freeSpace >= animal.weight) {
        freeSpace = this.addAnimal(carnivorous[0], box);
        carnivorous = this.getFreeCarnivorous()
          .filter(isEqualTo(animal.weight));
      }
    });
  }

  optimizeCarnivorous() {
    // As long as there are free carnivorous
    while (this.getFreeCarnivorous().length !== 0) {
      this.addBox();
      let freeSpace = this.getBoxSize();
      let carnivorous = this.getFreeCarnivorous()
        .filter(isLessThan(freeSpace));
      const animal = carnivorous[0];
      freeSpace = this.addAnimal(animal);
      carnivorous = this.getFreeCarnivorous()
        .filter(isEqualTo(animal.weight));
      /* As long as there are free carnivorous animal and
        remaining space upper or equal to animal weight */
      while (carnivorous.length !== 0 && freeSpace >= animal.weight) {
        freeSpace = this.addAnimal(carnivorous[0]);
        carnivorous = this.getFreeCarnivorous()
          .filter(isEqualTo(animal.weight));
      }
    }
  }

  optimizeAnimals() {
    this.optimizeHerbivorous();
    this.optimizeBoxes();
    this.optimizeCarnivorous();
    return this;
  }
}

export default Parc;
