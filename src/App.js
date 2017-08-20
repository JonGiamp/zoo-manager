import React, { Component } from 'react';
import './css/App.css';
import animals from './data/animal';
import Parc from './class/Parc';

// Animal card element
const AnimalCard = ({animal, count, addAnimal, removeAnimal}) => {
  const handleIncrement = () => addAnimal(animal);
  const handleDecrement = () => removeAnimal(animal);
  // French diet traduction
  const diet = animal.diet === 'carnivorous' ?
    'carnivore' :
    'herbivore';
  return (
    <div className="animal-container">
      <div className="animal-picker">
        <div className="animal-infos">
          <p className="name">{animal.name}</p>
          <p className="infos">{diet} - Taille {animal.weight}</p>
        </div>
        <div className="animal-select">
          <button className="controls" onClick={handleDecrement}>-</button>
          <p className="count">{count}</p>
          <button className="controls" onClick={handleIncrement}>+</button>
        </div>
      </div>
    </div>
  );
};

// Home webpage template
const HomePage = ({animals, pickedAnimals, boxSize, removeAnimal, addAnimal, updateBoxsize, generateBoxes, resetState}) => {
  const handleChange = (event) => updateBoxsize(event.target.value);
  return (
    <div className="section">
      <section className="section section--picker">
        <div className="container container-picker">
          <h2 className="container-title">Choisissez vos animaux</h2>
          {
            animals
            .sort((a, b) => a.name > b.name)
            .map(animal => {
              return (
                <AnimalCard
                  animal={animal}
                  count={pickedAnimals.filter((elem) => elem.id === animal.id).length}
                  key={animal.id}
                  addAnimal={addAnimal}
                  removeAnimal={removeAnimal}
                />
              )
            })
          }
        </div>
      </section>

      <section className="section section--options">
        <div className="container">
          <h2 className="container-title">Options</h2>
          <label htmlFor="box-size">Quelle est la taille des cages ?</label>
          <div className="range-slider">
            <input className="range-slider__range" type="range"
              value={boxSize} min="8" max="20" step="1" name="box-size"
              onChange={handleChange}
            />
            <span className="range-slider__value">{boxSize}</span>
          </div>
        </div>
      </section>

      <section className="section section--confirm">
        <div className="button-container">
          <button className="button button-reset" onClick={resetState}>Reinitialiser</button>
          <button className="button button-send" onClick={generateBoxes}>Générer les cages</button>
        </div>
      </section>
    </div>
  );
}

// Boxes webpage template
const BoxesPage = ({boxes, resetState}) => {
  const handleClick = () => resetState();
  return (
    <div className="section">
      {
        boxes
        .sort((a,b) => a.getSize() < b.getSize())
        .map((box, index) => {
          return (
            <section className="section section--box" key={index}>
              <div className="container container-box">
                <h2 className="box-title">
                  Box {index + 1}
                  <span className="box-size">Taille {box.getSize()} / {box.getLimit()}</span>
                </h2>
                {
                  box.getAnimals().map(animal => {
                    return (
                      <div className="animal-container" key={animal.id}>
                        <div className="animal">
                          <div className="animal-infos">
                            <p className="name">{animal.name}</p>
                            <p className="infos">{animal.diet} - Taille {animal.weight}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </section>
          );
        })
      }
      <section className="section">
        <div className="button-container">
          <button className="button button-reset" onClick={handleClick}>Reinitialiser</button>
        </div>
      </section>
    </div>
  );
};

// Root statefull component
class App extends Component {
  constructor() {
    super();
    this.state = {
      boxSize: 0,
      animals: [],
      pickedAnimals: [],
      boxes: [],
    }
  }

  componentDidMount() {
    this.resetState();
  }

  resetState = () => {
    this.setState({
      boxSize: 10,
      animals: animals.map((elem, index) => Object.assign({}, elem, { id: index})),
      pickedAnimals: [],
      boxes: [],
    });
  }

  generateBoxes = () => {
    // Get selected animals
    const animals = this.state.pickedAnimals;
    if(animals.length === 0) return;
    const boxes = (new Parc())
      .initBoxSize(this.state.boxSize)
      .initAnimals(animals)
      .optimizeAnimals()
      .getBoxes();
    this.setState({
      boxes: [...boxes],
    })
  }

  updateBoxsize = (boxSize) => {
    this.setState({boxSize});
  }

  addAnimal = (animal) => {
    this.setState({
      pickedAnimals: [...this.state.pickedAnimals, Object.assign({}, animal)]
    });
  }

  removeAnimal = (animal) => {
    const copy = [...this.state.pickedAnimals];
    const index = copy.findIndex((element) => element.id === animal.id);
    if(index === -1) return;
    copy.splice(index, 1);
    this.setState({
      pickedAnimals: [...copy]
    });
  }

  render() {
    return (
      <main className="wrapper">
        <section className="section section--title">
          <h1 className="title">Zoo management</h1>
        </section>
        {
          this.state.boxes.length === 0 ?
            (
              <HomePage
                animals={this.state.animals}
                pickedAnimals={this.state.pickedAnimals}
                boxSize={this.state.boxSize}
                removeAnimal={this.removeAnimal}
                addAnimal={this.addAnimal}
                updateBoxsize={this.updateBoxsize}
                generateBoxes={this.generateBoxes}
                resetState={this.resetState}
              />
            ) :
            (
              <BoxesPage
                boxes={this.state.boxes}
                resetState={this.resetState}
              />
            )
        }
      </main>
    );
  }
}

export default App;
