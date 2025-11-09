import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface BirdSpriteProps {
  animationState: 'fly' | 'glide' | 'hop';
  frame: number;
  size?: number;
}

const BirdSprite: React.FC<BirdSpriteProps> = ({ 
  animationState, 
  frame, 
  size = 64 
}) => {
  const renderFlyFrame = (frameNumber: number) => {
    const wingAngle = frameNumber % 2 === 0 ? -20 : 20;
    
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {/* Body */}
        <Circle cx="32" cy="35" r="12" fill="#FFB366" />
        
        {/* Head */}
        <Circle cx="32" cy="20" r="8" fill="#FFB366" />
        
        {/* Beak */}
        <Path d="M40 20 L46 18 L40 22 Z" fill="#FF8C42" />
        
        {/* Eye */}
        <Circle cx="35" cy="18" r="2" fill="#2C3E50" />
        
        {/* Wings - animated based on frame */}
        <Path 
          d={`M20 30 Q${15 + wingAngle} ${25 + wingAngle} 18 35 Q25 40 32 35`} 
          fill="#FF8C42" 
        />
        <Path 
          d={`M44 30 Q${49 - wingAngle} ${25 + wingAngle} 46 35 Q39 40 32 35`} 
          fill="#FF8C42" 
        />
        
        {/* Tail */}
        <Path d="M20 40 Q15 45 22 48 Q25 45 24 42" fill="#FF8C42" />
      </Svg>
    );
  };

  const renderGlideFrame = (frameNumber: number) => {
    const wingOffset = Math.sin(frameNumber * 0.5) * 2;
    
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {/* Body */}
        <Circle cx="32" cy="35" r="12" fill="#FFB366" />
        
        {/* Head */}
        <Circle cx="32" cy="20" r="8" fill="#FFB366" />
        
        {/* Beak */}
        <Path d="M40 20 L46 18 L40 22 Z" fill="#FF8C42" />
        
        {/* Eye */}
        <Circle cx="35" cy="18" r="2" fill="#2C3E50" />
        
        {/* Wings - spread wide for gliding */}
        <Path 
          d={`M12 ${28 + wingOffset} Q8 32 12 38 Q20 42 32 35`} 
          fill="#FF8C42" 
        />
        <Path 
          d={`M52 ${28 + wingOffset} Q56 32 52 38 Q44 42 32 35`} 
          fill="#FF8C42" 
        />
        
        {/* Tail */}
        <Path d="M20 40 Q15 45 22 48 Q25 45 24 42" fill="#FF8C42" />
      </Svg>
    );
  };

  const renderHopFrame = (frameNumber: number) => {
    const hopHeight = frameNumber === 1 ? -5 : 0;
    const bodyY = 35 + hopHeight;
    const headY = 20 + hopHeight;
    
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {/* Ground line */}
        <Path d="M0 50 L64 50" stroke="#8B4513" strokeWidth="2" />
        
        {/* Body */}
        <Circle cx="32" cy={bodyY} r="12" fill="#FFB366" />
        
        {/* Head */}
        <Circle cx="32" cy={headY} r="8" fill="#FFB366" />
        
        {/* Beak */}
        <Path d={`M40 ${headY} L46 ${headY - 2} L40 ${headY + 2} Z`} fill="#FF8C42" />
        
        {/* Eye */}
        <Circle cx="35" cy={headY - 2} r="2" fill="#2C3E50" />
        
        {/* Wings - folded */}
        <Path 
          d={`M24 ${bodyY - 5} Q20 ${bodyY} 24 ${bodyY + 5} Q28 ${bodyY + 3} 30 ${bodyY}`} 
          fill="#FF8C42" 
        />
        <Path 
          d={`M40 ${bodyY - 5} Q44 ${bodyY} 40 ${bodyY + 5} Q36 ${bodyY + 3} 34 ${bodyY}`} 
          fill="#FF8C42" 
        />
        
        {/* Legs */}
        <Path d={`M28 ${bodyY + 10} L26 55`} stroke="#FF8C42" strokeWidth="2" />
        <Path d={`M36 ${bodyY + 10} L38 55`} stroke="#FF8C42" strokeWidth="2" />
        
        {/* Feet */}
        <Path d="M24 55 L28 55" stroke="#FF8C42" strokeWidth="2" />
        <Path d="M36 55 L40 55" stroke="#FF8C42" strokeWidth="2" />
      </Svg>
    );
  };

  const renderFrame = () => {
    switch (animationState) {
      case 'fly':
        return renderFlyFrame(frame);
      case 'glide':
        return renderGlideFrame(frame);
      case 'hop':
        return renderHopFrame(frame);
      default:
        return renderFlyFrame(frame);
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {renderFrame()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BirdSprite;
