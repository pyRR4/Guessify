import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScreenBannerProps {
  title: string;
}

const ScreenBanner: React.FC<ScreenBannerProps> = ({ title }) => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#00C853',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ScreenBanner;
