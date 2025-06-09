import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
    Animated,
    StatusBar,
    Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PersonalInfoScreen() {
    const { userDetails, setUserDetails } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        firstName: userDetails?.firstName || '',
        lastName: userDetails?.lastName || '',
        email: userDetails?.email || '',
        zone: userDetails?.zone || '',
    });

    const [profileImage, setProfileImage] = useState(userDetails?.profileImage || '');
    const [uploading, setUploading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(1));

    const fieldLabels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        zone: 'Zone'
    };

    const handleInputChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                'Permission Required',
                'We need access to your photos to update your profile picture.',
                [{ text: 'OK', style: 'default' }]
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setUploading(true);
            await uploadImageToServer(uri);
            setUploading(false);
        }
    };

    const uploadImageToServer = async (uri) => {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        const fileName = uri.split('/').pop();

        const formData = new FormData();
        formData.append('file', {
            uri,
            name: fileName,
            type: 'image/jpeg',
        });

        try {
            const res = await axios.post('https://your-api.com/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProfileImage(res.data.secure_url);
            Alert.alert('Success!', 'Profile picture updated successfully', [
                { text: 'OK', style: 'default' }
            ]);
        } catch (err) {
            console.error(err);
            Alert.alert('Upload Failed', 'Failed to upload image. Please try again.', [
                { text: 'OK', style: 'default' }
            ]);
        }
    };

    const updateProfile = async () => {
        // Animate button press
        Animated.sequence([
            Animated.timing(fadeAnim, { duration: 100, toValue: 0.8, useNativeDriver: true }),
            Animated.timing(fadeAnim, { duration: 100, toValue: 1, useNativeDriver: true })
        ]).start();

        try {
            const res = await axios.post('https://your-api.com/update-profile', {
                ...form,
                profileImage,
            });

            if (res.status === 200) {
                Alert.alert('Success!', 'Your profile has been updated successfully', [
                    { text: 'OK', style: 'default' }
                ]);
                setUserDetails({ ...userDetails, ...form, profileImage });
                setIsEditing(false);
            }
        } catch (err) {
            Alert.alert('Update Failed', 'Could not update profile. Please try again.', [
                { text: 'OK', style: 'default' }
            ]);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            updateProfile();
        } else {
            setIsEditing(true);
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
            <ScrollView
                className="flex-1 bg-gray-50"
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Header Section with Gradient */}
                <LinearGradient
                    colors={['#6366f1', '#8b5cf6', '#a855f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="pb-8 pt-12"
                >
                    <View className="items-center px-6">
                        {/* Profile Image Container */}
                        <View className="relative mb-4">
                            <View className="w-32 h-32 rounded-full bg-white/20 items-center justify-center shadow-lg">
                                {imageLoading ? (
                                    <ActivityIndicator size="large" color="white" />
                                ) : (
                                    <Image
                                        source={{
                                            uri: profileImage || 'https://res.cloudinary.com/dfi8bpolg/image/upload/v1736329280/samples/man-portrait.jpg'
                                        }}
                                        className="w-28 h-28 rounded-full"
                                        onLoadStart={() => setImageLoading(true)}
                                        onLoadEnd={() => setImageLoading(false)}
                                    />
                                )}
                            </View>

                            {/* Camera Button */}
                            <TouchableOpacity
                                className="absolute -bottom-2 -right-2 bg-white rounded-full p-3 shadow-lg"
                                onPress={pickImage}
                                disabled={uploading}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5
                                }}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="#6366f1" />
                                ) : (
                                    <Ionicons name="camera" size={20} color="#6366f1" />
                                )}
                            </TouchableOpacity>
                        </View>

                        <Text className="text-white text-2xl font-bold mb-1">
                            {form.firstName || 'User'} {form.lastName}
                        </Text>
                        <Text className="text-white/80 text-base">
                            {form.email || 'user@example.com'}
                        </Text>
                    </View>
                </LinearGradient>

                {/* Form Section */}
                <View className="flex-1 px-6 -mt-4">
                    <View className="bg-white rounded-2xl shadow-sm p-6" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 3
                    }}>
                        {/* Section Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-semibold text-gray-800">
                                Personal Information
                            </Text>
                            <View className={`px-3 py-1 rounded-full ${isEditing ? 'bg-orange-100' : 'bg-green-100'}`}>
                                <Text className={`text-sm font-medium ${isEditing ? 'text-orange-600' : 'text-green-600'}`}>
                                    {isEditing ? 'Editing' : 'View Mode'}
                                </Text>
                            </View>
                        </View>

                        {/* Form Fields */}
                        {Object.keys(form).map((key, index) => (
                            <View className="mb-6" key={key}>
                                <Text className="text-gray-600 text-sm font-medium mb-2 ml-1">
                                    {fieldLabels[key]}
                                </Text>
                                <View className={`relative ${isEditing ? 'bg-white' : 'bg-gray-50'} rounded-xl border ${
                                    isEditing ? 'border-indigo-200' : 'border-gray-200'
                                }`}>
                                    <TextInput
                                        value={form[key]}
                                        editable={isEditing}
                                        onChangeText={(text) => handleInputChange(key, text)}
                                        className="p-4 text-gray-800 text-base"
                                        placeholder={`Enter your ${fieldLabels[key].toLowerCase()}`}
                                        placeholderTextColor="#9ca3af"
                                        selectionColor="#6366f1"
                                        keyboardType={key === 'email' ? 'email-address' : 'default'}
                                        autoCapitalize={key === 'email' ? 'none' : 'words'}
                                    />
                                    {!isEditing && (
                                        <View className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <Ionicons name="lock-closed" size={16} color="#9ca3af" />
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}

                        {/* Action Buttons */}
                        <View className="flex-row space-x-3 mt-4">
                            <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                                <TouchableOpacity
                                    onPress={handleEditToggle}
                                    className={`py-4 px-6 rounded-xl flex-row items-center justify-center space-x-2 ${
                                        isEditing ? 'bg-green-500' : 'bg-indigo-500'
                                    }`}
                                    style={{
                                        shadowColor: isEditing ? '#10b981' : '#6366f1',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 4,
                                        elevation: 4
                                    }}
                                >
                                    <Ionicons
                                        name={isEditing ? "checkmark" : "pencil"}
                                        size={20}
                                        color="white"
                                    />
                                    <Text className="text-white font-semibold text-base ml-2">
                                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>

                            {isEditing && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsEditing(false);
                                        setForm({
                                            firstName: userDetails?.firstName || '',
                                            lastName: userDetails?.lastName || '',
                                            email: userDetails?.email || '',
                                            zone: userDetails?.zone || '',
                                        });
                                    }}
                                    className="py-4 px-6 rounded-xl bg-gray-500 flex-row items-center justify-center"
                                    style={{
                                        shadowColor: '#6b7280',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 4,
                                        elevation: 4
                                    }}
                                >
                                    <Ionicons name="close" size={20} color="white" />
                                    <Text className="text-white font-semibold text-base ml-2">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Bottom Spacing */}
                <View className="h-8" />
            </ScrollView>
        </>
    );
}