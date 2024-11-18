import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../../styles/welcome';

export const OvalShape = () => (
  <View style={styles.ovalContainer}>
    <Svg height="80" width={Dimensions.get('window').width}>
      <Path
        d={`M 0 80 
            C ${Dimensions.get('window').width / 4} 0, 
              ${(Dimensions.get('window').width / 4) * 3} 0, 
              ${Dimensions.get('window').width} 80 
            L ${Dimensions.get('window').width} 80 
            L 0 80 Z`}
        fill="#ffffff"
      />
    </Svg>
  </View>
);