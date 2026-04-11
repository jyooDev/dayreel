import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Screen } from '@/components/ui/screen';

export default function ReflectScreen() {
  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.text}>Reflect — coming soon</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    color: Colors.textMuted,
  },
});
