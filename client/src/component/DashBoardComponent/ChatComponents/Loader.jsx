import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <span />
        <span />
        <span />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
.spinner {
 --clr: rgb(203, 213, 225);
 --gap: 4px;
 width: 31px;
 height: 20px;
 display: flex;
 justify-content: center;
 align-items: center;
 gap: var(--gap);
}

.spinner span {
 width: 8px;
 height: 8px;
 border-radius: 100%;
 background-color: var(--clr);
 opacity: 0;
}

.spinner span:nth-child(1) {
 animation: fade 1s ease-in-out infinite;
}

.spinner span:nth-child(2) {
 animation: fade 1s ease-in-out 0.33s infinite;
}

.spinner span:nth-child(3) {
 animation: fade 1s ease-in-out 0.66s infinite;
}

@keyframes fade {
 0%, 100% {
  opacity: 1;
 }

 60% {
  opacity: 0.3;
 }
}`;

export default Loader;
