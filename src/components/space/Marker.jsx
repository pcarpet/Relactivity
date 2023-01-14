import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* 
Pour faire un marker en mode windows:
https://github.com/google-map-react/google-map-react-examples/blob/master/src/examples/MarkerInfoWindow.js
*/


const Pin = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: ${(props) => (props.isActive ? "#0f0" : "#3788d8")};
  border: 1px solid #000;   
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  &:hover {
    z-index: 1;
  }
`;

const InfoPop = styled.div`
    position: relative;
    transform: translate(-10px, -40px);
    float : left;
    white-space:nowrap;
    padding: 0.5em 1em;
    background-color: #fff;
    border-radius: 0.5em;
    &:after {
      content:""; 
      border-left:7px solid transparent;
      border-right:7px solid transparent;
      border-top: 10px solid #fff;
      position: absolute;
      top: 22px;
      left: 4px;
    }
`;

const Marker = ({ text, onClick, isActive }) => (
  <>
    <Pin
    onClick={onClick}
    isActive={isActive}
    />
    <InfoPop >
      {text}
    </InfoPop>
  </>
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker