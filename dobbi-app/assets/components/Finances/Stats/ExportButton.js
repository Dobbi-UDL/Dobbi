import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Alert, Platform } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-asset';
import * as Print from 'expo-print';

export const ExportButton = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState(''); // 'downloading', 'completed', null

    const generateSampleData = (fileType) => {
        return "This is a sample";
    };

    const saveFile = async (content, filename) => {
        try {
            const fileUri = `${FileSystem.documentDirectory}${filename}`;
            await FileSystem.writeAsStringAsync(fileUri, content);

            if (Platform.OS === 'android') {
                const permissions = await MediaLibrary.requestPermissionsAsync();
                if (permissions.granted) {
                    const asset = await MediaLibrary.createAssetAsync(fileUri);
                    return { fileUri, asset };
                }
            }

            return { fileUri };
        } catch (error) {
            console.error('Error saving file:', error);
            Alert.alert('Error', 'Failed to save file');
            return null;
        }
    };

    const handleExport = async (fileType) => {
        try {
            setShowExportMenu(false); // Close menu immediately
            setDownloadStatus('downloading');
            const timestamp = new Date().getTime();
            const content = generateSampleData(fileType);
            const filename = `sample-${timestamp}.${fileType}`;

            let result;
            if (fileType === 'pdf') {
                const html = `
                    <html>
                        <body>
                            <p>${content}</p>
                        </body>
                    </html>
                `;
                const { uri } = await Print.printToFileAsync({ html });
                result = { fileUri: uri };
            } else {
                result = await saveFile(content, filename);
            }

            if (result) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate download time
                setDownloadStatus('completed');

                // Auto-hide the completion message after 5 seconds
                setTimeout(() => setDownloadStatus(null), 5000);
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
                                : 'sample-file.pdf'} {/* Replace with actual filename */}
                        </Text>
                    </View>
                    {downloadStatus === 'completed' && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setDownloadStatus(null)}
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
