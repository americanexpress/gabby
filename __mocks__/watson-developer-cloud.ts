// mock conversation class
class ConversationV1 {
  mock(method: string, fn) {
    this[method] = jest.fn(fn);
  }
}

export {
  ConversationV1
}