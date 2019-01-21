function getSecondDiff(toDoLastTime) {
  const now = new Date();
  const timeDiff = Math.abs(now.getTime() - toDoLastTime.getTime());
  return timeDiff / 1000;
}

const recalculateToDoFocusTime = (toDo, isCountingFocusTime) => {
  toDo.isCountingFocusTime = isCountingFocusTime;
  if (toDo.isCountingFocusTime) {
    if (!toDo.lastTime) {
      toDo.lastTime = new Date();
    }
    if (!toDo.elapsedTime) {
      // First time ever
      toDo.elapsedTime = 0;
    } else {
      // The next times
      const secondDiff = getSecondDiff(toDo.lastTime);
      toDo.elapsedTime = Math.floor(toDo.elapsedTime + secondDiff);
      toDo.lastTime = new Date();
    }
  } else {
    // Stops counting focus time
    if (toDo.lastTime) {
      toDo.elapsedTime = Math.floor(toDo.elapsedTime + getSecondDiff(toDo.lastTime));
      delete toDo.lastTime;
    }
  }

  return toDo;
};

export { recalculateToDoFocusTime };
