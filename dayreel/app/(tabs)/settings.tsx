import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.footer}>
        <Button
          label="Log out"
          variant="ghost"
          loading={loading}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  logoutButton: {
    borderColor: Colors.danger,
  },
});
