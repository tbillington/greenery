# Greenery 🌳

Simple behavior trees.

<!-- prettier-ignore -->
```javascript
const tree = select(
  endSimulation,
  sequence(
    moveInRange,
    select(
      shootEnemy,
      reload
    )
  )
)

const state = {
  player: { x: 5, bullets: 3 },  
  enemy: { x: 10, health: 10 },
  done: false
}

while (!state.done) {
  tree(state)
}
```
