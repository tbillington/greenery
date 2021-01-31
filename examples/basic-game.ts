import {
  Active,
  Behavior,
  Failure,
  select,
  sequence,
  Success,
} from '../src/greenery.ts'

type State = {
  player: {
    x: number
    bullets: number
  }
  enemy: {
    x: number
    health: number
  }
  done: boolean
}

const state: State = {
  player: {
    x: 5,
    bullets: 3,
  },
  enemy: {
    x: 10,
    health: 10,
  },
  done: false,
}

const endSimulation: Behavior<State> = c => {
  if (c.enemy.health > 0) {
    return Failure
  }
  console.log('enemy dead')
  c.done = true
  return Success
}

const moveInRange: Behavior<State> = c => {
  if (Math.abs(c.player.x - c.enemy.x) < 2) {
    return Success
  }
  console.log('moving towards enemy')
  c.player.x += 1
  return Active
}

const shootEnemy: Behavior<State> = c => {
  if (c.player.bullets === 0) {
    return Failure
  }
  console.log('shooting')
  c.enemy.health -= 1
  c.player.bullets -= 1
  return Active
}

const reload: Behavior<State> = c => {
  if (c.player.bullets > 0) {
    return Success
  }
  console.log('reloading')
  c.player.bullets += 3
  return Active
}

const tree: Behavior<State> = select(
  endSimulation,
  sequence(moveInRange, select(shootEnemy, reload)),
)

while (!state.done) {
  const status = tree(state)
  console.log(status, 'player', state.player, 'enemy', state.enemy)
  if (status !== Active) {
    break
  }
}
