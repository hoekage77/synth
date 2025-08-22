# ChatGPT-5 Design System

## Overview

This document outlines the design system inspired by ChatGPT-5's sleek, minimal aesthetic. The design philosophy emphasizes clean typography, subtle visual elements, and elegant spacing that creates a premium, professional appearance.

## Design Philosophy

### Core Principles
- **Minimalism First**: Remove unnecessary visual clutter
- **Subtle Elegance**: Use muted colors and gentle transitions
- **Consistent Spacing**: Maintain harmonious proportions throughout
- **Modern Glass Effect**: Implement backdrop blur and transparency
- **Light Typography**: Use font-light for refined, elegant text

### Visual Hierarchy
1. **Primary Actions**: Clear, accessible buttons with subtle hover effects
2. **Secondary Elements**: Muted colors that don't compete for attention
3. **Background Elements**: Transparent overlays with backdrop blur
4. **Interactive States**: Smooth transitions with minimal visual feedback

## Color Palette

### Primary Colors
```css
/* Background Colors */
--background: hsl(var(--background) / 0.95) /* 95% opacity for glass effect */
--background-muted: hsl(var(--background) / 0.8)

/* Border Colors */
--border: hsl(var(--border) / 0.2) /* 20% opacity for subtle separation */
--border-hover: hsl(var(--border) / 0.4) /* 40% opacity on hover */

/* Text Colors */
--foreground: hsl(var(--foreground)) /* Primary text */
--muted-foreground: hsl(var(--muted-foreground) / 0.7) /* Secondary text */
--muted-foreground-hover: hsl(var(--muted-foreground)) /* Text on hover */
```

### Semantic Colors
```css
/* Success/Info */
--success: hsl(var(--success) / 0.7)
--success-hover: hsl(var(--success))

/* Warning/Danger */
--warning: hsl(var(--warning) / 0.7)
--danger: hsl(var(--danger) / 0.7)
--danger-hover: hsl(var(--danger))
```

## Typography

### Font Weights
- **Primary**: `font-light` - Elegant, refined appearance
- **Secondary**: `font-medium` - For emphasis when needed
- **Avoid**: `font-bold`, `font-semibold` - Too heavy for this aesthetic

### Text Sizes
```css
/* Headings */
--text-xs: 0.75rem (12px) - Section labels, captions
--text-sm: 0.875rem (14px) - Button text, small content
--text-base: 1rem (16px) - Body text, descriptions
--text-lg: 1.125rem (18px) - Subheadings
--text-xl: 1.25rem (20px) - Section titles
--text-2xl: 1.5rem (24px) - Page headings
--text-3xl: 1.875rem (30px) - Hero text
--text-4xl: 2.25rem (36px) - Large headings
--text-5xl: 3rem (48px) - Main titles
```

### Text Styling
```css
/* Section Labels */
.section-label {
  @apply text-xs font-light tracking-wide text-muted-foreground/70;
}

/* Button Text */
.button-text {
  @apply text-sm font-light tracking-wide;
}

/* Content Text */
.content-text {
  @apply text-base font-light leading-relaxed;
}
```

## Spacing System

### Padding & Margins
```css
/* Component Padding */
--padding-xs: 0.5rem (8px) - Tight spacing
--padding-sm: 0.75rem (12px) - Small spacing
--padding-md: 1rem (16px) - Standard spacing
--padding-lg: 1.5rem (24px) - Large spacing
--padding-xl: 2rem (32px) - Extra large spacing

/* Section Spacing */
--section-gap: 0.125rem (2px) - Between related sections
--section-margin: 0.5rem (8px) - Between major sections
```

### Layout Spacing
```css
/* Sidebar Sections */
.sidebar-section {
  @apply px-4 py-2; /* Standard section padding */
}

/* Button Groups */
.button-group {
  @apply space-y-2; /* Consistent vertical spacing */
}

/* Content Areas */
.content-area {
  @apply p-4 md:p-8; /* Responsive padding */
}
```

## Component Styling

### Buttons

#### Primary Button
```css
.btn-primary {
  @apply transition-all duration-200 
         text-sm tracking-wide font-light
         text-muted-foreground hover:text-foreground 
         hover:bg-muted/20 
         rounded-lg mx-2;
}
```

#### Ghost Button
```css
.btn-ghost {
  @apply variant="ghost"
         transition-all duration-200
         text-muted-foreground/70 hover:text-foreground 
         hover:bg-muted/20 
         font-light;
}
```

#### Icon Button
```css
.btn-icon {
  @apply w-8 h-8 
         transition-all duration-200
         text-muted-foreground/70 hover:text-foreground 
         hover:bg-muted/20 
         border border-border/30 
         rounded-lg;
}
```

### Cards & Containers

#### Glass Card
```css
.glass-card {
  @apply bg-background/95 backdrop-blur-xl
         border border-border/20
         rounded-lg shadow-lg;
}
```

#### Content Container
```css
.content-container {
  @apply bg-background/95 backdrop-blur-xl
         border-r border-border/20
         scrollbar-hide;
}
```

### Form Elements

#### Input Fields
```css
.input-field {
  @apply bg-transparent
         border border-border/20
         rounded-24px
         backdrop-filter blur-20px
         shadow-0-4px-32px-rgba-0-0-0-0.08
         hover:border-border/40
         hover:shadow-0-8px-48px-rgba-0-0-0-0.12
         transition-all duration-200;
}
```

#### Textarea
```css
.textarea {
  @apply text-base leading-relaxed
         py-4 px-5
         placeholder:text-muted-foreground/60
         placeholder:font-normal;
}
```

## Sidebar Design

