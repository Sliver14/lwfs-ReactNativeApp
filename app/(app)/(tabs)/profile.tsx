import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/utils/env';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useUser } from "../../../contexts/UserContext";

// Stats Card Component
const StatsCard: React.FC<{
  value: string;
  label: string;
  color: string;
}> = ({ value, label, color }) => {
  return (
    <View className="flex-1 items-center">
      <Text className={`text-2xl font-bold ${color}`} style={{ fontWeight: '700' }}>{value}</Text>
      <Text className="text-sm text-gray-500 mt-1" style={{ fontWeight: '400' }}>{label}</Text>
    </View>
  );
};

// Profile Header Component
const ProfileHeader: React.FC<{
  userDetails: any;
}> = ({ userDetails }) => {
  return (
    <View className="bg-white p-6 mb-6" style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E1E8ED'
    }}>
      <View className="flex-row gap-3 items-center space-x-4 mb-6">
        <LinearGradient
          colors={['#4A90E2', '#7B68EE']}
          className="items-center justify-center"
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            shadowColor: '#4A90E2',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6
          }}
        >
          <Ionicons name="person" size={40} color="white" />
        </LinearGradient>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900" style={{ fontWeight: '700' }}>
            {userDetails?.firstName
              ? userDetails.firstName.charAt(0).toUpperCase() + userDetails.firstName.slice(1)
              : ''}{' '}
            {userDetails?.lastName
              ? userDetails.lastName.charAt(0).toUpperCase() + userDetails.lastName.slice(1)
              : ''}
          </Text>
          <Text className="text-gray-500 mt-1" style={{ fontWeight: '400' }}>
            {userDetails?.email}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Toggle Switch Component
