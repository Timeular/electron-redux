import { BrowserWindow } from 'electron';
import validateAction from '../helpers/validateAction';

const forwardToRenderer = transit => () => next => (action) => {
  if (!validateAction(action)) return next(action);

  if (action.meta &&
    !action.meta.scope &&
    action.meta.scope === 'local') {
    return next(action);
  }

  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  const openWindows = BrowserWindow.getAllWindows();
  openWindows.forEach(({ webContents }) => {
    webContents.send('redux-action', transit.toJSON(rendererAction));
  });

  return next(action);
};

export default forwardToRenderer;
