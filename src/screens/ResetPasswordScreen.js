/*import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../api";
import { useNavigation } from "@react-navigation/native";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // ------------------------------------------------
  // REQUEST RESET TOKEN
  // ------------------------------------------------
  const requestReset = async () => {
    if (!email.trim()) {
      return Alert.alert("Validation Error", "Please enter your email");
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });

      Alert.alert("Success", "A reset token has been sent to your email.");

      // OPTIONAL: Show token for debugging
      console.log("DEBUG TOKEN:", res.data.token);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // RESET PASSWORD
  // ------------------------------------------------
  const resetPassword = async () => {
    if (!token.trim() || !newPassword.trim()) {
      return Alert.alert("Validation Error", "Enter token and new password");
    }

    try {
      setLoading(true);

      // IMPORTANT: match backend → { token, newPassword }
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      Alert.alert("Success", "Password reset successfully!", [
        {
          text: "Go To Login",
          onPress: () => navigation.navigate("Login"), // 👈 Redirect
        },
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // REUSABLE INPUT
  // ------------------------------------------------
  const Input = ({ value, onChangeText, placeholder, secure }) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secure}
      placeholderTextColor="#888"
      style={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        backgroundColor: "#fff",
        fontSize: 16,
      }}
    />
  );

  const Button = ({ title, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: loading ? "#999" : "#4b7bec",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 15,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
        {loading ? "Please wait..." : title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f9" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 30 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              alignSelf: "center",
              marginBottom: 20,
              color: "#2d3436",
            }}
          >
            Reset Password
          </Text>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            {/* ===================== *}
            {/* REQUEST TOKEN SECTION *}
            {/* ===================== *}
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}>
              Forgot your password?
            </Text>

            <Text style={{ color: "#777", marginBottom: 10 }}>
              Enter your email and we will send you a reset token.
            </Text>

            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
            />

            <Button title="Send Reset Token" onPress={requestReset} />

            {/* DIVIDER *}
            <View
              style={{
                height: 1,
                backgroundColor: "#eee",
                marginVertical: 20,
              }}
            />

            {/* ===================== *}
            {/* RESET PASSWORD SECTION *}
            {/* ===================== *}
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}>
              Reset your password
            </Text>

            <Input
              value={token}
              onChangeText={setToken}
              placeholder="Enter reset token"
            />

            <Input
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              secure
            />

            <Button title="Reset Password" onPress={resetPassword} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}*/

import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import api from "../api";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // -------------------------------
  // REQUEST RESET TOKEN
  // -------------------------------
  const requestReset = async () => {
    if (!email.trim()) {
      return Alert.alert("Validation Error", "Please enter your email");
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });

      Alert.alert("Success", "A reset token has been sent to your email.");
      console.log("DEBUG TOKEN:", res.data.token);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // RESET PASSWORD
  // -------------------------------
  const resetPassword = async () => {
    if (!token.trim() || !newPassword.trim()) {
      return Alert.alert("Validation Error", "Enter token and new password");
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      Alert.alert("Success", "Password reset successfully!", [
        {
          text: "Go To Login",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Securely recover access to your account
        </Text>

        {/* CARD */}
        <View style={styles.card}>
          {/* REQUEST TOKEN */}
          <Text style={styles.sectionTitle}>Forgot your password?</Text>
          <Text style={styles.sectionDescription}>
            Enter your email to receive a reset token.
          </Text>

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
          />

          <PrimaryButton
            title="Send Reset Token"
            loading={loading}
            onPress={requestReset}
          />

          <View style={styles.divider} />

          {/* RESET PASSWORD */}
          <Text style={styles.sectionTitle}>Set new password</Text>

          <Input
            value={token}
            onChangeText={setToken}
            placeholder="Reset token"
          />

          <Input
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            secure
          />

          <PrimaryButton
            title="Reset Password"
            loading={loading}
            onPress={resetPassword}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================= */
/* REUSABLE COMPONENTS           */
/* ============================= */

const Input = ({ value, onChangeText, placeholder, secure }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    secureTextEntry={secure}
    placeholderTextColor="#9aa0a6"
    style={styles.input}
  />
);

const PrimaryButton = ({ title, onPress, loading }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    style={[
      styles.button,
      loading && styles.buttonDisabled,
    ]}
  >
    <Text style={styles.buttonText}>
      {loading ? "Please wait..." : title}
    </Text>
  </TouchableOpacity>
);

/* ============================= */
/* STYLES                        */
/* ============================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  scroll: {
    padding: 20,
    paddingTop: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },

  sectionDescription: {
    fontSize: 14,
    color: "#777",
    marginBottom: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e1e5ea",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },

  buttonDisabled: {
    backgroundColor: "#9bb3f0",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 22,
  },
});

