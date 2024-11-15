import { userRegister } from "@/services/userService";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

interface UserRegisterResponse {
  errCode: number;
  errMessage?: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  username: Yup.string().required("Tên đăng nhập không được để trống"),
  password: Yup.string().required("Mật khẩu không được để trống"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu không được để trống"),
});

const Register: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response: UserRegisterResponse = (await userRegister({
          name: values.username,
          email: values.email,
          password: values.password,
        })) as any;
        console.log("response", response);
        if (response.errCode === 0) {
          Toast.show({
            type: "success",
            text1: "Đăng Kí thành công!👋",
          });
          router.push("/");
        } else {
          Toast.show({
            type: "error",
            text1: "Có lỗi xảy ra vui lòng thử lại!",
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
      <View style={styles.logoWrapper}>
        <Image
          source={require("../../assets/images/logo_mealmate.png")}
          style={styles.logo}
        />
        <Text style={styles.logoTitle}>Food Commercial</Text>
      </View>

      <View style={styles.formContainer}>
        <View>
          <View style={[styles.inputField]}>
            <FontAwesome
              style={{ marginLeft: 4 }}
              name="envelope"
              size={20}
              color="black"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={formik.handleChange("email")}
              value={formik.values.email}
              keyboardType="email-address"
            />
          </View>
          {formik.errors.email && (
            <Text style={styles.errorText}>{formik.errors.email}</Text>
          )}

          <View style={[styles.inputField]}>
            <FontAwesome
              style={{ marginLeft: 4 }}
              name="user"
              size={20}
              color="black"
            />
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              onChangeText={formik.handleChange("username")}
              value={formik.values.username}
            />
          </View>
          {formik.errors.username && (
            <Text style={styles.errorText}>{formik.errors.username}</Text>
          )}

          <View style={[styles.inputField]}>
            <FontAwesome
              style={{ marginLeft: 4 }}
              name="lock"
              size={20}
              color="black"
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              onChangeText={formik.handleChange("password")}
              value={formik.values.password}
              secureTextEntry
            />
          </View>
          {formik.errors.password && (
            <Text style={styles.errorText}>{formik.errors.password}</Text>
          )}

          <View style={[styles.inputField]}>
            <FontAwesome
              style={{ marginLeft: 4 }}
              name="lock"
              size={20}
              color="black"
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              onChangeText={formik.handleChange("confirmPassword")}
              value={formik.values.confirmPassword}
              secureTextEntry
            />
          </View>
          {formik.errors.confirmPassword && (
            <Text style={styles.errorText}>
              {formik.errors.confirmPassword}
            </Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => formik.handleSubmit()}
          >
            <Text style={styles.buttonText}>Đăng Kí</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.linkText}>Đã có tài khoản? Đăng Nhập?</Text>
          </TouchableOpacity>
        </View>
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
  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
  logoTitle: {
    color: "white",
    fontWeight: "600",
    fontSize: 28,
  },
  formContainer: {
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D3C9CA",
    padding: 10,
    borderRadius: 100,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#d79875",
    fontSize: 16,
  },
  linkText: {
    color: "#000",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  errorField: {
    borderColor: "red",
    borderWidth: 1,
  },
});

export default Register;
