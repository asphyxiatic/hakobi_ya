//-----------------------------------------------------------------------
export function filterObjectProperties(
  obj: Object,
  properties: string[],
): Record<string, any> {
  const newObj: Record<string, any> = {};

  for (const prop of properties) {
    if (obj.hasOwnProperty(prop)) {
      newObj[prop] = obj[prop];
    }
  }

  return newObj;
}
