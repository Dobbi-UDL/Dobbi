import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Alert, Platform } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';
import { generatePDF } from './generators/generatePDF';
import { generateCSV } from './generators/generateCSV';

export const ExportButton = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState(''); // 'downloading', 'completed', null
    const [filename, setFilename] = useState(null);
    const [directoryUri, setDirectoryUri] = useState(null); // Store the directory URI for later use
    const [savedFileUri, setSavedFileUri] = useState(null); // Add this new state

    const generateFile = async (fileType) => {
        try {
            switch (fileType) {
                case 'csv':
                    return await generateCSV();
                case 'pdf':
                    return await generatePDF();
                default:
                    return null;
            }
        } catch (error) {
            Alert.alert(
                `${fileType.toUpperCase()} Generation Failed`,
                `Unable to generate ${fileType.toUpperCase()} file. Please try again.`
            );
            return null;
        }
    };

    const saveFile = async (fileUri, fileType) => {
        try {
            const newFilename = `sample-${Date.now()}.${fileType}`;
            setFilename(newFilename);

            if (Platform.OS === 'android') {
                // Request permission to access the user's Downloads directory
                let dirUri = directoryUri;
                if (!dirUri) {
                    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                    console.log('Permissions:', permissions);

                    if (!permissions.granted) {
                        Alert.alert('Permissions Required', 'Please allow access to your storage to save files.');
                        return false;
                    }
                    if (!permissions.directoryUri) {
                        Alert.alert('Error', 'No directory selected. Please select a directory to save the file.');
                        return false;
                    }
                    dirUri = permissions.directoryUri;
                    setDirectoryUri(dirUri);
                }

                console.log('Directory URI:', dirUri);

                // Read the file content
                const fileString = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Determine MIME type
                const mimeType = fileType === 'pdf' ? 'application/pdf' : 'text/csv';

                // Create and write the file in the selected directory
                const uri = await FileSystem.StorageAccessFramework.createFileAsync(
                    dirUri,
                    newFilename,
                    mimeType
                );
                console.log('File URI:', uri);

                await FileSystem.writeAsStringAsync(uri, fileString, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Store the complete URI for later use
                setSavedFileUri(uri);
                return true;
            } else {
                // iOS - save to document directory
                const destPath = `${FileSystem.documentDirectory}${newFilename}`;
                await FileSystem.copyAsync({
                    from: fileUri,
                    to: destPath,
                });
                return true;
            }
        } catch (error) {
            console.error('Error saving file:', error);
            Alert.alert('Error', 'Failed to save file: ' + error.message);
            return false;
        }
    };

    const openFile = async () => {
        try {
            if (Platform.OS === 'android' && savedFileUri) {
                // On Android, directly open the saved content URI
                await Linking.openURL(savedFileUri);
            } else if (Platform.OS === 'ios' && filename) {
                // iOS implementation remains the same
                const fileUri = `${FileSystem.documentDirectory}${filename}`;
                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                if (fileInfo.exists) {
                    await Linking.openURL(fileUri);
                } else {
                    Alert.alert('Error', 'File not found');
                }
            }
        } catch (error) {
            console.error('Error opening file:', error);
            Alert.alert('Error', 'Unable to open the file. Make sure you have an app that can open this type of file.');
        }
    };

    const findAssetByFilename = async (filename) => {
        try {
            const assets = await MediaLibrary.getAssetsAsync({
                createdAfter: 0,
                mediaType: ['document', 'unknown'],
                first: 1000, // Adjust if necessary
            });
            return assets.assets.find(asset => asset.filename === filename);
        } catch (error) {
            console.error('Error fetching assets:', error);
            return null;
        }
    };

    const requestPermissions = async () => {
        try {
            let permissionResult;
            if (Platform.OS === 'ios') {
                permissionResult = await MediaLibrary.requestPermissionsAsync();
            } else {
                permissionResult = await MediaLibrary.getPermissionsAsync();
                if (permissionResult.status !== 'granted' && permissionResult.canAskAgain) {
                    permissionResult = await MediaLibrary.requestPermissionsAsync();
                }
            }

            if (permissionResult.status === 'granted') {
                return true;
            } else if (permissionResult.status === 'denied' && !permissionResult.canAskAgain) {
                // Permissions are denied and cannot be requested again
                Alert.alert(
                    'Permission Required',
                    'Please enable storage permissions in your device settings to save files.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Open Settings',
                            onPress: () => {
                                if (Platform.OS === 'ios') {
                                    Linking.openURL('app-settings:');
                                } else {
                                    IntentLauncher.startActivityAsync(
                                        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                                        {
                                            data: 'package:' + Application.applicationId,
                                        }
                                    );
                                }
                            },
                        },
                    ]
                );
                return false;
            } else {
                // Permission denied but can ask again
                return false;
            }
        } catch (error) {
            console.error('Permission error:', error);
            return false;
        }
    };

    const handleExport = async (fileType) => {
        try {
            setShowExportMenu(false);
            setDownloadStatus('downloading');

            const fileUri = await generateFile(fileType);
            if (!fileUri) {
                throw new Error('File generation failed');
            }

            const savedUri = await saveFile(fileUri, fileType);
            if (savedUri) {
                setDownloadStatus('completed');
                setTimeout(() => setDownloadStatus(null), 5000);
            } else {
                setDownloadStatus(null);
            }

        } catch (error) {
            Alert.alert('Export Failed', 'Unable to export file. Please try again.');
            console.error('Export error:', error);
            setDownloadStatus(null);
        }
    };

    return (
        <>
            {downloadStatus && (
                <View style={styles.toastContainer}>
                    <MaterialIcon name={downloadStatus === 'downloading' ? 'file-download' : 'file-download-done'}
                        size={24}
                        color={downloadStatus === 'downloading' ? "#F7B2B3" : "#FB6C72"}
                        style={styles.toastIcon} />
                    <View style={styles.toastContent}>
                        <Text style={styles.toastText}>
                            {downloadStatus === 'downloading' ? 'Downloading file...' : 'Download complete'}
                        </Text>
                        <Text style={styles.toastSubtext}>
                            {downloadStatus === 'downloading'
                                ? 'See notifications for download status'
                                : filename}
                        </Text>
                    </View>
                    {downloadStatus === 'completed' && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={openFile}
                        >
                            <Text style={styles.actionButtonText}>OPEN</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <TouchableOpacity
                style={styles.downloadChip}
                onPress={() => setShowExportMenu(true)}
            >
                <MaterialCommunityIcon name="download" size={16} color="#EE6567" />
                <Text style={styles.downloadChipText}>Export</Text>
            </TouchableOpacity>

            <Modal
                transparent
                visible={showExportMenu}
                onRequestClose={() => setShowExportMenu(false)}
                animationType="fade"
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowExportMenu(false)}
                >
                    <View style={styles.exportMenu}>
                        <TouchableOpacity
                            style={styles.exportOption}
                            onPress={() => handleExport('csv')}
                        >
                            <MaterialCommunityIcon name="file-delimited" size={20} color="#666666" />
                            <Text style={styles.exportOptionText}>Export as CSV</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.exportOption}
                            onPress={() => handleExport('pdf')}
                        >
                            <MaterialCommunityIcon name="file-pdf-box" size={20} color="#666666" />
                            <Text style={styles.exportOptionText}>Export as PDF</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    downloadChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE9E9',
        paddingHorizontal: 15,
        borderRadius: 20,
        height: 36,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EE6567',
    },
    downloadChipText: {
        fontSize: 14,
        color: '#EE6567',
        fontWeight: '500',
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    exportMenu: {
        backgroundColor: 'white',
        marginTop: 140,
        marginHorizontal: 16,
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    exportOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 4,
    },
    exportOptionText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#666666',
    },
    toastContainer: {
        position: 'absolute',
        bottom: -20,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 1000,
    },
    toastIcon: {
        marginRight: 12,
    },
    toastContent: {
        flex: 1,
    },
    toastText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    toastSubtext: {
        color: '#666',
        fontSize: 14,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#EE6567',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    actionButton: {
        marginRight: 10,
    },
    actionButtonText: {
        color: '#FB6C72',
        fontSize: 16,
        fontWeight: '700',
    },
});
