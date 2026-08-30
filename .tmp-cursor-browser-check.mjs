const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pages = await fetch('http://127.0.0.1:9225/json/list').then((response) => response.json());
const page = pages.find((candidate) => candidate.type === 'page');
if (!page) throw new Error('No debuggable page found');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let sequence = 0;
const pending = new Map();
const events = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const callback = pending.get(message.id);
    if (!callback) return;
    pending.delete(message.id);
    if (message.error) callback.reject(new Error(message.error.message));
    else callback.resolve(message.result);
    return;
  }
  events.push(message);
});

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    includeCommandLineAPI: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

const navigate = async (path) => {
  await send('Page.navigate', { url: `http://localhost:5173${path}` });
  await sleep(3500);
};

const desktop = async (width, height = 900) => {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
};

const moveTo = async (selector) => {
  const point = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  if (!point) return null;
  await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    const rect = element.getBoundingClientRect();
    element.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true,
      pointerType: 'mouse',
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2
    }));
  })()`);
  await sleep(280);
  return evaluate(`(() => {
    const ring = document.querySelector('.kenz-cursor--ring');
    const dot = document.querySelector('.kenz-cursor--dot');
    const element = document.querySelector(${JSON.stringify(selector)});
    return {
      state: ring?.dataset.state,
      ringVisible: ring?.dataset.visible,
      dotVisible: dot?.dataset.visible,
      ringDisplay: ring ? getComputedStyle(ring).display : null,
      nativeCursor: element ? getComputedStyle(element).cursor : null,
      label: ring?.style.getPropertyValue('--cursor-label'),
    };
  })()`);
};

await send('Runtime.enable');
await send('Page.enable');
await send('Log.enable');

const report = { desktop: {}, routes: {}, mobile: {}, reducedMotion: {}, diagnostics: {} };

for (const width of [1280, 1440, 1920]) {
  await desktop(width);
  await navigate('/');
  report.desktop[width] = await evaluate(`({
    finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
    active: document.documentElement.classList.contains('kenz-custom-cursor-active'),
    cursorNodes: document.querySelectorAll('.kenz-cursor').length,
    canvasCount: document.querySelectorAll('canvas').length,
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    pointerListeners: getEventListeners(document).pointermove?.length ?? 0
  })`);
}

await desktop(1440);
await navigate('/');
report.routes.landingCanvas = await moveTo('canvas');
report.routes.navShop = await moveTo('a[href="/shop"]');
const shopPoint = await evaluate(`(() => { const element = document.querySelector('a[href="/shop"]'); const rect = element.getBoundingClientRect(); return {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2}; })()`);
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: shopPoint.x, y: shopPoint.y, button: 'left', clickCount: 1 });
report.routes.clickPressed = await evaluate(`document.querySelector('.kenz-cursor--ring')?.dataset.pressed`);
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: shopPoint.x, y: shopPoint.y, button: 'left', clickCount: 1 });
await sleep(2500);
report.routes.afterNavigation = await evaluate(`({
  path: location.pathname,
  visible: document.querySelector('.kenz-cursor--ring')?.dataset.visible,
  state: document.querySelector('.kenz-cursor--ring')?.dataset.state,
  pointerListeners: getEventListeners(document).pointermove?.length ?? 0
})`);
report.routes.range = await moveTo('input[type="range"]');
report.routes.productView = await moveTo('[data-cursor="view"]');
report.routes.shopButton = await moveTo('button');

await navigate('/login');
report.routes.loginInput = await moveTo('input');

await navigate('/collections');
report.routes.collectionView = await moveTo('[data-cursor="view"]');
report.routes.syntheticView = await evaluate(`(() => {
  const sample = document.createElement('a');
  sample.href = '#cursor-test';
  sample.dataset.cursor = 'view';
  sample.dataset.cursorLabel = 'VIEW';
  sample.style.cssText = 'position:fixed;left:20px;top:120px;width:120px;height:120px';
  document.body.append(sample);
  sample.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: 80, clientY: 180 }));
  const ring = document.querySelector('.kenz-cursor--ring');
  const result = {
    state: ring?.dataset.state,
    visible: ring?.dataset.visible,
    nativeCursor: getComputedStyle(sample).cursor,
    label: ring?.style.getPropertyValue('--cursor-label')
  };
  sample.remove();
  return result;
})()`);

for (const width of [375, 430, 440]) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await navigate('/');
  report.mobile[width] = await evaluate(`(() => {
    const ring = document.querySelector('.kenz-cursor--ring');
    return {
      finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
      coarsePointer: matchMedia('(pointer: coarse)').matches,
      active: document.documentElement.classList.contains('kenz-custom-cursor-active'),
      display: ring ? getComputedStyle(ring).display : null,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  })()`);
}

await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await desktop(1440);
await send('Emulation.setEmulatedMedia', {
  media: '',
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
});
await navigate('/');
report.reducedMotion = await evaluate(`(() => {
  const ring = document.querySelector('.kenz-cursor--ring');
  return {
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    active: document.documentElement.classList.contains('kenz-custom-cursor-active'),
    display: ring ? getComputedStyle(ring).display : null,
    documentCursor: getComputedStyle(document.documentElement).cursor
  };
})()`);

await send('Emulation.setEmulatedMedia', { media: '', features: [] });
await navigate('/');
const beforeMetrics = await send('Performance.getMetrics');
for (let index = 0; index < 120; index += 1) {
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 40 + ((index * 31) % 1300),
    y: 80 + ((index * 17) % 700),
  });
}
await sleep(800);
const afterMetrics = await send('Performance.getMetrics');
const metric = (result, name) => result.metrics.find((item) => item.name === name)?.value ?? 0;
report.diagnostics = {
  pointerListenersAfterRoutes: await evaluate(`getEventListeners(document).pointermove?.length ?? 0`),
  recalcStyleDelta: metric(afterMetrics, 'RecalcStyleCount') - metric(beforeMetrics, 'RecalcStyleCount'),
  layoutDelta: metric(afterMetrics, 'LayoutCount') - metric(beforeMetrics, 'LayoutCount'),
  consoleErrors: events.filter((event) => event.method === 'Runtime.exceptionThrown' || (event.method === 'Log.entryAdded' && event.params.entry.level === 'error')).length,
  errorSamples: events
    .filter((event) => event.method === 'Runtime.exceptionThrown' || (event.method === 'Log.entryAdded' && event.params.entry.level === 'error'))
    .slice(0, 5)
    .map((event) => event.params.entry?.text || event.params.exceptionDetails?.text),
};

console.log(JSON.stringify(report, null, 2));
socket.close();
