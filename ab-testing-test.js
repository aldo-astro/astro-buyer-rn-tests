const { describe, it } = require('node:test');
const assert = require('node:assert');

// System under test
function getExperimentsFromVariables(remoteConfig) {
  const output = [];

  try {
    const experimentArray = remoteConfig.experiments.split(',');
    if (experimentArray.length === 1 && experimentArray[0] === '') {
      return '[]';
    }

    experimentArray.forEach(experiment => {
      const experimentObject = {};
      if (experiment in remoteConfig) {
        const value = String(remoteConfig[experiment]);
        experimentObject[experiment] = value;
      } else {
        experimentObject[experiment] = '';
      }
      output.push(experimentObject);
    });
    return JSON.stringify(output);
  } catch (err) {
    return '[]';
  }
}

// Testing the built-in JS function that's used by SUT
describe('splitting string test', () => {
  it('successful split', () => {
    const input = 'apple,banana,orange';
    const result = input.split(',');
    assert.deepStrictEqual(result, [ 'apple', 'banana', 'orange' ]);
  })
  it('failed split', () => {
    const input = '';
    const result = input.split(',');
    assert.deepStrictEqual(result, ['']);
  })
});

describe('Test getExperimentsFromVariables', () => {
  it('returns an empty array if the experiments property is empty', () => {
    const remoteConfig = {
      experiments: '',
    };
    const expected = '[]';
    const result = getExperimentsFromVariables(remoteConfig);
    assert.deepStrictEqual(expected, result);
  });

  it('returns an array of objects with experiment properties', () => {
    const remoteConfig = {
      experiments: 'exp1,exp2,exp3',
      exp1: 'value1',
      exp3: 'value3',
    };
    const expected = JSON.stringify([
      { exp1: 'value1' },
      { exp2: '' },
      { exp3: 'value3' },
    ]);
    const result = getExperimentsFromVariables(remoteConfig);
    assert.deepStrictEqual(expected, result);
  });

  it('returns an empty array if any error is thrown', () => {
    const remoteConfig = null;
    const expected = '[]';
    const result = getExperimentsFromVariables(remoteConfig);
    assert.deepStrictEqual(expected, result);
  });
});
