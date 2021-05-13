import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* 
Pour faire un marker en mode windows:
https://github.com/google-map-react/google-map-react-examples/blob/master/src/examples/MarkerInfoWindow.js
*/


const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: ${(props) => (props.isActive ? "#0f0" : "#f00")};
  border: 2px solid #f00;   
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  &:hover {
    z-index: 1;
  }
`;

const Marker = ({ text, onClick, isActive }) => (
  <Wrapper
        alt={text}
        onClick={onClick}
        isActive={isActive}
  />
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker