import { autorun, makeAutoObservable, runInAction } from "mobx";

import { computedFn } from "mobx-utils";

export type DragItemColor = "blue" | "green";

const isNodeTypeDragnDropContainer = (
  node: Element | HTMLElement | null | undefined
) =>
  node?.hasAttribute("data-type") &&
  node.getAttribute("data-type") === "Drag'n'Drop_container";

function findContainerIdFromCoords(x: number, y: number): number | null {
  let node: Element | undefined | null | HTMLElement = null;
  node = document.elementFromPoint(x, y);
  if (!node) {
    return null;
  }

  for (let i = 0; i < 5; ++i) {
    if (node && isNodeTypeDragnDropContainer(node)) {
      const id = node.getAttribute("data-id");
      if (id) {
        return Number(id);
      }
    }
    node = node?.parentElement;
  }

  return null;
}

interface Item {
  multiplier: number;
  name: string;
  color: DragItemColor;
  isDraggable?: boolean;
  containerId: number;
}

interface Container {
  id: number;
  allowedToMoveIn: number[];
  isHighlight?: boolean;
}

interface DraggableItemInfo {
  containerId: number;
  itemName: string;
  allowedToMoveIn: number[];
}

class DragnDrop {
  draggableFromContainerItemInfo: DraggableItemInfo | null = null;

  items: Item[] = [
    {
      name: "elem1",
      multiplier: 5,
      color: "blue",
      containerId: 1,
    },

    {
      name: "elem2",
      multiplier: 5,
      color: "blue",
      containerId: 1,
    },

    {
      name: "elem1",
      multiplier: 5,
      color: "green",
      containerId: 4,
    },

    {
      name: "elem2",
      multiplier: 5,
      color: "green",
      containerId: 4,
    },
  ];

  containers: Container[] = [
    {
      id: 1,
      isHighlight: true,
      allowedToMoveIn: [2],
    },
    {
      id: 2,
      isHighlight: true,
      allowedToMoveIn: [1],
    },
    {
      id: 3,
      isHighlight: true,
      allowedToMoveIn: [4],
    },
    {
      id: 4,
      isHighlight: true,
      allowedToMoveIn: [3],
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  setDraggableFromContainerId(
    containerId: number,
    itemName: string,
    allowedToMoveIn: number[]
  ) {
    this.draggableFromContainerItemInfo = {
      containerId,
      itemName,
      allowedToMoveIn,
    };
  }

  clearDraggableFromContainerId(x: number, y: number) {
    const targetId = findContainerIdFromCoords(x, y);

    const isAllowedMove =
      targetId &&
      this.draggableFromContainerItemInfo?.allowedToMoveIn.includes(targetId) &&
      this.draggableFromContainerItemInfo !== null &&
      targetId !== this.draggableFromContainerItemInfo.containerId &&
      this.draggableFromContainerItemInfo?.itemName;

    if (targetId && isAllowedMove) {
      const targetItem = this.items.find(
        ({ containerId, name }) =>
          this.draggableFromContainerItemInfo &&
          name === this.draggableFromContainerItemInfo.itemName &&
          containerId === targetId
      );

      const fromItem = this.items.find(
        ({ containerId, name }) =>
          this.draggableFromContainerItemInfo &&
          name === this.draggableFromContainerItemInfo.itemName &&
          containerId === this.draggableFromContainerItemInfo.containerId
      );

      if (fromItem && fromItem.multiplier) {
        fromItem.multiplier -= 1;

        if (targetItem) {
          targetItem.multiplier += 1;
        } else {
          this.items.push({
            ...fromItem,
            multiplier: 1,
            containerId: targetId,
          });
        }
      }
    }

    this.draggableFromContainerItemInfo = null;
  }

  itemsInContainer = computedFn((containerId) => {
    return this.items.filter((item) => item.containerId === containerId);
  });
}

export const dragnDropStore = new DragnDrop();

autorun(() => {
  if (dragnDropStore.draggableFromContainerItemInfo !== null) {
    const findedContainer = dragnDropStore.containers.find(
      ({ id }) =>
        id === dragnDropStore.draggableFromContainerItemInfo?.containerId
    );

    let allowedIds: number[] = [];

    if (findedContainer) {
      allowedIds = [...findedContainer.allowedToMoveIn];
    }

    dragnDropStore.containers.forEach((container) =>
      runInAction(() => {
        let isHighlight = false;
        if (allowedIds.length && allowedIds.includes(container.id)) {
          isHighlight = true;
          if (dragnDropStore.containers[container.id]) {
            dragnDropStore.containers[container.id].isHighlight = true;
          }
        }
        const findedContainer = dragnDropStore.containers.find(
          ({ id }) => id === container.id
        );
        if (findedContainer) {
          findedContainer.isHighlight = isHighlight;
        }
      })
    );
  } else {
    dragnDropStore.containers.forEach((container) =>
      runInAction(() => (container.isHighlight = true))
    );
  }
});

autorun(() => {
  dragnDropStore.items.map((item) =>
    runInAction(() => {
      if (item.multiplier <= 0) {
        item.isDraggable = false;
      } else {
        item.isDraggable = true;
      }
    })
  );
});

export default dragnDropStore;
