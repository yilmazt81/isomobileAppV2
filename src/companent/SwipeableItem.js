import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

/**
 * Props:
 * - children: içine sarılacak içerik
 * - renderLeftActions / renderRightActions: (progress, dragX) => ReactNode
 * - onSwipeableOpen: (direction) => void
 * - onPress: dokunma
 * - overshootLeft / overshootRight: boolean
 */
const SwipeableItem = ({
  children,
  renderLeftActions,
  renderRightActions,
  onSwipeableOpen,
  overshootLeft = false,
  overshootRight = false,
  onPress,
}) => {
  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={overshootLeft}
      overshootRight={overshootRight}
      onSwipeableOpen={(dir) => {
        if (onSwipeableOpen) {
          // direction string bazen ters gelebiliyor, kullanıcıya 'left'/'right' olarak iletebilirsin
          onSwipeableOpen(dir === 'left' ? 'right' : 'left');
        }
      }}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.container}>{children}</View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default SwipeableItem;
