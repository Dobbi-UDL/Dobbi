import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const settingsWidth = width * 0.8;

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        zIndex: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#FFE5E5',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    brandName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#EE6567',
    },
    menuButton: {
        backgroundColor: '#FFE5E5',
        padding: 8,
        borderRadius: 8,
    },
    touchable: {
        padding: 8,
        margin: -8,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: height,
        zIndex: 200,
    },
    settingsMenu: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: settingsWidth,
        height: height,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: -2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 300,
    },
    settingsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    initialsContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ff6b6b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    editProfileLink: {
        color: '#ff6b6b',
        fontSize: 14,
    },
});