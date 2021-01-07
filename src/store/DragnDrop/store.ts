import { computedFn } from "mobx-utils";
import { findContainerIdFromCoords } from "./utils";
import { makeAutoObservable } from "mobx";
export type DragItemColor = "blue" | "green";
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

export default class DragnDrop {
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
