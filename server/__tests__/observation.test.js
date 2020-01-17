const observationController = require('../controllers/observation');

test('Pearson Coefficient: all matching', () => {
  const array1 = [0, 1, 1, 1];
  const array2 = [1, 1, 1, 1];
  expect(observationController.getPearsonCoefficient(array1, array2)).toBe(1);
});

test('Pearson Coefficient: none matching', () => {
  const array1 = [0, 0, 0, 0];
  const array2 = [1, 1, 1, 1];
  expect(observationController.getPearsonCoefficient(array1, array2)).toBe(0);
});

test('Pearson Coefficient: some matching', () => {
  const array1 = [0, 1, 1, 0];
  const array2 = [1, 1, 0, 1];
  expect(observationController.getPearsonCoefficient(array1, array2)).toBe(1.0 / 3);
});
