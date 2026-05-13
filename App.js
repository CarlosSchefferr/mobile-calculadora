import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Provider as PaperProvider, Surface, Text } from 'react-native-paper';

const buttons = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['C', '0', '=', '+'],
];
const MAX_DISPLAY_LENGTH = 12;

const calculate = (left, right, operator) => {
  const first = Number(left);
  const second = Number(right);

  if (operator === '+') return String(first + second);
  if (operator === '-') return String(first - second);
  if (operator === '*') return String(first * second);
  if (operator === '/') {
    if (second === 0) return 'Erro';
    return String(first / second);
  }

  return right;
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [isNewValue, setIsNewValue] = useState(true);

  const handleNumber = (value) => {
    if (display === 'Erro') {
      setDisplay(value);
      setStoredValue(null);
      setOperator(null);
      setIsNewValue(false);
      return;
    }

    if (isNewValue) {
      setDisplay(value);
      setIsNewValue(false);
      return;
    }

    setDisplay((current) => {
      if (current.length >= MAX_DISPLAY_LENGTH) return current;
      return current === '0' ? value : `${current}${value}`;
    });
  };

  const handleOperator = (nextOperator) => {
    if (storedValue !== null && operator && !isNewValue) {
      const result = calculate(storedValue, display, operator);
      setDisplay(result);
      setStoredValue(result);
    } else {
      setStoredValue(display);
    }

    setOperator(nextOperator);
    setIsNewValue(true);
  };

  const handleEquals = () => {
    if (storedValue === null || !operator) return;

    const result = calculate(storedValue, display, operator);
    setDisplay(result);
    setStoredValue(null);
    setOperator(null);
    setIsNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setIsNewValue(true);
  };

  const onPress = (value) => {
    if (value === 'C') {
      handleClear();
      return;
    }

    if (value === '=') {
      handleEquals();
      return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
      handleOperator(value);
      return;
    }

    handleNumber(value);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="light" />

        <Surface style={styles.calculator} elevation={4}>
          <Surface style={styles.display} elevation={1}>
            <Text variant="displaySmall" style={styles.displayText} numberOfLines={1}>
              {display}
            </Text>
          </Surface>

          <View style={styles.keyboard}>
            {buttons.map((row) => (
              <View key={row.join('-')} style={styles.row}>
                {row.map((label) => (
                  <Button
                    key={label}
                    mode={['/', '*', '-', '+', '=', 'C'].includes(label) ? 'contained' : 'contained-tonal'}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    onPress={() => onPress(label)}
                  >
                    {label}
                  </Button>
                ))}
              </View>
            ))}
          </View>
        </Surface>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    padding: 16,
  },
  calculator: {
    padding: 16,
    borderRadius: 16,
    gap: 16,
    backgroundColor: '#2e2e2e',
  },
  display: {
    minHeight: 100,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#121212',
  },
  displayText: {
    color: '#fff',
    textAlign: 'right',
  },
  keyboard: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    height: 56,
  },
});
