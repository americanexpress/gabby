# Gabby
Gabby provides a way to interface with several chatbot providers. Currently we support Watson conversation API.
 
# Why
Many services provide a user interface for creating your chatbot but when you start to bring more developers into the picture it starts to fall apart. Gabby provides a way to have your chatbot be code/config driven as well as platform agnostic. Having your chatbot as code/config also allows you to version it using source control which makes upgrades and rollbacks a breeze.
 
# Examples
Without JSX config
```javascript
  import Gabby from 'gabby';

  const routes = {
    children: [
      {
        name: 'hello',
        when: '#greeting',
        handler: Hello,
        children: [],
      },
      {
        name: 'goodbye',
        when: '#farewell',
        handler: Goodbye,
        children: [],
      }
    ],
  };

  const gabby = new Gabby({
    name: 'my sweet chatbot',
    credentials: {
      username: 'xxx',
      password: 'xxx',
      workspaceId: 'xxx'
    },
    routes,
    intents: [
      {
        name: 'greeting',
        phrases: ['hello', 'hi', 'what\'s up'],
      },
      {
        name: 'farewell',
        phrases: ['goodbye', 'bye', 'see you tomorrow'],
      },
    ],
    logger: console
  });

  gabby.applyChanges()
    .then(() => {
      console.log('all ready to go!');
      const { msg } = await gabby.sendMessage('hello');
      // send msg to user
    });
```
With JSX config
```javascript
  import Gabby, {
    parseReactRoutes,
    Root,
    Route
  } from 'gabby';

  const routes = (
    <Root>
      <Route name="hello" when="#greeting" component={Hello} />
      <Route name="farewell" when="#farewell" component={Goodbye} />
    </Root>
  );

  const gabby = new Gabby({
    name: 'my sweet chatbot',
    credentials: {
      username: 'xxx',
      password: 'xxx',
      workspaceId: 'xxx'
    },
    routes,
    intents: [
      {
        name: 'greeting',
        phrases: ['hello', 'hi', 'what\'s up'],
      },
      {
        name: 'farewell',
        phrases: ['goodbye', 'bye', 'see you tomorrow'],
      },
    ],
    logger: console
  });

  gabby.applyChanges()
    .then(() => {
      console.log('all ready to go!');
      const { msg } = await gabby.sendMessage('hello');
      // send msg to user
    });
```
 
## Contributing
We welcome Your interest in the American Express Open Source Community on Github. Any Contributor to any Open Source Project managed by the American Express Open Source Community must accept and sign an Agreement indicating agreement to the terms below. Except for the rights granted in this Agreement to American Express and to recipients of software distributed by American Express, You reserve all right, title, and interest, if any, in and to Your Contributions. Please [fill out the Agreement](http://goo.gl/forms/mIHWH1Dcuy).
 
## License
Any contributions made under this project will be governed by the [Apache License 2.0](https://github.com/americanexpress/gabby/blob/master/LICENSE.txt).
 
## Code of Conduct
This project adheres to the [American Express Community Guidelines](https://github.com/americanexpress/gabby/wiki/Code-of-Conduct).
By participating, you are expected to honor these guidelines.