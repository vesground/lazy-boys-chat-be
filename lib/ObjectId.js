import { redisClient } from 'lib/redis';
import { validateString } from 'lib/Validator';

// const ObjectId = async () => {
//   let nextIndex = await redisClient.incrAsync('id');
//   const newId = `ObjectId(${nextIndex})`;
//
//   function getObjectIdIndex() {
//     const currentObjectId = this.id;
//     const regExp = /[0-9]/g;
//
//     return currentObjectId.match(regExp);
//   }
//
//   return {
//     id: newId,
//     getObjectIdIndex
//   }
// }

async function getUniqueObjectId(index) {
  validateString({ index });

  if (!index) {
    index = await redisClient.incrAsync('id');
  }

  const objectId = `ObjectId(${index})`;

  return objectId;
}

function getObjectIdIndex(ObjectId) {
  validateString({ ObjectId }, 'required');
  const re = /[0-9]/g;
  const index = ObjectId.match(re).join('');

  return index;
}

export { getUniqueObjectId, getObjectIdIndex };
