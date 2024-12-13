import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { userType } from "@/utils/dataType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { updateProfile } from "@/services/userService";
import Toast from "react-native-toast-message";

const UpdateProfileScreen = () => {
  const [user, setUser] = useState<userType>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setName(parsedUser.name || "");
        setPhone(parsedUser.phoneNumber || "");
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu không khớp",
      });
      return;
    }

    const res = (await updateProfile({
      email: user?.email,
      name: name.trim() !== "" ? name : user?.name,
      phoneNumber: phone.trim() !== "" ? phone : user?.phoneNumber,
      password: password.trim() !== "" ? password : undefined,
      id: String(user?.id),
    })) as any;

    if (res) {
      if (user) {
        setUser({
          ...user,
          name: name.trim() !== "" ? name : user.name,
          phoneNumber: phone.trim() !== "" ? phone : user?.phoneNumber,
        });
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name: name.trim() !== "" ? name : user.name,
            phoneNumber: phone.trim() !== "" ? phone : user?.phoneNumber,
          })
        );
        Toast.show({
          type: "success",
          text1: "Cập nhật thông tin thành công",
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/account")}>
          <FontAwesome name="long-arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Update Profile</Text>
        <View />
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's your full name?"
          value={name}
          onChangeText={setName}
        />

        <View style={styles.phoneContainer}>
          <Text style={styles.countryCode}>🇳🇬</Text>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TextInput
          style={[styles.input, { marginBottom: 15 }]}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateProfile}
      >
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
      <Toast />
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F4EF",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    marginTop: 12,
  },
  countryCode: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 0,
  },
  updateButton: {
    backgroundColor: "#C97A54",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
