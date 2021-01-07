import DragnDropPage from "./Pages/DragnDropPage";
import React from "react";
import styled from "styled-components";

const StyledApp = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  return (
    <StyledApp>
      <DragnDropPage />
    </StyledApp>
  );
}

export default App;
