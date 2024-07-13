// React Stuff
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Expo 
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";

// Local Imports
import ProfilePicture from '../elements/ProfilePicture';
import { placeholderImage } from '../../utils/common';
import { useAuth } from '../../context/authContext';

const ios = Platform.OS == 'ios';
export default function PaymentHeader({ title, navigation, showProfileMenu }) {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { top } = useSafeAreaInsets();

    // There is lots of duplicated code here, might delete later!

    // Functions used to handle menu interaction
    const openUserOptionsWindow = () => {
        router.push({pathname: '/user'});
    }

    const handleLogout = async () => {
        await logout();
    };

    // Runs if there are problems getting user profile image.
    const onImageError = (e) => {
        e.currentTarget.src = placeholderImage; // Adjusted for Expo Image
    };

    return (
        <View style={{ paddingTop: ios ? top : top + 10 }} className="flex-row justify-between px-5 bg-purple-900 pb-6 rounded-b-3xl shadow">
            <TouchableOpacity onPress={navigation.goBack} className="self-center">
                <AntDesign name="back" size={35} color="white" />
            </TouchableOpacity>
            <Text className="text-white self-center text-xl font-bold">
                {title}
            </Text>
            {
                // Leave it if prop is undefined!
                (showProfileMenu == true || showProfileMenu === undefined) ? (
                    <ProfilePicture 
                        user={user} 
                        onImageError={onImageError} 
                        openUserOptionsWindow={openUserOptionsWindow} 
                        handleLogout={handleLogout} 
                    />
                ) : (
                    // Some dummy item for centering...
                    <View className='self-center'>
                        <AntDesign name="back" size={35} color="#581c87" />
                    </View>
                )
            }
        </View>
    );
}