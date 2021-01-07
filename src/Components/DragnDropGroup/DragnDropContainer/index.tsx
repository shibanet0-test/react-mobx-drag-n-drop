import React from "react";
import styled from "styled-components";

interface StyledDragnDropContainerProps {
  isHighlight: boolean;
}

const StyledDragnDropContainer = styled.div`
  border: 2px solid #000;
  width: 400px;
  height: 160px;
  margin-bottom: 20px;
  background-color: ${({ isHighlight }: StyledDragnDropContainerProps) =>
    isHighlight ? "transparent" : "#ccc"};
`;

const StyledDragnDropContainerContent = styled.div`
  height: 160px;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

interface DragnDropContainerProps {
  id: number;
  children?: React.ReactNode;
  isHighlight: boolean;
}
function DragnDropContainer({
  id,
  children,
  isHighlight,
}: DragnDropContainerProps) {
  return (
    <StyledDragnDropContainer
      data-type="Drag'n'Drop_container"
      data-id={id}
      isHighlight={isHighlight}
    >
      <StyledDragnDropContainerContent>
        {children}
      </StyledDragnDropContainerContent>
    </StyledDragnDropContainer>
  );
}

export default DragnDropContainer;
