import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { focusedScrollTarget } from '../utils/keyboard';
type InputInstance = React.ElementRef<typeof TextInput>;
type ScrollInstance = React.ElementRef<typeof ScrollView>;
const FocusContext = createContext<(input: InputInstance | null) => void>(() => {});
/** Keeps the focused input inside the visible scroll area on both platforms. */
export const FormScreen = ({
  children,
  contentContainerStyle,
  headerOffset,
}: {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  headerOffset?: number;
}) => {
  const scroll = useRef<ScrollInstance>(null);
  const focusedInput = useRef<InputInstance | null>(null);
  const scrollY = useRef(0);
  const keyboardTop = useRef(Number.POSITIVE_INFINITY);
  const pendingMeasure = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const frame = useRef<React.ElementRef<typeof View>>(null);
  const [verticalOffset, setVerticalOffset] = useState(headerOffset ?? 0);
  const insets = useSafeAreaInsets();
  const reveal = useCallback((input: InputInstance | null) => {
    focusedInput.current = input;
    if (pendingMeasure.current) clearTimeout(pendingMeasure.current);
    pendingMeasure.current = setTimeout(() => {
      if (!input || !scroll.current) return;
      scroll.current.measureInWindow((_x, top, _width, height) => {
        input.measureInWindow((_inputX, inputTop, _inputWidth, inputHeight) => {
          const target = focusedScrollTarget({
            viewportTop: top,
            viewportHeight: height,
            inputTop,
            inputHeight,
            keyboardTop: keyboardTop.current,
            scrollY: scrollY.current,
          });
          if (Math.abs(target - scrollY.current) > 1)
            scroll.current?.scrollTo({ y: target, animated: true });
        });
      });
    }, 140);
  }, []);
  useEffect(() => {
    const shown = Keyboard.addListener('keyboardDidShow', (event) => {
      keyboardTop.current = event.endCoordinates.screenY;
      setKeyboardVisible(true);
      reveal(focusedInput.current);
    });
    const hidden = Keyboard.addListener('keyboardDidHide', () => {
      keyboardTop.current = Number.POSITIVE_INFINITY;
      setKeyboardVisible(false);
    });
    return () => {
      shown.remove();
      hidden.remove();
      if (pendingMeasure.current) clearTimeout(pendingMeasure.current);
    };
  }, [reveal]);
  return (
    <FocusContext.Provider value={reveal}>
      <View
        ref={frame}
        style={UI.screen}
        onLayout={() => frame.current?.measureInWindow((_x, top) => setVerticalOffset(top))}
      >
        <KeyboardAvoidingView
          style={UI.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={verticalOffset}
        >
          <ScrollView
            ref={scroll}
            style={UI.screen}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: keyboardVisible ? 32 : Math.max(insets.bottom, 12) + 24 },
              contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            scrollEventThrottle={16}
            onScroll={(event) => {
              scrollY.current = event.nativeEvent.contentOffset.y;
            }}
            onLayout={() => {
              if (keyboardTop.current !== Number.POSITIVE_INFINITY) reveal(focusedInput.current);
            }}
          >
            {children}
          </ScrollView>
          {keyboardVisible && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ocultar teclado"
              onPress={Keyboard.dismiss}
              style={styles.keyboardBar}
            >
              <Text style={styles.keyboardText}>Concluir digitação ↓</Text>
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </View>
    </FocusContext.Provider>
  );
};
export const FormField = ({
  label,
  hint,
  style,
  multiline,
  onFocus,
  onBlur,
  ...props
}: TextInputProps & { label: string; hint?: string }) => {
  const input = useRef<InputInstance>(null);
  const reveal = useContext(FocusContext);
  const [focused, setFocused] = useState(false);
  const [height, setHeight] = useState(112);
  return (
    <View>
      <Text style={UI.label}>{label}</Text>
      <TextInput
        {...props}
        ref={input}
        accessibilityLabel={props.accessibilityLabel ?? label}
        placeholderTextColor={Colors.gray}
        multiline={multiline}
        style={[
          styles.input,
          multiline && { height, textAlignVertical: 'top' },
          focused && styles.focused,
          props.editable === false && styles.readonly,
          style,
        ]}
        onFocus={(event) => {
          setFocused(true);
          reveal(input.current);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          reveal(null);
          onBlur?.(event);
        }}
        onContentSizeChange={(event) => {
          if (multiline)
            setHeight(Math.min(200, Math.max(112, event.nativeEvent.contentSize.height)));
          if (focused) reveal(input.current);
          props.onContentSizeChange?.(event);
        }}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 20, gap: 20 },
  input: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 15,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  focused: { borderColor: Colors.primaryDark, backgroundColor: '#F5FBFF' },
  readonly: { backgroundColor: Colors.lightGray },
  hint: { fontSize: 12, lineHeight: 18, color: Colors.textSecondary, marginTop: 6 },
  keyboardBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'flex-end',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  keyboardText: { color: Colors.primaryDark, fontSize: 14, fontWeight: '700' },
});
