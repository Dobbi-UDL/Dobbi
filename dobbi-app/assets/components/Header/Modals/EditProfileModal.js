import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Image
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { styles } from "../../../styles/profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "@i18n";
import { format } from 'date-fns';
import { supabase } from "../../../../config/supabaseClient"; // Add database import
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { useRouter } from "expo-router"; // Añadir este import al principio

export const EditProfileModal = ({ isVisible, onClose, userData }) => {
  const router = useRouter(); // Añadir esta línea después de las declaraciones de estado
  const [dbUserData, setDbUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (isVisible && userData?.id) {
      const fetchUserData = async () => {
        try {
          // First get user data
          const { data: userInfo, error: userError } = await supabase
            .from('users')
            .select('email, phone_number, username, created_at')
            .eq('id', userData.id)
            .maybeSingle();

          if (userError) throw userError;

          // Get profile data including country and region names
          const { data: profileInfo, error: profileError } = await supabase
            .from('user_profiles')
            .select(`
              age,
              gender,
              country,
              region,
              available_countries (
                name
              ),
              regions (
                name
              )
            `)
            .eq('user_id', userData.id)
            .single();

          if (profileError) throw profileError;

          // Preparar los datos con los nombres en lugar de IDs
          const formattedData = {
            ...userInfo,
            ...(profileInfo || {}),
            country: profileInfo?.available_countries?.name || '',
            region: profileInfo?.regions?.name || ''
          };

          setDbUserData(formattedData);
          if (isEditing) {
            setEditedData(formattedData);
          }
          
        } catch (error) {
          console.error('Error fetching data:', error);
          setDbUserData(prev => prev || {});
        }
      };

      fetchUserData();
      fetchAvatar();
    }
  }, [isVisible, userData]);

  const fetchAvatar = async () => {
    try {
      const { data } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(`${userData.id}/avatar.png`, 3600);

      if (data?.signedUrl) {
        setAvatar(data.signedUrl);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  };

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          i18n.t("permissions_required"),
          i18n.t("gallery_permissions_message")
        );
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log("Selected image:", asset); // Para depuración
        await uploadAvatar(asset.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        i18n.t("error"),
        i18n.t("image_pick_error")
      );
    }
  };

  const uploadAvatar = async (uri) => {
    try {
      console.log('Starting upload process with URI:', uri);

      // Ensure we have a user ID
      if (!userData?.id) {
        throw new Error('User ID is required');
      }

      const filePath = `${userData.id}/avatar.png`;
      console.log('Uploading to path:', filePath);

      // Convert to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert to array buffer
      const arrayBuffer = decode(base64);

      // Upload with explicit path
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/png',
          upsert: true,
          duplex: 'half'
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get the public URL using the same path
      const { data: publicUrlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        console.log('Upload successful, URL:', publicUrlData.publicUrl);
        setAvatar(publicUrlData.publicUrl);
        Alert.alert('Success', i18n.t("avatar_updated"));
      }

    } catch (error) {
      console.error('Upload error:', error.message);
      Alert.alert(
        'Error',
        'Failed to upload image: ' + (error.message || 'Unknown error')
      );
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Unknown';
      return format(date, 'MMMM yyyy');
    } catch (error) {
      return 'Unknown';
    }
  };

  const handleEdit = () => {
    setEditedData(dbUserData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const handleSave = async () => {
    try {
      // Actualizar users
      const { error: userError } = await supabase
        .from('users')
        .update({
          phone_number: editedData.phone_number,
          username: editedData.username,
          email: editedData.email
        })
        .eq('id', userData.id);

      if (userError) throw userError;

      // Primero obtener los IDs correspondientes a los nombres
      const { data: countryData } = await supabase
        .from('available_countries')
        .select('id')
        .eq('name', editedData.country)
        .single();

      const { data: regionData } = await supabase
        .from('regions')
        .select('id')
        .eq('name', editedData.region)
        .single();

      // Actualizar user_profiles con los IDs obtenidos
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          age: editedData.age,
          gender: editedData.gender,
          country: countryData?.id,
          region: regionData?.id
        })
        .eq('user_id', userData.id);

      if (profileError) throw profileError;

      setDbUserData(editedData);
      setIsEditing(false);
      Alert.alert('Success', i18n.t("profile_updated"));
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', i18n.t("profile_update_error"));
    }
  };

  const handleResetPassword = async () => {
    if (!userData?.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      Alert.alert('Invalid email', 'Please provide a valid email address.');
      return;
    }
  
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userData.email, {
        redirectTo: 'dobbi://reset-password',
      });
  
      if (error) throw error;
  
      Alert.alert(
        i18n.t('password_reset_sent'),
        i18n.t('password_reset_instructions')
      );
    } catch (error) {
      console.error('Error sending reset password:', error.message);
      Alert.alert('Error', i18n.t('password_reset_error'));
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      i18n.t('delete_account'),
      i18n.t('delete_account_confirmation'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel'
        },
        {
          text: i18n.t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Primero eliminar datos del perfil
              const { error: profileError } = await supabase
                .from('user_profiles')
                .delete()
                .eq('user_id', userData.id);

              if (profileError) throw profileError;

              // Luego eliminar datos del usuario
              const { error: userError } = await supabase
                .from('users')
                .delete()
                .eq('id', userData.id);

              if (userError) throw userError;

              // Finalmente cerrar sesión
              const { error: authError } = await supabase.auth.signOut();
              
              if (authError) throw authError;

              Alert.alert(
                i18n.t('account_deleted'),
                i18n.t('account_deleted_message'),
                [{
                  text: 'OK',
                  onPress: () => {
                    onClose();
                    router.replace('/');
                  }
                }]
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', i18n.t('delete_account_error'));
            }
          }
        }
      ]
    );
  };

  const renderField = (label, value, icon, field) => {
    const isEditable = ['username', 'email', 'phone_number', 'age', 'gender', 'country', 'region'].includes(field);
    
    // Obtener el valor correcto para campos especiales
    let displayValue = value;
    if (field === 'country') {
      displayValue = dbUserData?.available_countries?.name;
    } else if (field === 'region') {
      displayValue = dbUserData?.regions?.name;
    }

    return (
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Icon name={icon} size={20} color="#ff6b6b" />
        </View>
        <Text style={styles.infoLabel}>{i18n.t(label)}</Text>
        {isEditing && isEditable ? (
          <TextInput
            style={styles.input}
            value={String(editedData?.[field] || '')}
            onChangeText={(text) => setEditedData(prev => ({ ...prev, [field]: text }))}
            placeholder={i18n.t("notSet")}
          />
        ) : (
          <Text style={styles.infoText}>
            {displayValue || i18n.t("notSet")}
          </Text>
        )}
      </View>
    );
  };

  const renderAvatarSection = () => (
    <View style={styles.avatarSection}>
      <TouchableOpacity onPress={isEditing ? pickImage : null}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {getInitials(dbUserData?.username)}
            </Text>
          </View>
        )}
        {isEditing && (
          <View style={styles.editAvatarButton}>
            <Icon name="camera" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <SafeAreaView edges={["top"]} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{i18n.t("profile")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>

        {isEditing && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>{i18n.t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView 
          style={styles.modalBody}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {renderAvatarSection()}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Icon name="account-circle-outline" size={24} color="#ff6b6b" />
              <Text style={styles.infoHeaderTitle}>{i18n.t("personalInfo")}</Text>
            </View>

            {renderField("username", dbUserData?.username, "account", "username")}
            {renderField("email", dbUserData?.email, "email", "email")}
            {renderField("phone", dbUserData?.phone_number, "phone", "phone_number")}
            {renderField("joined", formatDate(dbUserData?.created_at), "clock-outline", "created_at")}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Icon name="card-account-details-outline" size={24} color="#ff6b6b" />
              <Text style={styles.infoHeaderTitle}>{i18n.t("additionalInfo")}</Text>
            </View>

            {renderField("age", dbUserData?.age, "calendar-outline", "age")}
            {renderField("gender", dbUserData?.gender, "gender-male-female", "gender")}
            {renderField("country", dbUserData?.country, "map-marker", "country")}
            {renderField("region", dbUserData?.region, "map", "region")}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Icon name="shield-key" size={24} color="#ff6b6b" />
              <Text style={styles.infoHeaderTitle}>{i18n.t("security")}</Text>
            </View>

            <TouchableOpacity
              style={styles.securityButton}
              onPress={handleResetPassword}
            >
              <Icon name="lock-reset" size={20} color="#ff6b6b" />
              <Text style={styles.securityButtonText}>
                {i18n.t("reset_password")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.securityButton, styles.deleteButton]}
              onPress={handleDeleteAccount}
            >
              <Icon name="delete" size={20} color="#ff3333" />
              <Text style={[styles.securityButtonText, styles.deleteButtonText]}>
                {i18n.t("delete_account")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {!isEditing ? (
          <TouchableOpacity 
            style={styles.editButtonFloat}
            onPress={handleEdit}
          >
            <Icon name="pencil" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.editButtonFloat, { backgroundColor: '#4CAF50' }]}
            onPress={handleSave}
          >
            <Icon name="check" size={24} color="white" />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Modal>
  );
};
