export function createTimer(onRender: (deltaTime: number) => void) {
  let stopped = true;
  let lastTime = NaN;

  const step = 1 / 240;
  const bail = 1;

  let acc = 0;

  function update(time: number) {
    if (stopped) {
      return;
    }

    if (lastTime) {
      const deltaTime = (time - lastTime) / 1000;

      if (deltaTime < bail) {
        acc += deltaTime;

        while (acc > step) {
          onRender(step);
          acc -= step;
        }
      }
    }

    lastTime = time;

    requestAnimationFrame(update);
  }

  function start() {
    stopped = false;
    requestAnimationFrame(update);
  }

  function stop() {
    lastTime = NaN;
    stopped = true;
  }

  return {
    start,
    stop,
  };
}
