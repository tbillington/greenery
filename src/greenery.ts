export const Success = 1
export const Active = 0
export const Failure = -1

export type Status = typeof Success | typeof Active | typeof Failure

export type Behavior<T> = (context: T) => Status
export type Condition<T> = (context: T) => boolean

export const select = <T>(
  ...children: Behavior<T>[]
): Behavior<T> => context => {
  for (const child of children) {
    const status = child(context)
    if (status !== Failure) {
      return status
    }
  }
  return Failure
}

export const sequence = <T>(
  ...children: Behavior<T>[]
): Behavior<T> => context => {
  for (const child of children) {
    const status = child(context)
    if (status !== Success) {
      return status
    }
  }
  return Success
}

export const invert = <T>(child: Behavior<T>): Behavior<T> => context =>
  -child(context) as Status

export const parallel = <T>(
  succeedLimit: number,
  failLimit: number,
  ...children: Behavior<T>[]
): Behavior<T> => context => {
  let succeeded = 0
  let failed = 0
  for (const child of children) {
    switch (child(context)) {
      case Success:
        succeeded += 1
        break
      case Failure:
        failed += 1
        break
    }
  }
  if (succeedLimit > 0 && succeeded >= succeedLimit) {
    return Success
  }
  if (failLimit > 0 && failed >= failLimit) {
    return Failure
  }
  return Active
}

export const all = <T>(...children: Behavior<T>[]): Behavior<T> => context => {
  for (const child of children) {
    child(context)
  }
  return Active
}

export const condition = <T>(
  condition: Condition<T>,
  child: Behavior<T>,
): Behavior<T> => context => (condition(context) ? child(context) : Failure)
