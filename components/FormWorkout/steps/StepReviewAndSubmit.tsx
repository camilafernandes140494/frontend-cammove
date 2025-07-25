import { View } from 'react-native';
import { Button, Card } from 'react-native-paper';

interface StepReviewAndSubmitProps {
  onSubmit?: () => void;
  disabled: boolean;
  loading: boolean;
}

const StepReviewAndSubmit = ({
  onSubmit,
  disabled,
  loading,
}: StepReviewAndSubmitProps) => {
  return (
    <View style={{ marginVertical: 20 }}>
      <Card mode="outlined">
        <Card.Content>
          <Button
            disabled={disabled}
            loading={loading}
            mode="contained"
            onPress={onSubmit}
          >
            Enviar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};
export default StepReviewAndSubmit;
