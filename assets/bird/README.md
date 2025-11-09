# Bird Sprite Assets

This directory contains sprite frames for the bird animation.

## Animation States

### Fly Animation (fly_1.png to fly_4.png)
- Used when altitude > 0 and freedom >= 0.2
- Continuous flapping motion
- 4 frames cycling every 100ms

### Glide Animation (glide_1.png to glide_3.png)
- Used when altitude > 0 and freedom < 0.2
- Wings spread, minimal movement
- 3 frames cycling every 150ms

### Hop Animation (hop_1.png to hop_3.png)
- Used when altitude <= 0
- Jumping motion on the ground
- 3 frames cycling every 200ms

## Frame Specifications
- Size: 64x64 pixels
- Format: PNG with transparency
- Background: Transparent
- Style: Simple, warm, minimalist design

## Placeholder Note
Currently using placeholder descriptions. In a real project, these would be actual sprite images created by a designer.
