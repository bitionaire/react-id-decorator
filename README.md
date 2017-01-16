# README

If your React components should be reusable you may not set the `id` attribute within the HTML elements of your JSX.
If you would like to use a combination of e.g. `<label for="..."/><input id="..."/>` you will need to generate globally unique identifiers
before `render()` will be called. This module tries to solve the need for any repetitive implementation.

## Installation

```bash
npm install --save react-id-decorator
```

## Usage

You can call `Decorate.id(...strings)` with an array of strings (e.g. names of your elements) you want to create identifiers for.
The `props` of the decorated component will be extended by the `id` dictionary you may use to retrieve the generated unique identifiers.

So if you have a component like this ...

```typescript
import * as React from 'react';

class YourComponent extends React.Component {
    render() {
        return (
            <div>
                <label></label>
                <input type="text"/>
            </div>
        )
    }
}
```

... and you want to generate a unique id, just use ...

```typescript
import * as React from 'react';
import { Decorate } from 'react-id-decorator';

@Decorate.id("elementGroup")
class YourComponent extends React.Component {
    render() {
        const { id } = this.props;

        return (
            <div>
                <label htmlFor={id["elementGroup"]}></label>
                <input id={id["elementGroup"]} type="text"/>
            </div>
        )
    }
}
```