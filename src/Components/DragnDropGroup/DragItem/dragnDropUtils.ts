import React from "react";

const getTargetCoordsFromTouchEvent = (e: TouchEvent | null) => {
  const coords = { x: 0, y: 0 };

  if (e) {
    coords.x = e.targetTouches[0].clientX;
    coords.y = e.targetTouches[0].clientY;
  }

  return coords;
};

class DragnDropUtils {
  private ref: React.RefObject<HTMLDivElement>;
  private refPhantom: React.RefObject<HTMLDivElement>;

  private isTouchMove: boolean = false;
  private lastTouchMoveEvent: TouchEvent | null = null;
  private onDragStartCb: Function = () => {};
  private onDragEndCb: Function = () => {};
  private destroyCb: Function = () => {};

  constructor(
    ref: React.RefObject<HTMLDivElement>,
    refPhantom: React.RefObject<HTMLDivElement>
  ) {
    this.ref = ref;
    this.refPhantom = refPhantom;
  }

  onDragStart(cb: Function) {
    this.onDragStartCb = cb;
  }

  onDragEnd(cb: (x: number, y: number) => void) {
    this.onDragEndCb = cb;
  }

  handleDragStart(e: DragEvent) {
    if (
      !(
        e?.dataTransfer?.setDragImage &&
        this.ref?.current &&
        this.refPhantom?.current
      )
    ) {
      return;
    }
    this.onDragStartCb();

    const element = this.refPhantom.current;

    const rect = this.ref.current.getBoundingClientRect();

    this.refPhantom.current.style.left = "-10000px";
    this.refPhantom.current.style.top = "-10000px";
    this.refPhantom.current.style.display = "block";

    e.dataTransfer.setDragImage(element, rect.width / 2, rect.height / 2);
  }

  handleDragEnd(e: DragEvent) {
    this.onDragEndCb(e.clientX, e.clientY);
  }

  movePhantomItemWithTouch(x: number, y: number) {
    if (!this.refPhantom?.current) {
      return;
    }

    this.refPhantom.current.style.left = x + "px";
    this.refPhantom.current.style.top = y + "px";
    this.refPhantom.current.style.display = "block";
  }

  hidePhantomItem() {
    if (!this.refPhantom?.current) {
      return;
    }

    this.refPhantom.current.style.display = "none";
  }

  handleEventTouchMove(e: TouchEvent) {
    e.preventDefault();
    this.lastTouchMoveEvent = e;
    if (!this.isTouchMove) {
      // it will be executed once at the beginning of the movement
      this.isTouchMove = true;
      this.onDragStartCb();
    }

    if (!this.ref?.current) {
      return;
    }

    const x = e.touches[0].pageX - this.ref.current.offsetWidth / 2;
    const y = e.touches[0].pageY - this.ref.current.offsetWidth / 2;
    this.movePhantomItemWithTouch(x, y);
  }

  addEventListeners() {
    const touchmove = (e: TouchEvent) => {
      this.handleEventTouchMove(e);
    };
    const touchend = () => {
      this.isTouchMove = false;
      this.hidePhantomItem();

      const coords = getTargetCoordsFromTouchEvent(this.lastTouchMoveEvent);
      this.onDragEndCb(coords.x, coords.y);
    };

    const dragstart = (e: DragEvent) => {
      this.handleDragStart(e);
    };
    const dragend = (e: DragEvent) => {
      this.handleDragEnd(e);
    };

    this.ref.current?.addEventListener("touchmove", touchmove);
    this.ref.current?.addEventListener("touchend", touchend);
    this.ref.current?.addEventListener("touchcancel", touchend);

    this.ref.current?.addEventListener("dragstart", dragstart);
    this.ref.current?.addEventListener("dragend", dragend);

    this.destroyCb = () => {
      this.ref.current?.removeEventListener("touchmove", touchmove);
      this.ref.current?.removeEventListener("touchend", touchend);
      this.ref.current?.removeEventListener("touchcancel", touchend);

      this.ref.current?.removeEventListener("dragstart", dragstart);
      this.ref.current?.removeEventListener("dragend", dragend);
    };
  }

  destroy() {
    this.destroyCb();
  }
}

export default DragnDropUtils;