const ToggleSwitch: React.FC<{
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}> = ({ label, value, onValueChange }) => {
  return (
    <View className="flex-row items-center justify-between py-3">
      <Text className="text-gray-700 font-medium" style={{ fontWeight: '500' }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E1E8ED', true: '#4A90E2' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        ios_backgroundColor="#E1E8ED"
      />
    </View>
  );
};

// Quick Settings Component
const QuickSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: false,
    darkMode: false,
    autoPlayVideos: true,
    locationServices: false,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    // Only allow updates for non-disabled settings
    if (key !== 'notifications' && key !== 'darkMode') {
    setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-6" style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E1E8ED'
    }}>
      <Text className="font-semibold text-lg text-gray-900 mb-4" style={{ fontWeight: '600' }}>Quick Settings</Text>
      <View className="space-y-1">
        <View className="flex-row items-center justify-between py-3 opacity-50">
          <Text className="text-gray-500 font-medium" style={{ fontWeight: '500' }}>Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={() => {}} // Disabled
            trackColor={{ false: '#E1E8ED', true: '#E1E8ED' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E1E8ED"
            disabled={true}
          />
        </View>
        <View className="flex-row items-center justify-between py-3 opacity-50">
          <Text className="text-gray-500 font-medium" style={{ fontWeight: '500' }}>Dark Mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={() => {}} // Disabled
            trackColor={{ false: '#E1E8ED', true: '#E1E8ED' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E1E8ED"
            disabled={true}
          />
        </View>
      </View>
    </View>
  );
};

// Menu Option Component
const MenuOption: React.FC<{
  icon: string;
  label: string;
  onPress?: () => void;
  showBorder?: boolean;
}> = ({ icon, label, onPress, showBorder = true }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        className={`flex-row items-center space-x-3 p-3 rounded-xl ${
          showBorder ? 'border-b border-gray-50' : ''
        }`}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View className="w-8 h-8 items-center justify-center">
          <Ionicons name={icon as any} size={20} color="#657786" />
        </View>
        <Text className="text-gray-700 font-medium flex-1" style={{ fontWeight: '500' }}>{label}</Text>
        <Ionicons name="chevron-forward-outline" size={16} color="#E1E8ED" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Menu Options Component
const MenuOptions: React.FC<{
  router: any;
  setModalVisible: (visible: boolean) => void;
}> = ({ router, setModalVisible }) => {
  const menuItems = [
    { 
      icon: 'bag-outline', 
      label: 'Order History', 
      onPress: undefined, // Disabled
      disabled: true 
    },
    { 
      icon: 'lock-closed-outline', 
      label: 'Change Password', 
      onPress: () => setModalVisible(true),
      disabled: false 
    },
    { 
      icon: 'person-outline', 
      label: 'Personal Information', 
      onPress: () => router.push('/PersonalInfoScreen'),
      disabled: false 
    },
    { 
      icon: 'help-circle-outline', 
      label: 'Help & Support', 
      onPress: undefined, // Disabled
      disabled: true 
    },
    { 
      icon: 'information-circle-outline', 
      label: 'About', 
      onPress: undefined, // Disabled
      disabled: true 
    },
  ];

  return (
    <View className="bg-white rounded-2xl" style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E1E8ED'
    }}>
      {menuItems.map((item, index) => (
        <View key={index} style={{ opacity: item.disabled ? 0.5 : 1 }}>
          <TouchableOpacity
            className={`flex-row items-center space-x-3 p-3 rounded-xl ${
              index < menuItems.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          onPress={item.onPress}
            activeOpacity={item.disabled ? 1 : 0.7}
            disabled={item.disabled}
          >
            <View className="w-8 h-8 items-center justify-center">
              <Ionicons 
                name={item.icon as any} 
                size={20} 
                color={item.disabled ? "#A0A0A0" : "#657786"} 
              />
            </View>
            <Text 
              className={`font-medium flex-1 ${item.disabled ? 'text-gray-400' : 'text-gray-700'}`} 
              style={{ fontWeight: '500' }}
            >
              {item.label}
            </Text>
            <Ionicons 
              name="chevron-forward-outline" 
              size={16} 
              color={item.disabled ? "#A0A0A0" : "#E1E8ED"} 
        />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

// Change Password Modal Component
const ChangePasswordModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  email: string;
}> = ({ visible, onClose, email }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        email,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password changed successfully', [
          { text: 'OK', onPress: onClose }
        ]);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm" style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 12,
          borderRadius: 16
        }}>
          <Text className="text-xl font-bold text-gray-900 mb-4 text-center" style={{ fontWeight: '700' }}>
            Change Password
          </Text>
          
          <TextInput
            className="border border-gray-200 rounded-xl p-3 mb-4"
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            style={{
              backgroundColor: '#F5F7FA',
              borderRadius: 12,
              fontWeight: '400'
            }}
          />
          
          <TextInput
            className="border border-gray-200 rounded-xl p-3 mb-4"
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={{
              backgroundColor: '#F5F7FA',
              borderRadius: 12,
              fontWeight: '400'
            }}
          />
          
          <TextInput
            className="border border-gray-200 rounded-xl p-3 mb-6"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={{
              backgroundColor: '#F5F7FA',
              borderRadius: 12,
              fontWeight: '400'
            }}
          />
          
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl"
              onPress={onClose}
              style={{
                backgroundColor: '#F5F7FA',
                borderWidth: 1,
                borderColor: '#E1E8ED'
              }}
            >
              <Text className="text-gray-700 text-center font-semibold" style={{ fontWeight: '600' }}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl"
              onPress={handleChangePassword}
              disabled={loading}
              style={{
                backgroundColor: '#4A90E2',
                shadowColor: '#4A90E2',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6
              }}
            >
              <Text className="text-white text-center font-semibold" style={{ fontWeight: '600' }}>
                {loading ? 'Changing...' : 'Change'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Sign Out Button Component
const SignOutButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="bg-red-500 py-4 rounded-2xl mt-6"
      onPress={onPress}
      style={{
        shadowColor: '#F44336',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderRadius: 16
      }}
    >
      <Text className="text-white text-center font-semibold text-lg" style={{ fontWeight: '600' }}>
        Sign Out
      </Text>
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation }: any) {
  const router = useRouter();
  const { userDetails } = useUser();
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/welcome');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 pb-[87px]" style={{ backgroundColor: '#F5F7FA' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <ProfileHeader userDetails={userDetails} />
          <QuickSettings />
          <MenuOptions router={router} setModalVisible={setModalVisible} />
          <SignOutButton onPress={handleLogout} />
        </View>
        
        <ChangePasswordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          email={userDetails?.email || ''}
        />
      </ScrollView>
    </SafeAreaView>
  );
}