// NOTE, PLEASE CREATE 'credentials.json' IN THE EXAMPLES DIRECTORY AND POPULATE IT WITH THE FOLLOWING FROM WATSON:
//{
//  "username": "",
//  "password": "",
//  "workspaceId": ""
//}

const credentials = require('../credentials.json');

if (!credentials && !(credentials.username && credentials.password && credentials.workspaceId)) {
  throw new Error('Invalid credentials supplied!');
}

import * as readline from 'readline';
import * as React from 'react';

import Gabby, { parseReactRoutes, Root, Route } from '../../packages/gabby';
import WatsonAdapter from '../../packages/gabby-adapter-watson';

// conversationId will be set after the first message is sent
let conversationId;
let currentTimer;
let timerCreatedAt;
let currentTimerLength;

const No = () => 'No.';
const Hello = () => 'Hello!';
const Weather = () => 'Where would you like to know the weather for?';
const GetWeather = ({ entities }) =>
  `The weather in ${entities[0].value} is currently cloudy with a temperature of 67 degrees farenheit.`;
const SetTimer = () => 'How long should I set the timer for?';
const SetTimerLength = ({ entities }) => {
  const timerLength = entities[0].value;
  clearTimeout(currentTimer);
  currentTimer = setTimeout(() => {
    log('Ding ding!');
    currentTimer = null;
    timerCreatedAt = null;
    currentTimerLength = null;
  }, timerLength * 1000);
  timerCreatedAt = Date.now();
  currentTimerLength = timerLength;

  return `Okay, I\'ve set your timer for ${timerLength} seconds.`;
};
const CancelTimer = () => {
  if (!currentTimer) {
    return 'You don\'t currently have a timer set!';
  }

  const remaining = currentTimerLength - Math.floor((Date.now() - timerCreatedAt) / 1000);

  clearTimeout(currentTimer);
  currentTimer = null;
  timerCreatedAt = null;

  return `Okay, I\'ve cancelled the timer, there were ${remaining} seconds left.`;
};
const TimeRemaining = () => {
  if (!currentTimer) {
    return 'You don\'t currently have a timer set!';
  }

  const remaining = currentTimerLength - Math.floor((Date.now() - timerCreatedAt) / 1000);

  return `There are ${remaining} seconds remaining.`;
};

// note: @sys-location is a built in entity for watson converse
// for pulling locations out of a message
const routes = parseReactRoutes(
  <Root>
    <Route name="hello" when="#greeting" component={Hello} />
    <Route name="weather" when="#weather" component={Weather}>
      <Route name="get_weather" when="@sys-location" component={GetWeather} />
    </Route>
    <Route name="set_timer" when="#set_timer" component={SetTimer}>
      <Route name="set_timer_length" when="@sys-number" component={SetTimerLength} />
    </Route>
    <Route name="cancel_timer" when="#cancel_timer" component={CancelTimer} />
    <Route name="time_remaining" when="#time_remaining" component={TimeRemaining} />
    <Route name="send_to_mars" when="#send_to_mars" component={No} />
  </Root>
);

const intents = [
  {
    name: 'greeting',
    description: 'Something like "hello", "hey", "hi", "good morning"',
    phrases: [
      'Hello',
      'Hi',
      'Hey',
      'Good morning',
      'Good afternoon',
    ],
  },
  {
    name: 'weather',
    description: 'When asked for weather',
    phrases: [
      'What is the weather?',
      'What\'s the weather?',
      'Can I get the weather?',
      'Show me the weather',
      'I would like to see the weather',
    ],
  },
  {
    name: 'set_timer',
    description: 'For setting a timer',
    phrases: [
      'Set a timer',
      'Can you set a timer',
    ],
  },
  {
    name: 'cancel_timer',
    description: 'For cancelling the current timer',
    phrases: [
      'Can you cancel the timer?'
    ],
  },
  {
    name: 'time_remaining',
    description: 'For getting the time left on the timer',
    phrases: [
      'How much time is left on my timer?'
    ]
  },
  {
    name: 'send_to_mars',
    description: 'Send me to mars?',
    phrases: [
      'Can you send me to mars?',
    ],
  }
];

const entities = [
  {
    name: 'sys-location',
    values: []
  },
  {
    name: 'sys-number',
    values: [],
  }
];

const gabby = new Gabby({
  routes,
  intents,
  entities,
  logger: console,
  adapter: new WatsonAdapter({
    name: 'Assistant',
    logger: console,
    ...credentials,
  })
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function log(msg) {
  console.log(msg);
  rl.prompt();
}

console.log('Training may take some time, please wait until it is complete.');
gabby.applyChanges().then(() => {
  log('Hello, I am your assistant, what can I help you with?');

  rl.on('line', (line) => {
    const str = line.trim();
    gabby.sendMessage(str, conversationId)
      .then(({ msg, conversationId: cid }) => {
        if (!conversationId) {
          conversationId = cid;
        }

        log(msg);
      });
  });
});