### Structure
```tsx
<Sidebar className="bg-background/95 backdrop-blur-xl border-r border-border/20">
  {/* Header */}
  <SidebarHeader className="border-b border-border/20 bg-background/95 backdrop-blur-xl">
    {/* Logo and branding */}
  </SidebarHeader>
  
  {/* Content */}
  <SidebarContent className="bg-background/95 backdrop-blur-xl">
    {/* Sections with consistent styling */}
  </SidebarContent>
</Sidebar>
```

### Section Styling
```tsx
<SidebarGroup>
  <SidebarGroupLabel className="text-muted-foreground/70 font-light text-xs tracking-wide px-4 py-2">
    Section Title
  </SidebarGroupLabel>
  
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton className="transition-all duration-200 text-sm tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg mx-2 font-light">
        <Icon className="h-4 w-4 mr-2 text-muted-foreground/70" />
        <span>Button Text</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarGroup>
```

## Dropdown Menus

### Menu Container
```css
.dropdown-menu {
  @apply w-56 rounded-lg 
         transition-all duration-200 
         border border-border/20 
         bg-background/95 backdrop-blur-xl 
         shadow-lg;
}
```

### Menu Items
```css
.dropdown-item {
  @apply transition-all duration-200 
         font-light text-xs tracking-wide 
         hover:bg-muted/20;
}

.dropdown-item-danger {
  @apply hover:bg-red-500/10 
         text-red-500/70 hover:text-red-500;
}
```

## Hover Effects

### Standard Hover
```css
.hover-standard {
  @apply hover:text-foreground 
         hover:bg-muted/20 
         transition-all duration-200;
}
```

### Scale Hover
```css
.hover-scale {
  @apply hover:scale-105 
         transition-transform duration-200;
}
```

### Border Hover
```css
.hover-border {
  @apply hover:border-border/40 
         transition-all duration-200;
}
```

## Transitions & Animations

### Duration Classes
```css
--duration-fast: 150ms
--duration-standard: 200ms
--duration-slow: 300ms
--duration-very-slow: 500ms
```

### Animation Classes
```css
.animate-in {
  @apply animate-in fade-in duration-1000;
}

.animate-delay-1 {
  @apply delay-200;
}

.animate-delay-2 {
  @apply delay-300;
}

.animate-delay-3 {
  @apply delay-500;
}
```

## Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
--mobile: 0px - 639px
--tablet: 640px - 1023px
--desktop: 1024px - 1279px
--large: 1280px+
```

### Responsive Utilities
```css
.responsive-padding {
  @apply p-3 sm:p-4 md:p-8;
}

.responsive-text {
  @apply text-2xl sm:text-3xl md:text-4xl lg:text-5xl;
}

.responsive-grid {
  @apply grid-cols-1 lg:grid-cols-3;
}
```

## Icon Styling

### Icon Colors
```css
.icon-primary {
  @apply text-muted-foreground/70;
}

.icon-hover {
  @apply hover:text-foreground;
}

.icon-active {
  @apply text-foreground;
}
```

### Icon Sizes
```css
.icon-xs { @apply h-3 w-3; }
.icon-sm { @apply h-4 w-4; }
.icon-md { @apply h-5 w-5; }
.icon-lg { @apply h-6 w-6; }
.icon-xl { @apply h-8 w-8; }
```

## Implementation Examples

### Sidebar Button
```tsx
<SidebarMenuButton 
  onClick={handleClick}
  className="transition-all duration-200 text-sm tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg mx-2 font-light"
>
  <Plus className="h-4 w-4 mr-2 text-muted-foreground/70" />
  <span>New Chat</span>
</SidebarMenuButton>
```

### Dropdown Menu Item
```tsx
<DropdownMenuItem
  onClick={handleAction}
  className="transition-all duration-200 font-light text-xs tracking-wide hover:bg-muted/20"
>
  <Share2 className="text-muted-foreground/70 mr-2 h-4 w-4" />
  <span>Share Chat</span>
</DropdownMenuItem>
```

### Glass Effect Container
```tsx
<div className="bg-background/95 backdrop-blur-xl border border-border/20 rounded-lg shadow-lg">
  {/* Content */}
</div>
```

## Best Practices

### Do's
- ✅ Use `font-light` for all text elements
- ✅ Implement consistent `transition-all duration-200`
- ✅ Apply `backdrop-blur-xl` for glass effects
- ✅ Use `text-muted-foreground/70` for secondary text
- ✅ Maintain consistent spacing with `px-4 py-2`
- ✅ Apply `rounded-lg` for modern appearance

### Don'ts
- ❌ Avoid heavy font weights (`font-bold`, `font-semibold`)
- ❌ Don't use bright, saturated colors
- ❌ Avoid heavy shadows or borders
- ❌ Don't skip transition animations
- ❌ Avoid inconsistent spacing patterns

## Accessibility

### Color Contrast
- Ensure sufficient contrast between text and background
- Use `text-muted-foreground/70` sparingly for non-essential text
- Test hover states for adequate contrast

### Focus States
- Maintain visible focus indicators
- Use consistent focus styling across components
- Ensure keyboard navigation works properly

### Screen Readers
- Provide proper ARIA labels
- Use semantic HTML elements
- Test with screen reader software

## Future Considerations

### Dark Mode
- The current system works well with both light and dark themes
- Consider adding theme-specific color variations if needed
- Maintain consistent contrast ratios across themes

### Animation Performance
- Use `transform` and `opacity` for smooth animations
- Avoid animating layout properties when possible
- Consider reducing motion for users with preferences

### Component Library
- Consider creating reusable component variants
- Document common use cases and patterns
- Maintain consistency across new components

---

*This design system should be used as a reference for all new components and updates to maintain the ChatGPT-5 aesthetic throughout the application.*
