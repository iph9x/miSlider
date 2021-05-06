/**
 * @jest-environment jsdom
 */

import View from '../src/ts/view/view';
import Thumb from '../src/ts/subView/thumb';
import Scale from '../src/ts/subView/scale';
import ProgressBar from '../src/ts/subView/progressBar';
import Label from '../src/ts/subView/label';
import states from './states';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

jest.mock('../src/ts/subView/thumb');
jest.mock('../src/ts/subView/label');
jest.mock('../src/ts/subView/progressBar');
jest.mock('../src/ts/subView/scale');

const ThumbMock = Thumb as jest.MockedClass<typeof Thumb>;
const ProgressBarMock = ProgressBar as jest.MockedClass<typeof ProgressBar>;
const LabelMock = Label as jest.MockedClass<typeof Label>;
const ScaleMock = Scale as jest.MockedClass<typeof Scale>;

describe('View: ', () => {
  const $root = $('<div></div>');
  let view: View;

  $(document.body).append($root);

  beforeEach(() => {
    ThumbMock.mockClear();
    ProgressBarMock.mockClear();
    LabelMock.mockClear();
    ScaleMock.mockClear();
  });

  states.forEach(({
    isVertical,
    isRange,
    min,
    max,
    from,
    to,
    inputFromId,
    inputToId,
  }) => {
    test('View called Thumb\'s constructor two times', () => {
      view = new View({
        slider: $root,
        isVertical,
        isRange,
        inputFromId,
        inputToId,
      });
      view.min = min;
      view.max = max;

      view.run();
      expect(ThumbMock).toHaveBeenCalled();
    });

    test('View called Scale\'s constructor once', () => {
      view = new View({ slider: $root });
      view.run();
      expect(ScaleMock).toHaveBeenCalledTimes(1);
    });

    test('View called ProgressBar\'s constructor once', () => {
      view = new View({ slider: $root });
      view.min = min;
      view.max = max;
      view.run();
      expect(ProgressBarMock).toHaveBeenCalledTimes(1);
    });

    test('View called Label\'s constructor once', () => {
      view = new View({ slider: $root });
      view.min = min;
      view.max = max;
      view.run();
      expect(LabelMock).toHaveBeenCalledTimes(2);
    });

    test('method render() must be called on run()', () => {
      view = new View({ slider: $root });
      view.min = min;
      view.max = max;
      const spyViewRender = jest.spyOn(view, 'run');
      spyViewRender.mockImplementation(() => {});

      view.run();
      expect(spyViewRender).toHaveBeenCalled();
    });

    test('typeof from is number', () => {
      view = new View({ slider: $root });
      view.min = min;
      view.max = max;
      view.from = from;
      expect(view.from).toBe(from);
    });

    test('typeof to is number', () => {
      view = new View({ slider: $root });
      view.min = min;
      view.max = max;
      view.to = to;
      expect(view.to).toBe(to);
    });
  });
});
