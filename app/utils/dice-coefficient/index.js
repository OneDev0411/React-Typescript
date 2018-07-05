import _ from 'underscore'

export function compareTwoStrings(str1, str2) {
  let result = null;
  result = calculateResultIfIdentical(str1, str2);
  if (result != null) {
    return result;
  }
  result = calculateResultIfEitherIsEmpty(str1, str2);
  if (result != null) {
    return result;
  }
  result = calculateResultIfBothAreSingleCharacter(str1, str2);
  if (result != null) {
    return result;
  }

  const pairs1 = wordLetterPairs(str1.toUpperCase());
  const pairs2 = wordLetterPairs(str2.toUpperCase());
  let intersection = 0;
  const union = pairs1.length + pairs2.length;

  _.each(pairs1, pair1 => {
    for(let i = 0; i < pairs2.length; i++) {
      const pair2 = pairs2[i];
      if (pair1 === pair2) {
        intersection++;
        pairs2.splice(i, 1);
        break;
      }
    }
  });

  return (2.0 * intersection) / union;
}

function letterPairs(str) {
  const numPairs = str.length - 1;
  const pairs = [];
  for(let i = 0; i < numPairs; i++) {
    pairs[i] = str.substring(i, i + 2);
  }
  return pairs;
}

function flattenDeep(arr) {
  return Array.isArray(arr)
  ? arr.reduce( (a, b) => [...flattenDeep(a), ...flattenDeep(b)] , [])
  : [arr]
}

function wordLetterPairs(str) {
  return flattenDeep(_.map(str.split(' '), letterPairs));
}

function calculateResultIfIdentical(str1, str2) {
  if (str1.toUpperCase() == str2.toUpperCase()) {
    return 1;
  }
  return null;
}

function calculateResultIfBothAreSingleCharacter(str1, str2) {
  if (str1.length == 1 && str2.length == 1) {
    return 0;
  }
}

function calculateResultIfEitherIsEmpty(str1, str2) {
  // if both are empty strings
  if (str1.length == 0 && str2.length == 0) {
    return 1;
  }

  // if only one is empty string
  if ((str1.length + str2.length) > 0 && (str1.length * str2.length) == 0) {
    return 0;
  }
  return null;
}