import { userType } from "@/utils/dataType";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const [user, setUser] = useState<userType>();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.push("/(auth)");
  };
  return user ? (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontSize: 24, margin: 6 }}>Profile</Text>
        <View style={styles.boxWrapper}>
          <View style={styles.profileCard}>
            <Image
              source={{ uri: "https://via.placeholder.com/80" }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(user)/update-profile")}
          >
            <AntDesign
              name="right"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.menuList}>
          <View style={styles.itemWrapper}>
            <TouchableOpacity style={styles.menuItem}>
              <AntDesign name="creditcard" size={24} color="black" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Payment</Text>
                <Text style={styles.menuDescription}>
                  Manage your payment here
                </Text>
              </View>
            </TouchableOpacity>
            <AntDesign
              name="right"
              size={24}
              color="#666"
              style={{ marginRight: 4 }}
            />
          </View>
          <TouchableOpacity style={styles.menuItem}>
            <AntDesign name="creditcard" size={24} color="black" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Payment</Text>
              <Text style={styles.menuDescription}>
                Manage your payment here
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <AntDesign name="creditcard" size={24} color="black" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Payment</Text>
              <Text style={styles.menuDescription}>
                Manage your payment here
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.itemWrapper}>
            <View style={styles.menuItem}>
              <MaterialIcons name="logout" size={24} color="black" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Log out</Text>
                <Text style={styles.menuDescription}>
                  Further secure your account for safety
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <AntDesign
                name="right"
                size={24}
                color="#666"
                style={{ marginRight: 4 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 16, margin: 6 }}>More</Text>
        <View style={styles.menuList}>
          <View style={styles.itemWrapper}>
            <TouchableOpacity style={styles.menuItem}>
              <AntDesign name="bells" size={24} color="black" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Notifycation</Text>
                <Text style={styles.menuDescription}>
                  Further secure your account for safety
                </Text>
              </View>
            </TouchableOpacity>
            <AntDesign
              name="right"
              size={24}
              color="#666"
              style={{ marginRight: 4 }}
            />
          </View>
          <View style={styles.itemWrapper}>
            <TouchableOpacity style={styles.menuItem}>
              <AntDesign name="hearto" size={24} color="black" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>About App</Text>
                <Text style={styles.menuDescription}>
                  Further secure your account for safety
                </Text>
              </View>
            </TouchableOpacity>
            <AntDesign
              name="right"
              size={24}
              color="#666"
              style={{ marginRight: 4 }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <></>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6F2",
    padding: 16,
    justifyContent: "space-between",
  },
  boxWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#C97A54",
    borderRadius: 12,
    marginBottom: 20,
  },
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    color: "#fff",
    fontSize: 14,
  },
  menuList: {
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  menuTextContainer: {
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuDescription: {
    fontSize: 12,
    color: "#555",
  },
});
