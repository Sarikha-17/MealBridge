import { Platform } from 'react-native';

// Standard export for the component
export const LocationPicker = (props: any) => {
  if (Platform.OS === 'web') {
    // Import the web version dynamically
    const WebPicker = require('./LocationPicker.web').LocationPicker;
    return <WebPicker {...props} />;
  } else {
    // Import the native version dynamically
    const NativePicker = require('./LocationPicker.native').LocationPicker;
    return <NativePicker {...props} />;
  }
};