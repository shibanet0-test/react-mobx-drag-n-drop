export function isNodeTypeDragnDropContainer(
  node: Element | HTMLElement | null | undefined
) {
  return (
    node?.hasAttribute("data-type") &&
    node.getAttribute("data-type") === "Drag'n'Drop_container"
  );
}

export function findContainerIdFromCoords(x: number, y: number): number | null {
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
