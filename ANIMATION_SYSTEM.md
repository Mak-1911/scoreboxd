# Scroll-Based Animation System Documentation

This document explains how to use the sophisticated scroll-based animation system implemented in the Scoreboxd application.

## Overview

The animation system provides:
- Scroll-triggered animations that activate as elements enter the viewport
- Smooth animations that work in both scroll directions (down and up)
- Modern animation effects like fade-ins, slide-ins, parallax effects, and staggered animations
- Performance-optimized animations that don't impact page loading or responsiveness
- Consistent animation timing and easing that matches the current design aesthetic

## Components

### 1. ScrollAnimationWrapper

A wrapper component that triggers animations when elements enter the viewport.

**Props:**
- `children`: The content to animate
- `preset`: Predefined animation presets (fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn, scaleInUp)
- `variants`: Custom Framer Motion animation variants
- `delay`: Delay before animation starts (in seconds)
- `transition`: Animation transition properties
- `viewport`: Viewport options (once, margin)
- `className`: CSS classes to apply
- `style`: Inline styles

**Usage Example:**
```tsx
<ScrollAnimationWrapper preset="fadeInUp" delay={0.2}>
  <div>Content to animate</div>
</ScrollAnimationWrapper>
```

### 2. StaggeredAnimationWrapper

A container for elements that should animate in sequence with staggered delays.

**Props:**
- `children`: The content to animate
- `staggerDelay`: Delay between each child animation (default: 0.1s)
- Other props from ScrollAnimationWrapper

**Usage Example:**
```tsx
<StaggeredAnimationWrapper staggerDelay={0.2}>
  <ScrollAnimationWrapper preset="staggerChild">
    <div>Item 1</div>
  </ScrollAnimationWrapper>
  <ScrollAnimationWrapper preset="staggerChild">
    <div>Item 2</div>
  </ScrollAnimationWrapper>
</StaggeredAnimationWrapper>
```

### 3. ParallaxElement

Creates a parallax effect where elements move at different speeds during scrolling.

**Props:**
- `children`: The content to apply parallax to
- `speed`: Speed of parallax effect (-1 to 1, negative moves opposite to scroll)
- `className`: CSS classes to apply
- `style`: Inline styles

**Usage Example:**
```tsx
<ParallaxElement speed={-0.5}>
  <div>Background element with parallax</div>
</ParallaxElement>
```

## Animation Presets

The system includes several predefined animation presets located in `src/lib/animationPresets.ts`:

1. `fadeIn`: Simple fade-in effect
2. `fadeInUp`: Fade in while moving up
3. `fadeInDown`: Fade in while moving down
4. `fadeInLeft`: Fade in while moving left
5. `fadeInRight`: Fade in while moving right
6. `scaleIn`: Fade in while scaling up
7. `scaleInUp`: Fade in while scaling up and moving up
8. `staggerContainer`: Container for staggered animations
9. `staggerChild`: Individual elements in a staggered animation

## Implementation Examples

### Basic Fade-In Animation
```tsx
<ScrollAnimationWrapper preset="fadeInUp">
  <h2>Animated Heading</h2>
</ScrollAnimationWrapper>
```

### Delayed Animation
```tsx
<ScrollAnimationWrapper preset="fadeInUp" delay={0.3}>
  <p>This content animates 0.3 seconds after entering viewport</p>
</ScrollAnimationWrapper>
```

### Staggered List Animation
```tsx
<StaggeredAnimationWrapper staggerDelay={0.1}>
  {items.map((item, index) => (
    <ScrollAnimationWrapper key={item.id} preset="staggerChild">
      <div>{item.content}</div>
    </ScrollAnimationWrapper>
  ))}
</StaggeredAnimationWrapper>
```

### Parallax Background
```tsx
<ParallaxElement speed={-0.3}>
  <div className="background-element">Parallax background</div>
</ParallaxElement>
```

## Performance Considerations

1. Animations use Framer Motion's optimized rendering
2. Elements outside the viewport are not animated until they enter
3. The `once` prop can be used to prevent re-animating when scrolling back up
4. Animation variants are pre-defined for consistency and performance

## Customization

To create custom animations:

1. Define new variants in `src/lib/animationPresets.ts`
2. Add new presets to the `animationVariants` object
3. Use the new preset with `preset="yourPresetName"`

Example:
```ts
// In animationPresets.ts
export const animationVariants = {
  // ... existing variants
  customSlideIn: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  }
};

// In component
<ScrollAnimationWrapper preset="customSlideIn">
  <div>Custom slide-in animation</div>
</ScrollAnimationWrapper>
```

## Best Practices

1. Use appropriate delays to create a natural flow
2. Combine different animation types for visual interest
3. Use parallax effects sparingly to avoid performance issues
4. Test animations on different devices and screen sizes
5. Ensure animations enhance rather than distract from content