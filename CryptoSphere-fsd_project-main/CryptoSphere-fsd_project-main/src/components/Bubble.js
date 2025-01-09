import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color || '#ffffff'};
  border-radius: 50%;
  width: ${({ size }) => size || '100px'};
  height: ${({ size }) => size || '100px'};
  margin: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid #0077ff;
  }
`;

const CoinIcon = styled.img`
  width: ${({ size }) => (parseInt(size) * 0.5 || 50) + 'px'};
  height: ${({ size }) => (parseInt(size) * 0.5 || 50) + 'px'};
  object-fit: cover;
`;

const CoinName = styled.div`
  font-size: clamp(12px, 1.5vw, 16px);
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
`;

const Bubble = ({ coin, onClick, size }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onClick(coin.id);
    }
  };

  return (
    <BubbleContainer
      color={coin.color}
      size={size}
      onClick={() => onClick(coin.id)}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex="0"
    >
      {coin.image && <CoinIcon src={coin.image} alt={coin.name || 'Coin'} size={size} />}
      {coin.name && <CoinName>{coin.name}</CoinName>}
    </BubbleContainer>
  );
};

Bubble.propTypes = {
  coin: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
};

Bubble.defaultProps = {
  size: '100px',
};

export default Bubble;
