import Sound from 'react-native-sound';
import { Platform } from 'react-native';

/*
let currentSound: Sound | null = null;

export const playSnippet = (fileName: string, durationMs: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    Sound.setCategory('Playback');

    const isAndroid = Platform.OS === 'android';

    // Android: Use raw resource name (no extension), lowercase
    const soundFile = isAndroid
      ? fileName.replace('.mp3', '').toLowerCase()
      : fileName;

    currentSound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('❌ Failed to load sound:', error);
        reject(error);
        return;
      }

      console.log('✅ Sound loaded. Playing snippet...');

      currentSound?.play((success) => {
        if (!success) console.warn('⚠️ Playback failed');
      });

      setTimeout(() => {
        currentSound?.stop(() => {
          console.log('🛑 Playback stopped after duration');
          resolve();
        });
      }, durationMs);
    });
  });
};
*/


Sound.setCategory('Playback');
var currentSound: Sound;


export function playSong(sonFileName: string){
  return new Promise((resolve, reject) => {
    currentSound = new Sound('sample.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + currentSound.getDuration() + 'number of channels: ' + currentSound.getNumberOfChannels());
    
      currentSound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });

      currentSound.release();
    });
  });
}