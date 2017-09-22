import { HOME_PAGE_BUTTON_PRESSED } from '../types/exampleActionTypes'

export const homePageButtonPressed = () => ({
  type: HOME_PAGE_BUTTON_PRESSED,
  payload: { isExampleAction: true },
});

