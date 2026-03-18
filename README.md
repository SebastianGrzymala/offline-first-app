# Offline-First App

A React Native proof-of-concept demonstrating an offline-first messaging pattern with a prioritized retry queue. Failed requests are persisted locally and automatically retried when connectivity is restored.

Watch the demo:

[![Watch the demo](https://img.youtube.com/vi/Ik5v2C7LHJA/3.jpg)](https://youtube.com/shorts/Ik5v2C7LHJA)

## Project Setup

```bash
npm install
npx expo prebuild
```

## Server

A simple Node.js server is defined in the `/server` folder.

### Using the Remote Server

By default the app connects to a remote server deployed on [onrender.com](https://offline-first-app.onrender.com). Keep in mind it runs on the free tier and has a cold start of about 30 seconds. Additionally, the free tier may occasionally introduce a few seconds of latency on individual requests — this does not happen with the local server.

### Using a Local Server

Replace the URL in [src/api/client.ts](src/api/client.ts) with `http://localhost:3000`, then run:

```bash
npm run server
```

## Running the App

### Simulator

```bash
npx expo run:ios
# or
npx expo run:android
```

> **Note:** There is a known issue in the iPhone simulator with detecting network-back events: https://github.com/react-native-netinfo/react-native-netinfo/issues/7
> To test offline behaviour you can simulate a server outage by shutting down the locally running server.

### Device

```bash
npx expo run:ios --device --configuration Release
# or
npx expo run:android --device --variant release
```

Run in Release configuration. In Debug mode, switching to airplane mode and restarting the app will show an error because the app cannot connect to the Metro bundler.

## Approach

The app uses Axios for HTTP requests. The client has an injected interceptor that detects network errors and adds failed requests to a Zustand store. Two message types are supported:

- **Small messages** — sent as JSON (`application/json`), stored in a **high-priority queue**
- **Large messages** — sent as `multipart/form-data` (assumed to include files), stored in a **low-priority queue**

The `useConsumer` hook monitors both queues. When the device is online, it processes the high-priority queue first — low-priority messages are not processed until the high-priority queue is empty. Retried requests include an `X-Delayed-Message` header so the interceptor can identify them and avoid re-queuing them on subsequent failures.

Queue state is persisted across app restarts using Zustand's `persist` middleware backed by AsyncStorage (2 MB limit). Writes happen asynchronously on connection error (not on retry) and on request success. The initial read happens once on app start.

The offline-first mechanism handles not only the device being offline, but also cases where the server is unreachable (e.g. backend is down with no HTTP response).

All successful requests are logged. Messages that succeed on the first attempt are prefixed `[LIVE]`; messages flushed from the queue are prefixed `[DELAYED]`. The requirement does not specify whether the timestamp should reflect the time of the initial send attempt or the time of final delivery. For simplicity, the logged timestamp reflects the delivery time. To use the initial attempt time instead, read the `X-Delayed-Message` header value — it holds the queue entry ID, which is the Unix timestamp (in milliseconds) of when the message was first queued.

## Tradeoffs and Further Improvements

- If the AsyncStorage limit is too small, SQLite could be used instead.
- Files must NOT be stored in the queue (e.g. as base64). File handling is out of scope for this POC. A future mechanism could reference queued messages to files on disk, the media gallery, or SQLite.
- The queue is processed FIFO (First In, First Out). For some use cases LIFO (Last In, First Out) may be preferable — for example, when sending user location data, the most recent position should take priority.
- AsyncStorage can be replaced with [MMKV](https://github.com/mrousavy/react-native-mmkv) for better performance.
- Currently, queued messages are flushed sequentially. A parallel flush with a configurable concurrency limit could improve throughput.
