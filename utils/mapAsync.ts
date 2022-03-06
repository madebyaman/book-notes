interface MapAsyncPropsInterface<T> {
  arr: T[];
  func: (arg1: T) => any;
}

async function mapAsync<T>({ arr, func }: MapAsyncPropsInterface<T>) {
  return Promise.all(arr.map((item) => func(item)));
}

export { mapAsync };
