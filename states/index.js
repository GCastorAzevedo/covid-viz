function sinusoidalBasis(...k) {
  return (...x) => {
    return k.reduce((acc, next, i) => {
      return acc + next * x[i];
    }, 0);
  };
}

class ClassicalField {
  constructor(coeffs) {
    this.coeffs = coeffs;
  }
}

class QuantumState {
  constructor(state) {
    this.state = state;
  }
}

function field(coeffs) {
  const components = coeffs.map((kVect) => {
    return sinusoidalBasis(...kvect);
  });
  return (...x) => {
    return components.map((c) => c(...x)).reduce((acc, next) => acc + next, 0);
  };
}

function psi(...field) {}
