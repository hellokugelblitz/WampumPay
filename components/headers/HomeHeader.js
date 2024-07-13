// React and react native
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { View, Platform } from 'react-native';
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Expo
import { Image } from 'expo-image';
import { useRouter } from "expo-router";

// Local imports
import { useAuth } from '../../context/authContext';
import { blurhash } from '../../utils/common';
import { placeholderImage } from '../../utils/common';
import ProfilePicture from '../elements/ProfilePicture';

// Check if device is ios
const ios = Platform.OS=='ios';
export default function HomeHeader() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { top } = useSafeAreaInsets();

    // Functions used to handle menu interaction
    const openUserOptionsWindow = () => {
        router.push({pathname: '/user'});
    }

    const handleLogout = async () => {
        await logout();
    }

    // Runs if there are problems getting user profile image.
    const onImageError = (e) => {
        e.target.source = placeholderImage
    }

    return (
        <View style={{paddingTop: ios?top:top+10}} className="flex-row justify-between px-5 bg-purple-900 pb-6 rounded-b-3xl shadow">
            <View>
                <Image
                    style={{height: hp(4), aspectRatio:6/2}}
                    source={require('../../assets/images/WP_white-03.png')}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={500}
                    onError={onImageError}
                />
            </View>

            <ProfilePicture 
                user={user} 
                onImageError={onImageError} 
                openUserOptionsWindow={openUserOptionsWindow} 
                handleLogout={handleLogout} 
            />

        </View>
    )
}
