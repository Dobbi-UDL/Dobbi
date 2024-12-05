
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const ExportButton = () => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const generateSampleData = (fileType) => {
        if (fileType === 'csv') {
            return 'Date,Amount,Category\n2023-01-01,100,Food\n2023-01-02,200,Transport';
        } else {
            return `
                <html>
                    <body>
                        <h1>Financial Report</h1>
                        <p>Sample financial data for demonstration:</p>
                        <table>
                            <tr><th>Date</th><th>Amount</th><th>Category</th></tr>
                            <tr><td>2023-01-01</td><td>$100</td><td>Food</td></tr>
                            <tr><td>2023-01-02</td><td>$200</td><td>Transport</td></tr>
                        </table>
                    </body>
                </html>
            `;
        }
    };

    const saveFile = async (content, filename) => {
        try {
            const fileUri = FileSystem.documentDirectory + filename;
            await FileSystem.writeAsStringAsync(fileUri, content);
            
            if (Platform.OS === 'android') {
                const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                
                if (permissions.granted) {
                    const base64Content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
                    await FileSystem.StorageAccessFramework.createFileAsync(
                        permissions.directoryUri,
                        filename,
                        'text/csv'
                    ).then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64Content, { encoding: FileSystem.EncodingType.Base64 });
                        Alert.alert('Success', 'File saved successfully!');
                    });
                } else {
                    await Sharing.shareAsync(fileUri);
                }
            } else {
                await Sharing.shareAsync(fileUri);
            }
            
            return true;
        } catch (error) {
            console.error('Error saving file:', error);
            Alert.alert('Error', 'Failed to save file');
            return false;
        }
    };

    const handleExport = async (fileType) => {
        try {
            const timestamp = new Date().getTime();
            const content = generateSampleData(fileType);
            const filename = `financial-report-${timestamp}.${fileType}`;
            
            const success = await saveFile(content, filename);
            if (success) {
                setShowExportMenu(false);
            }
        } catch (error) {
            Alert.alert('Export Failed', 'Unable to export file. Please try again.');
            console.error('Export error:', error);
        }
    };

    return (
        <View>
            <TouchableOpacity 
                style={styles.downloadChip}
                onPress={() => setShowExportMenu(true)}
            >
                <Icon name="download" size={16} color="#EE6567" />
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
                            <Icon name="file-delimited" size={20} color="#666666" />
                            <Text style={styles.exportOptionText}>Export as CSV</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.exportOption}
                            onPress={() => handleExport('pdf')}
                        >
                            <Icon name="file-pdf-box" size={20} color="#666666" />
                            <Text style={styles.exportOptionText}>Export as PDF</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
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
});