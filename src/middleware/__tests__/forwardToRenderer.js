import { BrowserWindow } from 'electron';
import transit from 'transit-immutable-js';
import forwardToRenderer from '../forwardToRenderer';

jest.unmock('../forwardToRenderer');

describe('forwardToRenderer', () => {
  it('should pass an action through to the main store', () => {
    const next = jest.fn();
    const action = { type: 'SOMETHING' };

    forwardToRenderer(transit)()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should forward any actions to the renderer', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
      },
    };
    const send = jest.fn();
    BrowserWindow.getAllWindows.mockImplementation(() => [
      {
        webContents: {
          send,
        },
      },
    ]);

    forwardToRenderer(transit)()(next)(action);

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('redux-action', transit.toJSON({
      type: 'SOMETHING',
      meta: {
        some: 'meta',
        scope: 'local',
      },
    }));
  });
});
