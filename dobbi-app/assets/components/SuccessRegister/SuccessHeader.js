import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../../styles/success';

export const SuccessHeader = () => (
  <View style={styles.headerContainer}>
    <Image
      source={require('../../../assets/images/dobbi-playing-guitar.png')}
      style={styles.logoImage}
      resizeMode="contain"
    />
    <View style={styles.ovalContainer}>
      <Svg height="60" width={Dimensions.get('window').width}>
        <Path
          d={`M 0 60 
              C ${Dimensions.get('window').width / 4} 0, 
                ${(Dimensions.get('window').width / 4) * 3} 0, 
                ${Dimensions.get('window').width} 60 
              L ${Dimensions.get('window').width} 60 
              L 0 60 Z`}
          fill="#fff0f0"
        />
      </Svg>
    </View>
  </View>
);