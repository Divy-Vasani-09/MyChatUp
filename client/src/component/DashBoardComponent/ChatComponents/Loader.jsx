import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <div className='bg-transparent rounded-full'>
      <StyledWrapper className='rounded-full'>
        <div className="hourglassBackground rounded-full">
          <div className="hourglassContainer">
            <div className="hourglassCurves" />
            <div className="hourglassCapTop" />
            <div className="hourglassGlassTop" />
            <div className="hourglassSand" />
            <div className="hourglassSandStream" />
            <div className="hourglassCapBottom" />
            <div className="hourglassGlass" />
          </div>
        </div>
      </StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
  .hourglassBackground {
    position: relative;
    background-color: rgb(71, 60, 60);
    height: 25px;
    width: 25px;
    border-radius: 50%;
  }

  .hourglassContainer {
    position: absolute;
    top: 6px;
    left: 7px;
    width: 11px;
    height: 16px;
    -webkit-animation: hourglassRotate 2s ease-in 0s infinite;
    animation: hourglassRotate 2s ease-in 0s infinite;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .hourglassContainer div,
  .hourglassContainer div:before,
  .hourglassContainer div:after {
    transform-style: preserve-3d;
  }

  @-webkit-keyframes hourglassRotate {
    0% {
      transform: rotateX(0deg);
    }

    50% {
      transform: rotateX(180deg);
    }

    100% {
      transform: rotateX(180deg);
    }
  }

  @keyframes hourglassRotate {
    0% {
      transform: rotateX(0deg);
    }

    50% {
      transform: rotateX(180deg);
    }

    100% {
      transform: rotateX(180deg);
    }
  }

  .hourglassCapTop {
    top: 0;
  }

  .hourglassCapTop:before {
    top: -6px;
  }

  .hourglassCapTop:after {
    top: -5px;
  }

  .hourglassCapBottom {
    bottom: 0;
  }

  .hourglassCapBottom:before {
    bottom: -6px;
  }

  .hourglassCapBottom:after {
    bottom: -5px;
  }

  .hourglassGlassTop {
    transform: rotateX(90deg);
    position: absolute;
    top: -4px;
    left: 1px;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    background-color: #999999;
  }

  .hourglassGlass {
    perspective: 100px;
    position: absolute;
    top: 8px;
    left: 5px;
    width: 2px;
    height: 2px;
    background-color: #999999;
    opacity: 0.5;
  }

  .hourglassGlass:before,
  .hourglassGlass:after {
    content: '';
    display: block;
    position: absolute;
    background-color: #999999;
    left: -4px;
    width: 10px;
    height: 6px;
  }

  .hourglassGlass:before {
    top: -6px;
    border-radius: 0 0 6px 6px;
  }

  .hourglassGlass:after {
    bottom: -6px;
    border-radius: 6px 6px 0 0;
  }

  .hourglassCurves:before,
  .hourglassCurves:after {
    content: '';
    display: block;
    position: absolute;
    top: 8px;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: #333;
    animation: hideCurves 2s ease-in 0s infinite;
  }

  .hourglassCurves:before {
    left: 4px;
  }

  .hourglassCurves:after {
    left: 7px;
  }

  @-webkit-keyframes hideCurves {
    0% {
      opacity: 1;
    }

    25% {
      opacity: 0;
    }

    30% {
      opacity: 0;
    }

    40% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes hideCurves {
    0% {
      opacity: 1;
    }

    25% {
      opacity: 0;
    }

    30% {
      opacity: 0;
    }

    40% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }

  .hourglassSandStream:before {
    content: '';
    display: block;
    position: absolute;
    left: 6px;
    width: 1px;
    background-color: white;
    -webkit-animation: sandStream1 2s ease-in 0s infinite;
    animation: sandStream1 2s ease-in 0s infinite;
  }

  .hourglassSandStream:after {
    content: '';
    display: block;
    position: absolute;
    top: 9px;
    left: 5px;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    border-bottom: 2px solid #fff;
    animation: sandStream2 2s ease-in 0s infinite;
  }

  @-webkit-keyframes sandStream1 {
    0% {
      height: 0;
      top: 8px;
    }

    50% {
      height: 0;
      top: 11px;
    }

    60% {
      height: 8px;
      top: 2px;
    }

    85% {
      height: 8px;
      top: 2px;
    }

    100% {
      height: 0;
      top: 2px;
    }
  }

  @keyframes sandStream1 {
    0% {
      height: 0;
      top: 8px;
    }

    50% {
      height: 0;
      top: 11px;
    }

    60% {
      height: 8px;
      top: 2px;
    }

    85% {
      height: 8px;
      top: 2px;
    }

    100% {
      height: 0;
      top: 2px;
    }
  }

  @-webkit-keyframes sandStream2 {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0;
    }

    51% {
      opacity: 1;
    }

    90% {
      opacity: 1;
    }

    91% {
      opacity: 0;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes sandStream2 {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0;
    }

    51% {
      opacity: 1;
    }

    90% {
      opacity: 1;
    }

    91% {
      opacity: 0;
    }

    100% {
      opacity: 0;
    }
  }

  .hourglassSand:before,
  .hourglassSand:after {
    content: '';
    display: block;
    position: absolute;
    left: 1px;
    background-color: white;
    perspective: 500px;
  }

  .hourglassSand:before {
    top: 2px;
    width: 9px;
    border-radius: 1px 1px 6px 6px;
    animation: sandFillup 2s ease-in 0s infinite;
  }

  .hourglassSand:after {
    border-radius: 6px 6px 1px 1px;
    animation: sandDeplete 2s ease-in 0s infinite;
  }

  @-webkit-keyframes sandFillup {
    0% {
      opacity: 0;
      height: 0;
    }

    60% {
      opacity: 1;
      height: 0;
    }

    100% {
      opacity: 1;
      height: 4px;
    }
  }

  @keyframes sandFillup {
    0% {
      opacity: 0;
      height: 0;
    }

    60% {
      opacity: 1;
      height: 0;
    }

    100% {
      opacity: 1;
      height: 4px;
    }
  }

  @-webkit-keyframes sandDeplete {
    0% {
      opacity: 0;
      top: 11px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    1% {
      opacity: 1;
      top: 11px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    24% {
      opacity: 1;
      top: 11px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    25% {
      opacity: 1;
      top: 10px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    50% {
      opacity: 1;
      top: 10px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    90% {
      opacity: 1;
      top: 10px;
      height: 0;
      width: 2px;
      left: 5px;
    }
  }

  @keyframes sandDeplete {
    0% {
      opacity: 0;
      top: 11px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    1% {
      opacity: 1;
      top: 11px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    24% {
      opacity: 1;
      top: 11px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    25% {
      opacity: 1;
      top: 10px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    50% {
      opacity: 1;
      top: 10px;
      height: 4px;
      width: 9px;
      left: 1px;
    }

    90% {
      opacity: 1;
      top: 10px;
      height: 0;
      width: 2px;
      left: 5px;
    }
  }`;

export default Loader;