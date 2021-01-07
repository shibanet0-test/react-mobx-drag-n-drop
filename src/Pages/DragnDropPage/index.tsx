import DragItem from "../../Components/DragnDropGroup/DragItem";
import DragnDropContainer from "../../Components/DragnDropGroup/DragnDropContainer";
import React from "react";
import dragnDropStore from "../../store/DragnDrop";
import { observer } from "mobx-react";
import styled from "styled-components";

const StyledDragnDropPage = styled.div``;

function DragnDropPage() {
  return (
    <StyledDragnDropPage>
      {dragnDropStore.containers.map((container) => (
        <DragnDropContainer
          id={container.id}
          isHighlight={!!container.isHighlight}
          key={container.id}
        >
          {dragnDropStore.itemsInContainer(container.id).map((item) => (
            <DragItem
              key={`${item.name}_${item.containerId}`}
              name={item.name}
              onDragEnd={(x, y) => {
                dragnDropStore.clearDraggableFromContainerId(x, y);
              }}
              onDragStart={(name) => {
                dragnDropStore.setDraggableFromContainerId(
                  container.id,
                  name,
                  container.allowedToMoveIn
                );
              }}
              multiplier={item.multiplier}
              type={item.color}
              text={item.name}
            />
          ))}
        </DragnDropContainer>
      ))}
    </StyledDragnDropPage>
  );
}

export default observer(DragnDropPage);
