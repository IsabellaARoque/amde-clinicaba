import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../theme/colors';
type IconName =
  | 'patients'
  | 'profile'
  | 'search'
  | 'arrow'
  | 'back'
  | 'plus'
  | 'check'
  | 'close'
  | 'chevron';
export const Icon = ({
  name,
  size = 24,
  color = Colors.text,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) => {
  if (name === 'search')
    return (
      <View accessible={false} style={{ width: size, height: size }}>
        <View
          style={{
            width: size * 0.62,
            height: size * 0.62,
            borderWidth: 2,
            borderColor: color,
            borderRadius: size,
            position: 'absolute',
            top: 2,
            left: 1,
          }}
        />
        <View
          style={{
            width: size * 0.4,
            height: 2,
            backgroundColor: color,
            position: 'absolute',
            right: 0,
            bottom: size * 0.2,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    );
  if (name === 'profile' || name === 'patients')
    return (
      <View
        accessible={false}
        style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      >
        <View
          style={{
            width: size * 0.32,
            height: size * 0.32,
            borderWidth: 1.8,
            borderColor: color,
            borderRadius: size,
            position: 'absolute',
            top: size * 0.08,
          }}
        />
        <View
          style={{
            width: size * 0.7,
            height: size * 0.38,
            borderWidth: 1.8,
            borderColor: color,
            borderTopLeftRadius: size,
            borderTopRightRadius: size,
            position: 'absolute',
            bottom: size * 0.06,
          }}
        />
        {name === 'patients' && (
          <>
            <View
              style={{
                width: size * 0.22,
                height: size * 0.22,
                backgroundColor: color,
                borderRadius: size,
                position: 'absolute',
                left: -2,
                top: size * 0.25,
              }}
            />
            <View
              style={{
                width: size * 0.22,
                height: size * 0.22,
                backgroundColor: color,
                borderRadius: size,
                position: 'absolute',
                right: -2,
                top: size * 0.25,
              }}
            />
          </>
        )}
      </View>
    );
  const glyph = { arrow: '→', back: '←', plus: '+', check: '✓', close: '×', chevron: '›' }[name];
  return (
    <Text
      accessible={false}
      style={{
        textAlign: 'center',
        fontWeight: '500',
        color,
        fontSize: size,
        lineHeight: size + 6,
      }}
    >
      {glyph}
    </Text>
  );
};
