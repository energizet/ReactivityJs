# ReactivityJs
Allows you to track changes any JavaScript objects

- Made on a __Proxy__
- Does not mixin data and methods to watching object
- Simple interface
- Implementation is hidden in itself
- Small size

:x: Deep observation not delivered

# Import

```javascript
import {ReactivityJs} from "./ReactivityJs.js";
```

# Bind

Target object
```javascript
let person = {name: "Anton", age: 22};
```

###

Watched object
```javascript
person = ReactivityJs.bind(person);
```

Equal
```javascript
person = new Proxy(person, {});
```
> In this case, it turns into a __Proxy__, without watchers
>
> Possibly, but doesn't make sense

###

Pass the controller object in which the control methods will be created
```javascript
let controller = {};
person = ReactivityJs.bind(person, controller);
```

###

Set watcher
```javascript
person = ReactivityJs.bind(person, () => {});
```

###

Set any number of watchers
```javascript
person = ReactivityJs.bind(person, () => {}, () => {}, ...);
```

###

Set any number of watchers and add controller
```javascript
let controller = {};
person = ReactivityJs.bind(person, () => {}, () => {}, ..., controller);
```

# Controller

Add any number of watchers
```javascript
let watcher = () => {};
controller.watch(watcher, () => {}, ...);
```

###

Unwatch any number of watchers
```javascript
controller.unwatch(watcher, () => {}, ...);
```
> The second argument doesn't make sense

###

Stop watching for everyone
```javascript
controller.stopWatch();
```

# Example

```javascript
import {ReactivityJs} from "./ReactivityJs.js";

// Initialize object
let person = {name: "Anton", age: 22};

// Binding watchers and controller
let controller = {};
person = ReactivityJs.bind(person,
    person => console.log(`Hello ${person.name}.`),
    person => console.log(`Your year of birth is ${new Date().getFullYear() - person.age}.`),
    controller);

// Binding new watchers
let dateNow = person => console.log(`Hello ${person.name}, date now is ${new Date().toDateString()}.`);
controller.watch(dateNow, () => console.log("That's all!"));

// Change person
console.log('=====Start=====');
person.name = "Ivan";
console.log('=====End=====');

// Unwatch watchers
controller.unwatch(dateNow, () => {
});

// Change person again
console.log('=====Start=====');
person.age = 29;
console.log('=====End=====');

// Set new watchers
controller.stopWatch();
controller.watch(person => console.log(person));

// And last change
console.log('=====Start=====');
person.gender = 'Helicopter';
console.log('=====End=====');
```