// OvalBackground.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function OvalBackground() {
  return (
    <Svg height="100%" width="100%" viewBox="0 0 1440 320">
      <Path
        fill="#FFE4E4" // Color del óvalo
        d="M0,160L60,144C120,128,240,96,360,101.3C480,107,600,149,720,181.3C840,213,960,235,1080,224C1200,213,1320,171,1380,149.3L1440,128V320H0Z"
      />
    </Svg>
  );
}
