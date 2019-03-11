// const orderElementsInArray = (type, arr) => {
//   if (type !== 'ascending' && type !== 'descending') throw 'Missed type of order';
//
//   const isArray = '';
//
//   const hasArrayElements = arr.length > 1;
//   if ()
//
//   return arr.sort((a, b) => (a - b))
// };
//
// export {
//   orderElementsInArray,
// }
export const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
