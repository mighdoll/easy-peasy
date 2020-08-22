import { createSimpleProduce, get } from './lib';
import { combineReducers } from 'redux';

export default function createReducer(
  disableImmer,
  _actionReducersDict,
  _customReducers,
  _computedProperties,
  postActionReducer,
) {
  const simpleProduce = createSimpleProduce(disableImmer);

  const runActionReducerAtPath = (state, action, actionReducer, path) => {
    return simpleProduce(path, state, (draft) =>
      actionReducer(draft, action.payload),
    );
  };

  const reducerForActions = (state, action) => {
    const actionReducer = _actionReducersDict[action.type];
    if (actionReducer) {
      if (action.type.includes('setChartView')) {
        console.log('running setChartView reducer');
      }
      return runActionReducerAtPath(
        state,
        action,
        actionReducer,
        actionReducer.definition.meta.parent,
      );
    }
    return state;
  };

  const reducerForCustomReducers = (state, action) => {
    return _customReducers.reduce((acc, { parentPath, key, reducer: red }) => {
      return simpleProduce(parentPath, acc, (draft) => {
        draft[key] = red(draft[key], action);
        return draft;
      });
    }, state);
  };

  const rootReducer = (state, action) => {
    console.log('rootReducer action:', action);
    console.log('rootReducer state dashItems:', state?.dashboard?.dashItems);
    const stateAfterActions = reducerForActions(state, action);
    const stateAfterCustom =
      _customReducers.length > 0
        ? reducerForCustomReducers(stateAfterActions, action)
        : stateAfterActions;

    console.log(
      'rootReducer stateAfterCustom dashItems:',
      stateAfterCustom?.dashboard?.dashItems,
    );

    const next = postActionReducer
      ? postActionReducer(stateAfterCustom, action)
      : stateAfterCustom;

    if (state !== next) {
      _computedProperties.forEach(({ parentPath, bindComputedProperty }) => {
        const prop = get(parentPath, next);
        if (prop != null) bindComputedProperty(prop);
      });
    }
    return next;
  };

  return rootReducer;
}
