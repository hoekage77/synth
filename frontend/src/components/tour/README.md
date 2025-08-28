# Xera Tour System - ChatGPT 5 Style

A modern, accessible, and feature-rich tour system designed to provide users with an intuitive onboarding experience that matches the quality of ChatGPT 5.

## ✨ Features

### 🎯 **Smart Positioning & Focus Management**
- **Automatic positioning**: Tooltips intelligently position themselves to avoid screen edges
- **Focus trapping**: Maintains user focus within the tour context
- **Scroll management**: Automatically scrolls to highlighted elements
- **Keyboard navigation**: Full keyboard support (arrow keys, space, enter, escape)

### 🎨 **ChatGPT 5-Style Design**
- **Modern aesthetics**: Sleek, rounded tooltips with gradient accents
- **Smooth animations**: Fluid entrance/exit animations with cubic-bezier easing
- **Visual hierarchy**: Clear typography and spacing for optimal readability
- **Responsive design**: Adapts seamlessly to all screen sizes

### 🚀 **Enhanced User Experience**
- **Progress tracking**: Visual progress indicators and step counters
- **Auto-advance**: Intelligent auto-advancement with user interaction detection
- **Element highlighting**: Glowing spotlight effects on featured elements
- **Accessibility**: ARIA labels, focus management, and reduced motion support

### 🛠 **Developer Experience**
- **Easy integration**: Simple hook-based API
- **Customizable**: Extensive styling and behavior customization
- **TypeScript**: Full type safety and IntelliSense support
- **Performance**: Optimized animations and minimal re-renders

## 🚀 Quick Start

### 1. Import the Tour System

```tsx
import { TourProvider, useTour } from '@/components/tour';
import './tour-styles.css'; // Import the styles
```

### 2. Wrap Your App

```tsx
function App() {
  return (
    <TourProvider maxSteps={5}>
      <YourAppContent />
    </TourProvider>
  );
}
```

### 3. Use the Tour Hook

```tsx
function MyComponent() {
  const { 
    isTourActive, 
    currentStep, 
    startTour, 
    nextStep, 
    highlightElement 
  } = useTour();

  const handleStartTour = () => {
    startTour();
    highlightElement('[data-tour="feature-1"]');
  };

  return (
    <div>
      <button onClick={handleStartTour}>Start Tour</button>
      
      <div data-tour="feature-1">
        This element will be highlighted during the tour
      </div>
    </div>
  );
}
```

## 🎨 Customization

### Tour Steps Configuration

```tsx
const tourSteps = [
  {
    target: '[data-tour="chat-input"]',
    content: 'Start your conversation here with Xera',
    title: 'Chat Input',
    placement: 'bottom',
    disableBeacon: true,
  },
  // ... more steps
];
```

### Styling Customization

The tour system uses CSS custom properties for easy theming:

```css
:root {
  --tour-primary-color: #3b82f6;
  --tour-secondary-color: #8b5cf6;
  --tour-background: #0f172a;
  --tour-text-color: #ffffff;
}
```

## 🎯 Advanced Features

### Element Highlighting

```tsx
const { highlightElement, clearHighlight } = useTour();

// Highlight a specific element
highlightElement('.my-feature');

// Clear all highlights
clearHighlight();
```

### Keyboard Navigation

Users can navigate the tour using:
- **→** or **Space**: Next step
- **←**: Previous step
- **Enter**: Next step
- **Escape**: End tour

### Auto-Advancement

The tour automatically advances after 8 seconds if the user hasn't interacted, ensuring a smooth demo experience.

## 📱 Responsive Design

The tour system automatically adapts to different screen sizes:
- **Desktop**: Full-featured experience with floating controls
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Compact design with simplified navigation

## ♿ Accessibility

- **Screen reader support**: Proper ARIA labels and descriptions
- **Keyboard navigation**: Full keyboard accessibility
- **Focus management**: Intelligent focus trapping and restoration
- **Reduced motion**: Respects user's motion preferences

## 🔧 API Reference

### TourProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxSteps` | `number` | `10` | Maximum number of tour steps |
| `children` | `ReactNode` | - | Child components |

### useTour Hook

| Property | Type | Description |
|----------|------|-------------|
| `isTourActive` | `boolean` | Whether a tour is currently active |
| `currentStep` | `number` | Current step index (0-based) |
| `totalSteps` | `number` | Total number of tour steps |
| `startTour` | `() => void` | Start the tour |
| `endTour` | `() => void` | End the tour |
| `nextStep` | `() => void` | Go to next step |
| `previousStep` | `() => void` | Go to previous step |
| `goToStep` | `(step: number) => void` | Go to specific step |
| `highlightElement` | `(selector: string) => void` | Highlight element by selector |
| `clearHighlight` | `() => void` | Clear all highlights |

## 🎨 CSS Classes

The tour system provides several CSS classes for customization:

- `.__floater`: Main tour tooltip container
- `.__floater-highlight`: Highlighted elements during tour
- `.__floater-overlay`: Tour backdrop overlay
- `.__floater-focus-trap`: Accessibility focus trap

## 🚀 Performance Tips

1. **Lazy load**: Only import tour components when needed
2. **Debounce interactions**: Avoid rapid tour state changes
3. **Optimize selectors**: Use efficient CSS selectors for highlighting
4. **Minimize re-renders**: Use `useCallback` for tour functions

## 🔮 Future Enhancements

- **Tour analytics**: Track user engagement and completion rates
- **A/B testing**: Test different tour flows
- **Personalization**: Adaptive tours based on user behavior
- **Multi-language**: Internationalization support
- **Tour templates**: Pre-built tour configurations for common use cases

## 📄 License

This tour system is part of the Xera project and follows the same licensing terms.
