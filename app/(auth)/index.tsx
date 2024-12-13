import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userLogin } from "@/services/userService";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

interface FormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Tên đăng nhập không được để trống"),
  password: Yup.string().required("Mật khẩu không được để trống"),
});

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = (await userLogin({
          email: values.email,
          password: values.password,
        })) as any;
        console.log("responseresponse", response);
        if (response.errCode === 0) {
          Toast.show({
            type: "success",
            text1: "Đăng nhập thành công!👋",
          });
          await AsyncStorage.setItem("user", JSON.stringify(response.user));
          router.push("/home");
        } else {
          Toast.show({
            type: "error",
            text1: "Thông tin tài khoản hoặc mật khẩu không chính xác!",
          });
          setErrorMessage("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }
      } catch (error) {
        setErrorMessage("Đã xảy ra lỗi trong quá trình đăng nhập.");
        console.error("Login error:", error);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo_mealmate.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Food Commercial</Text>

      <View style={styles.form}>
        <View>
          <AntDesign name="user" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={[styles.input]}
            placeholder="Email"
            onChangeText={formik.handleChange("email")}
            value={formik.values.email}
          />
        </View>
        {formik.errors.email && (
          <Text style={styles.errorText}>{formik.errors.email}</Text>
        )}
        <View>
          <FontAwesome name="lock" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={[styles.input]}
            placeholder="Mật khẩu"
            secureTextEntry
            onChangeText={formik.handleChange("password")}
            value={formik.values.password}
          />
        </View>
        {formik.errors.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}
        <Text style={styles.linkTextForgot}>Quên mật khẩu?</Text>
        <TouchableOpacity
          onPress={() => formik.handleSubmit()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.links}>
          <Text
            style={styles.linkText}
            onPress={() => router.push("/register")}
          >
            Bạn chưa có tài khoản? Đăng Kí?
          </Text>
        </View>
        
        <View style={styles.links}>
          <Text
            style={styles.links}  
            onPress={() => router.push("/Products_page/food_products_page")}
          >
            Test -- trang products
          </Text>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d79875",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 28,
    marginBottom: 20,
  },
  form: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#D3C9CA",
    borderRadius: 100,
    padding: 10,
    marginBottom: 15,
    color: "#000",
    paddingLeft: 40,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  icon: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
  },
  button: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "#d79875",
    fontSize: 16,
  },
  links: {
    marginTop: 10,
  },
  linkTextForgot: {
    color: "#000",
    textAlign: "right",
    marginBottom: 5,
  },
  linkText: {
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default Login;
