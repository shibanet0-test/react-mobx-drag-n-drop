import { autorun, runInAction } from "mobx";

import Store from "./store";

export const store = new Store();

autorun(() => {
  if (store.draggableFromContainerItemInfo !== null) {
    const findedContainer = store.containers.find(
      ({ id }) => id === store.draggableFromContainerItemInfo?.containerId
    );

    let allowedIds: number[] = [];

    if (findedContainer) {
      allowedIds = [...findedContainer.allowedToMoveIn];
    }

    store.containers.forEach((container) =>
      runInAction(() => {
        let isHighlight = false;
        if (allowedIds.length && allowedIds.includes(container.id)) {
          isHighlight = true;
          if (store.containers[container.id]) {
            store.containers[container.id].isHighlight = true;
          }
        }
        const findedContainer = store.containers.find(
          ({ id }) => id === container.id
        );
        if (findedContainer) {
          findedContainer.isHighlight = isHighlight;
        }
      })
    );
  } else {
    store.containers.forEach((container) =>
      runInAction(() => (container.isHighlight = true))
    );
  }
});

autorun(() => {
  store.items.map((item) =>
    runInAction(() => {
      if (item.multiplier <= 0) {
        item.isDraggable = false;
      } else {
        item.isDraggable = true;
      }
    })
  );
});

export default store;
