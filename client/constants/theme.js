/**
 * App Theme Configuration - Warm Terracotta & Cream Theme
 * Consistent color scheme across the entire application
 */

import { Platform } from 'react-native';

// Warm terracotta theme colors
export const AppTheme = {
  colors: {
    // Primary colors
    primary: '#e17055',        // Terracotta/Coral
    primaryDark: '#d35c47',    // Darker terracotta
    primaryLight: '#e88e75',   // Light terracotta
    
    // Secondary colors
    secondary: '#d35c47',      // Dark terracotta
    secondaryLight: '#f0a897', // Very light terracotta
    
    // Background colors
    background: '#ede1d1',     // Warm beige/cream
    backgroundLight: '#faf5eb', // Light cream
    backgroundCard: '#f7f2ea',  // Card cream
    
    // Input colors
    inputBackground: '#f7f2ea', // Input field background
    
    // Text colors
    textPrimary: '#784e2d',    // Brown
    textSecondary: '#a58e7c',  // Light brown
    textDark: '#50372a',       // Dark brown
    textLight: '#b89f8d',      // Very light brown
    textWhite: '#ffffff',      // White
    placeholderText: '#767676', // Gray placeholder
    
    // Status colors
    success: '#27ae60',        // Green
    danger: '#e74c3c',         // Red
    warning: '#f39c12',        // Orange
    info: '#3498db',           // Blue
    
    // Border & divider
    border: '#e2d6c1',         // Light brown border
    borderLight: '#ede5d9',    // Very light border
    divider: '#e2d6c1',        // Divider
    
    // Badge colors
    badgeAdmin: '#e17055',     // Terracotta
    badgeStaff: '#27ae60',     // Green
    badgeAlert: '#e74c3c',     // Red
    
    // Utility colors
    white: '#ffffff',
    black: '#000000',
    shadow: '#000000',
  },
  
  gradients: {
    primary: ['#e17055', '#d35c47'],
    background: ['#ede1d1', '#faf5eb'],
    card: ['#faf5eb', '#f7f2ea'],
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Legacy support for existing code
export const Colors = {
  light: {
    text: AppTheme.colors.textPrimary,
    background: AppTheme.colors.background,
    tint: AppTheme.colors.primary,
    icon: AppTheme.colors.textSecondary,
    tabIconDefault: AppTheme.colors.textLight,
    tabIconSelected: AppTheme.colors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: AppTheme.colors.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: AppTheme.colors.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

