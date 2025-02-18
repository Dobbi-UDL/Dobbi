import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, Dimensions, Animated, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { AnimatedProgressIndicator } from '../assets/components/Onboarding-miha/AnimatedProgressIndicator';
import { onboardingService } from '../services/onboardingService';
import { useAuth } from '../contexts/AuthContext';
import debounce from 'lodash/debounce';

// Screen Components
import WelcomeScreen from '../assets/components/Onboarding-miha/WelcomeScreen';
import FinancialContextScreen from '../assets/components/Onboarding-miha/FinancialContextScreen';
import NotificationScreen from '../assets/components/Onboarding-miha/NotificationScreen';
import CompletionScreen from '../assets/components/Onboarding-miha/CompletionScreen';
import PersonalInfoScreen1 from '../assets/components/Onboarding-miha/PersonalInfoScreen1';
import PersonalInfoScreen2 from '../assets/components/Onboarding-miha/PersonalInfoScreen2';
import MotivationScreen from '../assets/components/Onboarding-miha/MotivationScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function OnboardingScreen() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  // Add onboarding data state
  const [onboardingData, setOnboardingData] = useState({
    // PersonalInfoScreen1
    role: null,

    // PersonalInfoScreen2
    age: '',
    gender: '',
    education: '',
    country: null,
    region: null,

    // MotivationScreen
    motivations: [],
    goals: [],
    otherMotivation: '',
    otherGoal: '',

    // FinancialContextScreen
    experience: null,
    savings: null,
    situation: null,
    debtTypes: [],
    otherDebt: '',

    // NotificationScreen
    notifications: {}
  });

  // Debounce the data update handler
  const handleDataUpdate = useMemo(
    () => debounce((screen, data) => {
      setOnboardingData(prev => ({
        ...prev,
        ...data
      }));
    }, 300),
    []
  );

  const totalSteps = 7; // Update total steps
  const router = useRouter();
  
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const panRef = useRef(null);

  // Optimize completion handler
  const handleCompletion = async () => {
    try {
      if (!user) return;

      // Start the navigation immediately
      router.replace('/home');

      // Save data in the background
      onboardingService.saveOnboardingData(user.id, onboardingData)
        .catch(error => console.error('Error saving onboarding data:', error));
        
    } catch (error) {
      console.error('Error during completion:', error);
    }
  };

  const getScreen = (step) => {
    const commonProps = {
      currentStep: step,
      totalSteps,
      onNext: handleNext,
      onBack: handleBack,
      data: onboardingData,
      onDataUpdate: handleDataUpdate
    };

    switch (step) {
      case 1:
        return <WelcomeScreen {...commonProps} />;
      case 2:
        return <PersonalInfoScreen1 {...commonProps} />;
      case 3:
        return <PersonalInfoScreen2 {...commonProps} />;
      case 4:
        return <MotivationScreen {...commonProps} />;
      case 5:
        return <FinancialContextScreen {...commonProps} />;
      case 6:
        return <NotificationScreen {...commonProps} />;
      case 7:
        return <CompletionScreen {...commonProps} onComplete={handleCompletion} />;
      default:
        return null;
    }
  };

  // Optimize animations
  const animateTransition = (direction) => {
    setIsAnimating(true);
    translateX.setValue(direction === 'next' ? SCREEN_WIDTH : -SCREEN_WIDTH);
    
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 6, // Reduced friction for faster animation
        tension: 50, // Increased tension for snappier movement
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200, // Reduced duration
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsAnimating(false);
      setAnimationTrigger(prev => prev + 1);
    });
  };

  // Pre-emptively save data
  const handleNext = () => {
    if (isAnimating || currentStep >= totalSteps) return;
    setIsAnimating(true);
    setCurrentStep(prev => prev + 1);
    animateTransition('next');
  };

  const handleBack = () => {
    if (isAnimating || currentStep <= 1) return;
    
    setIsAnimating(true);
    setCurrentStep(prev => prev - 1);
    animateTransition('back');
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === 5) {
      const { translationX: gestureX } = event.nativeEvent;
      
      if (Math.abs(gestureX) > SWIPE_THRESHOLD) {
        if (gestureX > 0 && currentStep > 1) {
          setIsAnimating(true);
          setCurrentStep(prev => prev - 1);
          animateTransition('back');
        } else if (gestureX < 0 && currentStep < totalSteps) {
          setIsAnimating(true);
          setCurrentStep(prev => prev + 1);
          animateTransition('next');
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }).start();
        }
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();
      }
    }
  };

  const renderScreens = () => {
    return (
      <Animated.View style={[
        styles.screensContainer,
        {
          transform: [{ translateX }],
          opacity: fadeAnim
        }
      ]}>
        {getScreen(currentStep)}
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />
      <AnimatedProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        animationTrigger={animationTrigger}
      />
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View style={[styles.wrapper, { marginTop: 60 }]}>
          {renderScreens()}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  screensContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  screenPosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
  }
});
