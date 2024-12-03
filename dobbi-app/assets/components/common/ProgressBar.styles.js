import { StyleSheet } from 'react-native';

/*  Note:
    If you need to modify the styles, create a new object with the custom styles and pass it as a prop to the TabView component. 
    
    Use the same keys as the defaultTabBarStyles object and only modify the styles you need.

    Don't modify the existing styles! It will affect all other components that use the TabBar.
*/

export const defaultTabBarStyles = StyleSheet.create({
    progressBarContainer: {
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
});