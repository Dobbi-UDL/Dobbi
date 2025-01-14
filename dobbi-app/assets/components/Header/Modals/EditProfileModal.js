import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { styles } from "../../../styles/profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "@i18n";
import { format } from 'date-fns';
import { supabase } from "../../../../config/supabaseClient"; // Add database import
import { Picker } from '@react-native-picker/picker';

export const EditProfileModal = ({ isVisible, onClose, userData }) => {
  const [dbUserData, setDbUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);

  useEffect(() => {
    // Cargar países disponibles
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from('available_countries')
        .select('id, name')
        .order('name');

      if (!error && data) {
        setAvailableCountries(data);
      }
    };

    fetchCountries();
  }, []);

  // Añadir efecto para cargar las regiones cuando cambia el país
  useEffect(() => {
    const fetchRegions = async (countryId) => {
      if (!countryId) return;
      
      const { data, error } = await supabase
        .from('regions')
        .select('id, name')
        .eq('country', countryId)
        .order('name');

      if (!error && data) {
        setAvailableRegions(data);
      }
    };

    if (editedData?.country_id) {
      fetchRegions(editedData.country_id);
    }
  }, [editedData?.country_id]);

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

          // Then get profile data with countries
          const { data: profileInfo, error: profileError } = await supabase
            .from('user_profiles')
            .select(`
              age,
              gender,
              country,
              region,
              available_countries!inner (
                id,
                name
              ),
              regions!inner (
                id,
                name
              )
            `)
            .eq('user_id', userData.id)
            .single();

          if (profileError) throw profileError;

          setDbUserData({
            ...userInfo,
            ...(profileInfo || {}),
            country_id: profileInfo?.country_id,
            country_name: profileInfo?.available_countries?.name,
            region_id: profileInfo?.region_id,
            region_name: profileInfo?.regions?.name
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          setDbUserData(prev => prev || {});
        }
      };

      fetchUserData();
    }
  }, [isVisible, userData]);

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
      // Actualizar users con username y email añadidos
      const { error: userError } = await supabase
        .from('users')
        .update({
          phone_number: editedData.phone_number,
          username: editedData.username,
          email: editedData.email
        })
        .eq('id', userData.id);

      if (userError) throw userError;

      // Actualizar user_profiles con country_id en lugar de country
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          age: editedData.age,
          gender: editedData.gender,
          country: editedData.country,
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

  const renderField = (label, value, icon, field) => {
    const isEditable = ['username', 'email', 'phone_number', 'age', 'gender', 'country', 'region'].includes(field);
    
    let content;
    if (isEditing && isEditable) {
      if (field === 'country') {
        content = (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editedData?.country_id}
              style={styles.picker}
              onValueChange={(itemValue) => {
                const selectedCountry = availableCountries.find(c => c.id === itemValue);
                setEditedData(prev => ({
                  ...prev,
                  country_id: itemValue,
                  country_name: selectedCountry?.name,
                  region_id: null, // Reset region when country changes
                  region_name: null
                }));
              }}>
              <Picker.Item label={i18n.t("select_country")} value="" />
              {availableCountries.map(country => (
                <Picker.Item
                  key={country.id}
                  label={country.name}
                  value={country.id}
                />
              ))}
            </Picker>
          </View>
        );
      } else if (field === 'region') {
        content = (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editedData?.region_id}
              style={styles.picker}
              enabled={!!editedData?.country_id}
              onValueChange={(itemValue) => {
                const selectedRegion = availableRegions.find(r => r.id === itemValue);
                setEditedData(prev => ({
                  ...prev,
                  region_id: itemValue,
                  region_name: selectedRegion?.name
                }));
              }}>
              <Picker.Item label={i18n.t("select_region")} value="" />
              {availableRegions.map(region => (
                <Picker.Item
                  key={region.id}
                  label={region.name}
                  value={region.id}
                />
              ))}
            </Picker>
          </View>
        );
      } else {
        content = (
          <TextInput
            style={styles.input}
            value={String(editedData?.[field] || '')}
            onChangeText={(text) => setEditedData(prev => ({ ...prev, [field]: text }))}
            placeholder={i18n.t("notSet")}
          />
        );
      }
    } else {
      content = (
        <Text style={styles.infoText}>
          {field === 'country' ? dbUserData?.country_name : 
           field === 'region' ? dbUserData?.region_name :
           value || i18n.t("notSet")}
        </Text>
      );
    }

    return (
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Icon name={icon} size={20} color="#ff6b6b" />
        </View>
        <Text style={styles.infoLabel}>{i18n.t(label)}</Text>
        {content}
      </View>
    );
  };

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
            {renderField("country", dbUserData?.country_name, "map-marker", "country")}
            {renderField("region", dbUserData?.region_name, "map", "region")}
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
