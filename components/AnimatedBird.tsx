import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import BirdSprite from './BirdSprite';
import { BirdAnimationState } from '../types';

interface AnimatedBirdProps {
  animationState: BirdAnimationState;
  altitude: number; // 0-100
  distance: number;
  freedom: number; // 0-1
  size?: number;
}

const AnimatedBird: React.FC<AnimatedBirdProps> = ({
  animationState,
  altitude,
  distance,
  freedom,
  size = 64,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  // Initialize horizontal position to 0 (center of container)
  const horizontalPosition = useRef(new Animated.Value(0)).current;
  const verticalBob = useRef(new Animated.Value(0)).current;

  // Animation timing based on state and freedom
  const getAnimationTiming = () => {
    switch (animationState) {
      case 'fly':
        // Faster flapping when freedom is higher
        return Math.max(80, 120 - freedom * 40);
      case 'glide':
        return 150;
      case 'hop':
        return 200;
      default:
        return 100;
    }
  };

  // Frame count for each animation
  const getFrameCount = () => {
    switch (animationState) {
      case 'fly':
        return 4;
      case 'glide':
        return 3;
      case 'hop':
        return 3;
      default:
        return 4;
    }
  };

  // Frame animation loop
  useEffect(() => {
    const frameCount = getFrameCount();
    const timing = getAnimationTiming();
    
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frameCount);
    }, timing);

    return () => clearInterval(interval);
  }, [animationState, freedom]);

  // Horizontal movement (constant speed based on distance)
  useEffect(() => {
    const { width: screenWidth } = Dimensions.get('window');
    const cycleDistance = 200; // Distance for one complete cycle
    const position = (distance % cycleDistance) / cycleDistance;
    // Keep bird visible: use -30% to +30% of screen width from center
    const maxOffset = screenWidth * 0.3;
    const xOffset = (position - 0.5) * 2 * maxOffset; // Range: -maxOffset to +maxOffset
    
    Animated.timing(horizontalPosition, {
      toValue: xOffset,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [distance]);

  // Vertical bobbing animation (subtle movement based on freedom)
  useEffect(() => {
    if (animationState === 'hop') {
      // No bobbing for hopping bird
      Animated.timing(verticalBob, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return;
    }

    const bobIntensity = freedom * 10; // 0-10 pixels
    
    const createBobAnimation = () => {
      return Animated.sequence([
        Animated.timing(verticalBob, {
          toValue: -bobIntensity,
          duration: 1000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(verticalBob, {
          toValue: bobIntensity,
          duration: 1000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ]);
    };

    const loop = () => {
      createBobAnimation().start(() => loop());
    };

    loop();
  }, [freedom, animationState]);

  // Calculate vertical position based on altitude
  const getVerticalPosition = () => {
    if (animationState === 'hop') {
      return 150; // Ground level (near bottom of container)
    }
    // Map altitude (0-100) to screen position (higher altitude = higher on screen)
    // Invert: higher altitude = lower translateY value (closer to top)
    // Range: 150 (bottom) to 20 (top)
    return 150 - (altitude * 1.3); // Negative because Y increases downward
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.birdContainer,
          {
            left: '50%',
            marginLeft: -size / 2, // Center the bird horizontally
            transform: [
              { translateX: horizontalPosition },
              { translateY: getVerticalPosition() },
              { translateY: verticalBob },
            ],
          },
        ]}
      >
        <BirdSprite
          animationState={animationState}
          frame={currentFrame}
          size={size}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  birdContainer: {
    position: 'absolute',
  },
});

export default AnimatedBird;
