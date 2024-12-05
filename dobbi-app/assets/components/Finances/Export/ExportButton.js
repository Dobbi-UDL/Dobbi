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
    const [filename, setFilename] = useState(null);

    const generateFile = async (fileType) => {
        let fileUri = null;

        switch (fileType) {
            case 'csv':
                fileUri = await generateCSV();
                break;
            case 'pdf':
                fileUri = await generatePDF();
                break;
            default:
                break;
        }

        return fileUri;
    };

    const generatePDF = async () => {
        try {
            const htmlContent = `
                <h1>Sample PDF</h1>
                <p>This is a sample PDF file generated using Expo Print module.</p>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            
            return uri;
        } catch (error) {
            console.error('PDF generation error:', error);
            Alert.alert('PDF Generation Failed', 'Unable to generate PDF file. Please try again.');
        }
    };

    const generateCSV = async () => {
        // To implement later
        return null;
    };

    const saveFile = async (fileUri, fileType) => {
        try {
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Error', 'Sharing is not available on this device');
                return false;
            }

            await Sharing.shareAsync(fileUri, {
                mimeType: fileType === 'csv' ? 'text/csv' : 'application/pdf',
                dialogTitle: 'Export File',
            });

            return true;
        } catch (error) {
            console.error('Error sharing file:', error);
            Alert.alert('Error', 'Failed to share file');
            return false;
        }
    };

    const handleExport = async (fileType) => {
        try {
            setShowExportMenu(false);
            setDownloadStatus('downloading');

            const timestamp = new Date().getTime();
            const newFilename = `sample-${timestamp}.${fileType}`;
            setFilename(newFilename);
            
            const fileUri = await generateFile(fileType);
            if (!fileUri) {
                throw new Error('File generation failed');
            }

            const success = await saveFile(fileUri, fileType);
            if (success) {
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
