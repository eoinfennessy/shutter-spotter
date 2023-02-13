export function assertSubset(subset: Record<string, any> | null, superset: Record<string, any> | null) {
  if (superset === null || subset === null) return false;

  if (superset instanceof Date || subset instanceof Date) return superset.valueOf() === subset.valueOf();

  return Object.keys(subset).every((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!superset.propertyIsEnumerable(key)) return false;
    const subsetItem = subset[key];
    const supersetItem = superset[key];
    if (typeof subsetItem === "object" && subsetItem !== null ? !assertSubset(supersetItem, subsetItem) : supersetItem !== subsetItem) return false;

    return true;
  });
}
