import { TransationKindT } from '../../entities/Transaction';
import { createSelector } from 'reselect';

const getTagsMap = state => state.entities.tags;

export const getTagsList = createSelector(
  [getTagsMap],
  tags => {
    const allTags = [
      ...new Set([
        ...tags[TransationKindT.Expense],
        ...tags[TransationKindT.Income]
      ])
    ];
    return allTags.map(tag => ({ id: tag, name: tag }));
  }
);

export const getTagOptions = state =>
  state.entities.tags[state.ui.form.transaction.kind].map(tag => ({
    key: tag,
    value: tag,
    text: tag
  }));

export const getAllTagsOptions = state =>
  [
    ...new Set([
      ...state.entities.tags[TransationKindT.Expense],
      ...state.entities.tags[TransationKindT.Income]
    ])
  ].map(tag => ({
    key: tag,
    value: tag,
    text: tag
  }));
