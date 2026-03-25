import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';
import { RoleSelection } from './components/RoleSelection';
import { FarmerAuth } from './components/FarmerAuth';
import { FarmerProfileSetup } from './components/FarmerProfileSetup';
import { FarmMapping } from './components/FarmMapping';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AggregatorAuth } from './components/AggregatorAuth';
import { AggregatorFacilitySetup } from './components/AggregatorFacilitySetup';
import { AggregatorProfileSetup } from './components/AggregatorProfileSetup';
import { AggregatorDashboard } from './components/AggregatorDashboard';
import { BuyerAuth } from './components/BuyerAuth';
import { BuyerTypeSelection } from './components/BuyerTypeSelection';
import { SupplierTraderRegistration } from './components/SupplierTraderRegistration';
import { ExporterRegistration } from './components/ExporterRegistration';
import { BuyerDashboard } from './components/BuyerDashboard';

type UserRole = 'farmer' | 'aggregator' | 'buyer' | null;
type FarmerStep = 'auth' | 'profile' | 'mapping' | 'dashboard';
type AggregatorStep = 'auth' | 'profile' | 'facility' | 'dashboard';
type BuyerStep = 'auth' | 'type' | 'registration' | 'dashboard';
type BuyerType = 'supplier_trader' | 'exporter' | null;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [farmerStep, setFarmerStep] = useState<FarmerStep>('auth');
  const [aggregatorStep, setAggregatorStep] = useState<AggregatorStep>('auth');
  const [buyerStep, setBuyerStep] = useState<BuyerStep>('auth');
  const [buyerType, setBuyerType] = useState<BuyerType>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aggregatorProfile, setAggregatorProfile] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowLanding(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Splash Screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Landing Page
  if (showLanding && !userRole) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Role Selection
  if (!userRole) {
    return (
      <RoleSelection
        onSelectRole={setUserRole}
        onBack={() => setShowLanding(true)}
      />
    );
  }

  // Farmer flow with authentication and multi-step onboarding
  if (userRole === 'farmer') {
    if (farmerStep === 'auth') {
      return (
        <FarmerAuth
          onAuthenticated={(phone, isNewUser) => {
            setPhoneNumber(phone);
            // If returning user, skip onboarding and go straight to dashboard
            setFarmerStep(isNewUser ? 'profile' : 'dashboard');
          }}
          onBack={() => setUserRole(null)}
        />
      );
    }

    if (farmerStep === 'profile') {
      return (
        <FarmerProfileSetup
          phoneNumber={phoneNumber}
          onComplete={() => setFarmerStep('mapping')}
          onBack={() => setFarmerStep('auth')}
        />
      );
    }

    if (farmerStep === 'mapping') {
      return (
        <FarmMapping
          onComplete={() => setFarmerStep('dashboard')}
          onBack={() => setFarmerStep('profile')}
        />
      );
    }

    return <FarmerDashboard onBack={() => setUserRole(null)} />;
  }

  // Aggregator flow with authentication and multi-step onboarding
  if (userRole === 'aggregator') {
    if (aggregatorStep === 'auth') {
      return (
        <AggregatorAuth
          onAuthenticated={(phone, isNewUser) => {
            setPhoneNumber(phone);
            // If returning user, skip onboarding and go straight to dashboard
            setAggregatorStep(isNewUser ? 'profile' : 'dashboard');
          }}
          onBack={() => setUserRole(null)}
        />
      );
    }

    if (aggregatorStep === 'profile') {
      return (
        <AggregatorProfileSetup
          phoneNumber={phoneNumber}
          onComplete={(profileData) => {
            setAggregatorProfile(profileData);
            setAggregatorStep('facility');
          }}
          onBack={() => setAggregatorStep('auth')}
        />
      );
    }

    if (aggregatorStep === 'facility') {
      return (
        <AggregatorFacilitySetup
          phoneNumber={phoneNumber}
          onComplete={(facilityData) => {
            // Merge profile and facility data
            setAggregatorProfile({ ...aggregatorProfile, ...facilityData });
            setAggregatorStep('dashboard');
          }}
          onBack={() => setAggregatorStep('profile')}
        />
      );
    }

    return <AggregatorDashboard onBack={() => setUserRole(null)} profile={aggregatorProfile} />;
  }

  // Buyer flow with authentication, type selection and registration
  if (userRole === 'buyer') {
    if (buyerStep === 'auth') {
      return (
        <BuyerAuth
          onAuthenticated={(phone, isNewUser) => {
            setPhoneNumber(phone);
            // If returning user, skip onboarding and go straight to dashboard
            // For demo, we'll set a default buyer type for returning users
            if (!isNewUser) {
              setBuyerType('supplier_trader'); // Default for demo
              setBuyerStep('dashboard');
            } else {
              setBuyerStep('type');
            }
          }}
          onBack={() => setUserRole(null)}
        />
      );
    }

    if (buyerStep === 'type') {
      return (
        <BuyerTypeSelection
          onSelectType={(type) => {
            setBuyerType(type);
            setBuyerStep('registration');
          }}
          onBack={() => setBuyerStep('auth')}
        />
      );
    }

    if (buyerStep === 'registration') {
      if (buyerType === 'supplier_trader') {
        return (
          <SupplierTraderRegistration
            phoneNumber={phoneNumber}
            onComplete={() => setBuyerStep('dashboard')}
            onBack={() => setBuyerStep('type')}
          />
        );
      }

      if (buyerType === 'exporter') {
        return (
          <ExporterRegistration
            phoneNumber={phoneNumber}
            onComplete={() => setBuyerStep('dashboard')}
            onBack={() => setBuyerStep('type')}
          />
        );
      }
    }

    if (buyerStep === 'dashboard' && buyerType) {
      return <BuyerDashboard onBack={() => setUserRole(null)} buyerType={buyerType} />;
    }
  }

  return null;
}