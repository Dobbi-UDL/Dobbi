import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  Animated
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { styles } from "../../../styles/profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "@i18n";
import { format } from 'date-fns';
import { supabase } from "../../../../config/supabaseClient";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { useRouter } from "expo-router"; // Añadir este import al principio
import { PROFILE_ENUMS, MOTIVATIONS, GOALS, DEBT_TYPES } from '../../../../constants/profileEnums';
import { NotificationToggle } from './../../NotificationToggle'; // Import the NotificationToggle component
import { profileService } from "../../../../services/profileService";
import DateTimePicker from '@react-native-community/datetimepicker';
import { locationService } from '../../../../services/locationService';
import { ProfileSearchablePicker } from '../../Profile/ProfileSearchablePicker';
import { MaterialIcons } from "@expo/vector-icons";

export const EditProfileModal = ({ isVisible, onClose, userData }) => {
  const router = useRouter(); // Añadir esta línea después de las declaraciones de estado
  const [dbUserData, setDbUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(null);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeout = useRef(null);

  // Add this constant for notification settings we want to show
  const NOTIFICATION_SETTINGS = [
    'expenses_reminder',
    'goals_updates',
    'rewards_notification',
    'app_updates',
    'ai_tips'
  ];

  // Update data structure to match onboarding
  const [profileData, setProfileData] = useState({
    personal: {
      role: null,
      birthday: null,
      gender: null,
      education: null,
      country_id: null,
      region_id: null,
    },
    motivations: {
      motivation_ids: [],
      other_motivation: '',
    },
    goals: {
      goal_ids: [],
      other_goal: '',
    },
    financials: {
      experience: null,
      savings: null,
      situation: null,
      debt_types: [],
      other_debt: '',
    },
    notifications: {
      expenses_reminder: false,
      goals_updates: false,
      rewards_notification: false,
      app_updates: false,
      ai_tips: false,
    }
  });

  useEffect(() => {
    if (isVisible && userData?.id) {
      fetchUserData(userData.id);
      fetchAvatar();
    }
  }, [isVisible, userData]);

  useEffect(() => {
    if (isVisible) {
      loadCountries();
    }
  }, [isVisible]);

  useEffect(() => {
    if (profileData.personal.country_id) {
      loadRegions(profileData.personal.country_id);
    }
  }, [profileData.personal.country_id]);

  const fetchUserData = async (userId) => {
    try {
      // Get profile details including country and region names
      const profileDetails = await profileService.getProfileDetails(userId);
      
      const { data, error } = await supabase
        .rpc('get_user_data', { p_user_id: userId });

      if (error) throw error;

      // Initialize default profile data structure
      const defaultProfileData = {
        personal: {
          role: null,
          birthday: null,
          gender: null,
          education: null,
          country: null,
          region: null,
          country_id: null,
          region_id: null,
        },
        motivations: {
          motivation_ids: [],
          other_motivation: '',
        },
        goals: {
          goal_ids: [],
          other_goal: '',
        },
        financials: {
          experience: null,
          savings: null,
          situation: null,
          debt_types: [],
          other_debt: '',
        },
        notifications: {
          expenses_reminder: false,
          goals_updates: false,
          rewards_notification: false,
          app_updates: false,
          ai_tips: false,
        }
      };

      // If we have data, merge it with the default structure
      if (data && data[0]) {
        setProfileData({
          ...defaultProfileData,
          personal: {
            ...defaultProfileData.personal,
            ...data[0].profile,
            country: profileDetails?.country || null,
            region: profileDetails?.region || null
          },
          motivations: data[0].motivations || defaultProfileData.motivations,
          goals: data[0].goals || defaultProfileData.goals,
          financials: data[0].financials || defaultProfileData.financials,
          notifications: data[0].notifications || defaultProfileData.notifications
        });
      } else {
        // If no data is found, use the default structure
        setProfileData(defaultProfileData);
        console.log('No profile data found, using default structure');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Set default data structure even when there's an error
      setProfileData({
        personal: {
          role: null,
          birthday: null,
          gender: null,
          education: null,
          country: null,
          region: null,
          country_id: null,
          region_id: null,
        },
        motivations: {
          motivation_ids: [],
          other_motivation: '',
        },
        goals: {
          goal_ids: [],
          other_goal: '',
        },
        financials: {
          experience: null,
          savings: null,
          situation: null,
          debt_types: [],
          other_debt: '',
        },
        notifications: {
          expenses_reminder: false,
          goals_updates: false,
          rewards_notification: false,
          app_updates: false,
          ai_tips: false,
        }
      });
    }
  };

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
      if (!userData?.id) {
        throw new Error('User ID is required');
      }

      setIsUpdating(true);
      const filePath = `${userData.id}/avatar.png`;

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

      if (uploadError) throw uploadError;

      // Get the signed URL immediately after upload
      const { data } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(filePath, 3600);

      if (data?.signedUrl) {
        setAvatar(data.signedUrl); // Update local state
        Alert.alert('Success', i18n.t("avatar_updated"));
      }

    } catch (error) {
      console.error('Upload error:', error.message);
      Alert.alert(
        'Error',
        'Failed to upload image: ' + (error.message || 'Unknown error')
      );
    } finally {
      setIsUpdating(false);
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
      if (!validateForm()) {
        return;
      }

      setIsSaving(true);
      const result = await profileService.updateProfile(userData.id, profileData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      // Show success message
      setShowSuccess(true);
      await fetchUserData(userData.id);
      setIsEditing(false);

      // Hide success message after 3 seconds
      successTimeout.current = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError(error.message);
      Alert.alert('Error', i18n.t('profile_update_error'));
    } finally {
      setIsSaving(false);
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

  const getEnumLabel = (type, value) => {
    if (!value) return i18n.t('notSet');
    const option = PROFILE_ENUMS[type]?.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const renderField = (label, value, icon, section, field, isEnum = false, enumType = '') => {
    const isEditable = isEditing && !isUpdating;
    const isDateField = field === 'birthday';
    
    let displayValue = value;
    if (isEnum) {
      displayValue = getEnumLabel(enumType, value);
    } else if (isDateField && value) {
      displayValue = format(new Date(value), 'MMMM d, yyyy');
    }

    return (
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Icon name={icon} size={20} color="#ff6b6b" />
        </View>
        <Text style={styles.infoLabel}>{i18n.t(label)}</Text>
        {isEditable ? (
          isDateField ? (
            <>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => handleDatePress(field)}
              >
                <Text style={styles.datePickerText}>
                  {displayValue || i18n.t('select_date')}
                </Text>
              </TouchableOpacity>
              {showDatePicker && dateField === field && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                enabled={!isUpdating}
                style={[
                  styles.picker,
                  isUpdating && styles.pickerDisabled
                ]}
                selectedValue={value}
                onValueChange={(itemValue) => 
                  handleFieldUpdate(section, field, itemValue)
                }
              >
                <Picker.Item label={i18n.t('select')} value="" />
                {PROFILE_ENUMS[enumType]?.map(option => (
                  <Picker.Item 
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          )
        ) : (
          <Text style={styles.infoText}>
            {displayValue || i18n.t('notSet')}
          </Text>
        )}
      </View>
    );
  };

  const getArrayItemLabel = (type, value) => {
    let options;
    switch (type) {
        case 'motivations':
            options = MOTIVATIONS;
            break;
        case 'goals':
            options = GOALS;
            break;
        case 'debtTypes':
            options = DEBT_TYPES;
            break;
        default:
            return value;
    }
    
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
};

const renderArrayField = (fieldType, items = []) => {
    if (!items || items.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                    {i18n.t('no_items_selected')}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.arrayFieldContainer}>
            {items.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.chip}>
                    <Text style={styles.chipText}>
                        {getArrayItemLabel(fieldType, item)}
                    </Text>
                    {isEditing && (
                        <TouchableOpacity
                            style={styles.chipDelete}
                            onPress={() => handleRemoveItem(fieldType, item)}
                        >
                            <Icon name="close-circle" size={16} color="#ff6b6b" />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
};

  const handleRemoveItem = (fieldType, item) => {
    setProfileData(prev => {
      const section = fieldType === 'debtTypes' ? 'financials' : 
                     fieldType === 'motivations' ? 'motivations' : 'goals';
      
      const arrayField = fieldType === 'debtTypes' ? 'debt_types' : 
                        fieldType === 'motivations' ? 'motivation_ids' : 'goal_ids';

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayField]: prev[section][arrayField].filter(i => i !== item)
        }
      };
    });
  };

  const renderAvatarSection = () => (
    <View style={styles.avatarSection}>
      <TouchableOpacity 
        onPress={isEditing ? pickImage : null}
        style={styles.avatarButton}
      >
        {avatar ? (
          <Image 
            source={{ uri: avatar }} 
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {getInitials(userData?.username)}
            </Text>
          </View>
        )}
        {isEditing && (
          <View style={styles.editAvatarButton}>
            <Icon name="camera" size={18} color="white" />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.editAvatarText}>
        {isEditing ? 'Tap to change profile photo' : ''}
      </Text>
    </View>
  );

  const renderSectionHeader = (icon, title, subtitle = null) => (
    <View style={styles.infoHeader}>
        <Icon name={icon} size={24} color="#ff6b6b" />
        <View style={styles.headerTextContainer}>
            <Text style={styles.infoHeaderTitle}>{i18n.t(title)}</Text>
            {subtitle && (
                <Text style={styles.infoHeaderSubtitle}>{i18n.t(subtitle)}</Text>
            )}
        </View>
    </View>
);

  const handleCountrySearch = async (searchTerm) => {
    const data = await locationService.searchCountries(searchTerm);
    setCountries(data);
  };

  const handleRegionSearch = async (searchTerm) => {
    if (!profileData.personal.country) return;
    const data = await locationService.searchRegions(searchTerm, profileData.personal.country.id);
    setRegions(data);
  };

  const handleCountrySelect = async (country) => {
    handleFieldUpdate('personal', 'country', country);
    handleFieldUpdate('personal', 'region', null);
    // Load all regions for the selected country immediately
    if (country) {
      const data = await locationService.searchRegions('', country.id);
      setRegions(data);
    } else {
      setRegions([]);
    }
  };

  const renderLocationFields = () => (
    <>
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Icon name="map-marker" size={20} color="#ff6b6b" />
        </View>
        <Text style={styles.infoLabel}>{i18n.t("country")}</Text>
        {isEditing ? (
          <ProfileSearchablePicker
            placeholder={i18n.t("select_country")}
            value={profileData.personal.country?.name}
            items={countries}
            onSearch={handleCountrySearch}
            onSelect={handleCountrySelect}
            icon="public"
          />
        ) : (
          <Text style={styles.infoText}>
            {profileData.personal.country?.name || i18n.t('notSet')}
          </Text>
        )}
      </View>

      {(isEditing || profileData.personal.region) && (
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Icon name="map" size={20} color="#ff6b6b" />
          </View>
          <Text style={styles.infoLabel}>{i18n.t("region")}</Text>
          {isEditing ? (
            <ProfileSearchablePicker
              placeholder={i18n.t("select_region")}
              value={profileData.personal.region?.name}
              items={regions}
              onSearch={handleRegionSearch}
              onSelect={(region) => handleFieldUpdate('personal', 'region', region)}
              icon="place"
              disabled={!profileData.personal.country}
            />
          ) : (
            <Text style={styles.infoText}>
              {profileData.personal.region?.name || i18n.t('notSet')}
            </Text>
          )}
        </View>
      )}
    </>
  );

  const renderPersonalSection = () => (
    <View style={styles.infoSection}>
      {renderSectionHeader("account-circle-outline", "personalInfo")}
      {renderField("role", profileData.personal.role, "briefcase", "personal", "role", true, "role")}
      {renderField("birthday", profileData.personal.birthday, "calendar", "personal", "birthday")}
      {renderField("gender", profileData.personal.gender, "gender-male-female", "personal", "gender", true, "gender")}
      {renderField("education", profileData.personal.education, "school", "personal", "education", true, "education")}
      {renderLocationFields()}
    </View>
  );

  const renderMultiSelect = (fieldType, selectedItems, options) => {
    if (!isEditing) {
      return renderArrayField(fieldType, selectedItems);
    }

    return (
      <>
        {renderArrayField(fieldType, selectedItems)}
        <View style={styles.addOptionsContainer}>
          {options.map(option => {
            const isSelected = selectedItems.includes(option.value);
            if (!isSelected) {
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.addOptionChip}
                  onPress={() => handleAddItem(fieldType, option.value)}
                >
                  <MaterialIcons name={option.icon} size={16} color="#666" />
                  <Text style={styles.addOptionText}>{option.label}</Text>
                  <MaterialIcons name="add" size={16} color="#666" />
                </TouchableOpacity>
              );
            }
          })}
        </View>
        {selectedItems.includes('other') && (
          <TextInput
            style={[styles.otherInput, { marginTop: 8 }]}
            placeholder={`Add details about other ${fieldType}`}
            value={getOtherFieldValue(fieldType)}
            onChangeText={(text) => handleOtherFieldUpdate(fieldType, text)}
            multiline={true}
            numberOfLines={3}
          />
        )}
      </>
    );
  };

  const handleAddItem = (fieldType, value) => {
    const section = fieldType === 'debtTypes' ? 'financials' : 
                   fieldType === 'motivations' ? 'motivations' : 'goals';
    
    const arrayField = fieldType === 'debtTypes' ? 'debt_types' : 
                      fieldType === 'motivations' ? 'motivation_ids' : 'goal_ids';

    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: [...prev[section][arrayField], value]
      }
    }));
  };

  const getOtherFieldValue = (fieldType) => {
    switch (fieldType) {
      case 'motivations':
        return profileData.motivations.other_motivation;
      case 'goals':
        return profileData.goals.other_goal;
      case 'debtTypes':
        return profileData.financials.other_debt;
      default:
        return '';
    }
  };

  const handleOtherFieldUpdate = (fieldType, text) => {
    switch (fieldType) {
      case 'motivations':
        handleFieldUpdate('motivations', 'other_motivation', text);
        break;
      case 'goals':
        handleFieldUpdate('goals', 'other_goal', text);
        break;
      case 'debtTypes':
        handleFieldUpdate('financials', 'other_debt', text);
        break;
    }
  };

  const renderMotivationsSection = () => (
    <View style={styles.infoSection}>
        {renderSectionHeader(
            "star",
            "app_purpose",
            "what_brings_you_here"
        )}
        {renderMultiSelect("motivations", profileData.motivations.motivation_ids, MOTIVATIONS)}
    </View>
);

  const renderGoalsSection = () => (
    <View style={styles.infoSection}>
        {renderSectionHeader(
            "target",
            "financial_goals",
            "what_you_want_to_achieve"
        )}
        {renderMultiSelect("goals", profileData.goals.goal_ids, GOALS)}
    </View>
);

  const renderFinancialsSection = () => (
    <View style={styles.infoSection}>
        {renderSectionHeader("wallet", "financial_profile", "your_current_situation")}
        {renderField("experience", profileData.financials.experience, "trending-up", "financials", "experience", true, "experience")}
        {renderField("savings", profileData.financials.savings, "piggy-bank", "financials", "savings", true, "savings")}
        {renderField("situation", profileData.financials.situation, "chart-line", "financials", "situation", true, "situation")}
    </View>
);

  const renderDebtSection = () => (
    <View style={styles.infoSection}>
      {renderSectionHeader("credit-card", "current_debt", "debt-subtitle")}
      {renderMultiSelect("debtTypes", profileData.financials.debt_types, DEBT_TYPES)}
    </View>
  );

  const renderNotificationsSection = () => (
    <View style={styles.infoSection}>
      {renderSectionHeader("bell", "notifications_section")}
      {NOTIFICATION_SETTINGS.map((key) => (
        <NotificationToggle
          key={key}
          label={i18n.t(`notifications.${key}`)}
          value={profileData.notifications[key] || false}
          onToggle={(newValue) => handleNotificationToggle(key, newValue)}
          enabled={isEditing && !isUpdating}
        />
      ))}
    </View>
  );

  const renderEditButton = () => (
    <TouchableOpacity 
      style={[
        styles.editButtonFloat,
        isEditing && { backgroundColor: '#4CAF50' },
        isUpdating && { opacity: 0.7 }
      ]}
      onPress={isEditing ? handleSave : handleEdit}
      disabled={isUpdating}
    >
      {isUpdating ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Icon 
          name={isEditing ? "check" : "pencil"} 
          size={24} 
          color="white" 
        />
      )}
    </TouchableOpacity>
  );

  const renderError = () => (
    updateError && (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{updateError}</Text>
      </View>
    )
  );

  // Add field update handler
  const handleFieldUpdate = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: field === 'birthday' ? new Date(value).toISOString() : value
      }
    }));
  };

  // Add array field update handler
  const handleArrayFieldUpdate = (fieldType, value, isAdd = true) => {
    const section = fieldType === 'debtTypes' ? 'financials' : 
                   fieldType === 'motivations' ? 'motivations' : 'goals';
    
    const arrayField = fieldType === 'debtTypes' ? 'debt_types' : 
                      fieldType === 'motivations' ? 'motivation_ids' : 'goal_ids';

    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: isAdd 
          ? [...new Set([...prev[section][arrayField], value])]
          : prev[section][arrayField].filter(item => item !== value)
      }
    }));
  };

  // Add notification toggle handler
  const handleNotificationToggle = async (key, value) => {
    // Only update local state during editing, actual save happens with form submit
    handleFieldUpdate('notifications', key, value);
  };

  // Add avatar update handler
  const handleAvatarUpdate = async (imageUri) => {
    try {
      setIsUpdating(true);
      await uploadAvatar(imageUri);
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert(i18n.t('error'), i18n.t('avatar_update_error'));
    } finally {
      setIsUpdating(false);
    }
  };

  // Add country/region handler
  const handleLocationUpdate = async (type, value) => {
    try {
      setIsUpdating(true);
      
      if (type === 'country') {
        // Reset region when country changes
        handleFieldUpdate('personal', 'region_id', null);
        handleFieldUpdate('personal', 'country_id', value);
        
        // Fetch new regions for selected country
        const { data: regions, error } = await supabase
          .from('regions')
          .select('*')
          .eq('country_id', value);
          
        if (error) throw error;
        
        // Update available regions in state if needed
        // You might want to add a state for available regions if not already present
      }
      
      handleFieldUpdate('personal', `${type}_id`, value);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      Alert.alert(i18n.t('error'), i18n.t(`${type}_update_error`));
    } finally {
      setIsUpdating(false);
    }
  };

  // Add form validation handler
  const validateForm = () => {
    return true;
  };

  // Add date picker handler
  const handleDatePress = (field) => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      handleFieldUpdate('personal', dateField, selectedDate.toISOString());
    }
  };

  const loadCountries = async () => {
    const countriesData = await locationService.getAvailableCountries();
    setCountries(countriesData);
  };

  const loadRegions = async (countryId) => {
    const regionsData = await locationService.searchRegions('', countryId);
    setRegions(regionsData);
  };

  useEffect(() => {
    return () => {
      if (successTimeout.current) {
        clearTimeout(successTimeout.current);
      }
    };
  }, []);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <SafeAreaView edges={["top"]} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: '#ff6b6b', textAlign: 'left' }]}>{i18n.t("profile")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.modalBody}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: isEditing ? 100 : 20 }}
        >
          {renderAvatarSection()}
          {renderPersonalSection()}
          {renderMotivationsSection()}
          {renderGoalsSection()}
          {renderFinancialsSection()}
          {renderDebtSection()}
          {renderNotificationsSection()}
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

        {!isEditing && (
          <TouchableOpacity 
            style={styles.editButtonFloat}
            onPress={handleEdit}
          >
            <Icon name="pencil" size={24} color="white" />
          </TouchableOpacity>
        )}

        {isEditing && (
          <View style={styles.editingButtonsContainer}>
            <TouchableOpacity 
              style={styles.editButtonCancel}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <Text style={[styles.buttonText, styles.buttonTextCancel]}>
                {i18n.t("cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.editButtonSave}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={[styles.buttonText, styles.buttonTextSave]}>
                {i18n.t("save")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isSaving && (
          <View style={styles.savingOverlay}>
            <View style={styles.savingContainer}>
              <ActivityIndicator size="large" color="#ff6b6b" />
              <Text style={styles.savingText}>{i18n.t("saving_changes")}</Text>
            </View>
          </View>
        )}

        {showSuccess && (
          <Animated.View style={styles.successOverlay}>
            <Icon name="check-circle" size={24} color="white" />
            <Text style={styles.successText}>
              {i18n.t("changes_saved_successfully")}
            </Text>
          </Animated.View>
        )}

        {renderError()}
      </SafeAreaView>
    </Modal>
  );
};
