import React, { useEffect, useRef } from "react";

import { DragItemColor } from "../../../store/DragnDrop/store";
import DragnDropUtils from "./dragnDropUtils";
import styled from "styled-components";

interface StyledDragItemProps {
  type: DragItemColor;
  draggable?: boolean;
}

interface DragItemProps {
  name: string;
  multiplier: number;
  type: DragItemColor;
  text: string;
  onDragStart: (name: string) => void;
  onDragEnd: (x: number, y: number) => void;
}

interface PhantomDragItemProps {
  type: DragItemColor;
  text: string;
}

const StyledDragItem = styled.div`
  position: relative;
  background-color: ${({ type }: StyledDragItemProps) => type};
  width: 120px;
  height: 120px;
  border-radius: 70px;
  line-height: 120px;
  text-align: center;

  :hover {
    cursor: ${({ draggable }: StyledDragItemProps) => draggable && "grab"};
  }
`;
const StyledDragItemText = styled.div`
  pointer-events: none;
  user-select: none;
`;

const StyledDragItemMultiplier = styled(StyledDragItemText)`
  color: red;
  position: absolute;
  right: 0;
  top: 0;
  line-height: 20px;
`;

const StyledPhantomDragItem = styled(StyledDragItem)`
  position: absolute;
  display: none;
  z-index: 999;
`;
const PhantomDragItem = React.forwardRef<HTMLDivElement, PhantomDragItemProps>(
  ({ type, text }, ref) => {
    return (
      <StyledPhantomDragItem ref={ref} type={type}>
        <StyledDragItemText>{text}_</StyledDragItemText>
      </StyledPhantomDragItem>
    );
  }
);

function DragItem({
  onDragStart,
  onDragEnd,
  multiplier,
  text,
  name,
  type,
}: DragItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const refPhantom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const classIntance = new DragnDropUtils(ref, refPhantom);

    if (multiplier) {
      classIntance.addEventListeners();
      classIntance.onDragStart(() => onDragStart(name));
      classIntance.onDragEnd((x: number, y: number) => onDragEnd(x, y));
    }

    return () => classIntance.destroy();
  }, [multiplier, name]);

  return (
    <>
      <PhantomDragItem ref={refPhantom} text={text} type={type} />
      <StyledDragItem draggable={!!multiplier} ref={ref} type={type}>
        <StyledDragItemMultiplier>x{multiplier}</StyledDragItemMultiplier>
        <StyledDragItemText>{text}</StyledDragItemText>
      </StyledDragItem>
    </>
  );
}

export default DragItem;
