interface MapAsyncPropsInterface<T, R> {
  arr: T[];
  func: (arg1: T) => Promise<R>;
}

async function mapAsync<T, R>({ arr, func }: MapAsyncPropsInterface<T, R>) {
  return Promise.all(arr.map((item) => func(item)));
}

export { mapAsync };
