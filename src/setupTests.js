// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

//? CRA's jest (jsdom 16) has no TextEncoder, react-router 7 needs it
Object.assign(global, { TextEncoder, TextDecoder });
